# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, Request
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional, List
# pyrefly: ignore [missing-import]
from sqlalchemy import or_
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas import FaqResponse, FaqCreate, FaqUpdate
from utils.audit import log_audit
from utils.faqs import validate_location, get_location_faqs

router = APIRouter(
    prefix="/faqs",
    tags=["admin_faqs"],
)

class PlacementUpdate(BaseModel):
    location: str
    faq_ids: List[int]

def _serialize(faq: models.Faq) -> dict:
    return {
        "id": faq.id,
        "question": faq.question,
        "answer": faq.answer,
        "is_active": faq.is_active,
        "locations": sorted({p.location for p in faq.placements}),
    }

@router.get("", response_model=List[FaqResponse])
def list_faqs(q: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Faq)
    if q:
        like = f"%{q}%"
        query = query.filter(or_(models.Faq.question.ilike(like), models.Faq.answer.ilike(like)))
    return [_serialize(f) for f in query.order_by(models.Faq.id.desc()).all()]

@router.post("", response_model=FaqResponse)
def create_faq(data: FaqCreate, request: Request, db: Session = Depends(get_db)):
    faq = models.Faq(question=data.question.strip(), answer=data.answer.strip(), is_active=data.is_active)
    db.add(faq)
    db.flush()
    for location in data.locations or []:
        location = validate_location(location)
        next_seq = db.query(models.FaqPlacement).filter(models.FaqPlacement.location == location).count()
        db.add(models.FaqPlacement(faq_id=faq.id, location=location, sequence=next_seq))
    log_audit(db, request, "Created", "faq", faq.id, f"Created FAQ: {faq.question}")
    db.commit()
    db.refresh(faq)
    return _serialize(faq)

@router.get("/placements", response_model=List[FaqResponse])
def get_placements(location: str, db: Session = Depends(get_db)):
    location = validate_location(location)
    return [_serialize(f) for f in get_location_faqs(db, location, active_only=False)]

@router.put("/placements", response_model=List[FaqResponse])
def set_placements(data: PlacementUpdate, request: Request, db: Session = Depends(get_db)):
    location = validate_location(data.location)
    # Keep the given order, drop duplicates and unknown ids
    seen, faq_ids = set(), []
    for fid in data.faq_ids:
        if fid not in seen:
            seen.add(fid)
            faq_ids.append(fid)
    existing = {f.id for f in db.query(models.Faq.id).filter(models.Faq.id.in_(faq_ids)).all()} if faq_ids else set()

    db.query(models.FaqPlacement).filter(models.FaqPlacement.location == location).delete(synchronize_session=False)
    for seq, fid in enumerate(f for f in faq_ids if f in existing):
        db.add(models.FaqPlacement(faq_id=fid, location=location, sequence=seq))
    log_audit(db, request, "Updated", "faq", None, f"Updated FAQs on {location} ({len(existing)} FAQs)")
    db.commit()
    return [_serialize(f) for f in get_location_faqs(db, location, active_only=False)]

@router.put("/{faq_id}", response_model=FaqResponse)
def update_faq(faq_id: int, data: FaqUpdate, request: Request, db: Session = Depends(get_db)):
    faq = db.query(models.Faq).filter(models.Faq.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    updates = data.model_dump(exclude_unset=True)
    locations = updates.pop("locations", None)
    for key, value in updates.items():
        setattr(faq, key, value.strip() if isinstance(value, str) else value)

    if locations is not None:
        wanted = {validate_location(l) for l in locations}
        current = {p.location: p for p in faq.placements}
        for location, placement in current.items():
            if location not in wanted:
                db.delete(placement)
        for location in wanted - current.keys():
            next_seq = db.query(models.FaqPlacement).filter(models.FaqPlacement.location == location).count()
            db.add(models.FaqPlacement(faq_id=faq.id, location=location, sequence=next_seq))

    log_audit(db, request, "Updated", "faq", faq.id, f"Updated FAQ: {faq.question}")
    db.commit()
    db.refresh(faq)
    return _serialize(faq)

@router.delete("/{faq_id}")
def delete_faq(faq_id: int, request: Request, db: Session = Depends(get_db)):
    faq = db.query(models.Faq).filter(models.Faq.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    question = faq.question
    db.delete(faq)
    log_audit(db, request, "Deleted", "faq", faq_id, f"Deleted FAQ: {question}")
    db.commit()
    return {"message": "Deleted successfully"}
