# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional, List
# pyrefly: ignore [missing-import]
from sqlalchemy import or_
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas import MediaResponse
from utils.audit import log_audit
from utils.media import store_upload, find_media_usage, sync_existing_media
from utils.storage import delete_file, LOCAL_UPLOAD_DIR

router = APIRouter(
    prefix="/media",
    tags=["admin_media"],
)

class MediaUpdate(BaseModel):
    alt_text: Optional[str] = None

@router.get("", response_model=List[MediaResponse])
def list_media(q: Optional[str] = None, type: Optional[str] = None, skip: int = 0, limit: int = 60, db: Session = Depends(get_db)):
    query = db.query(models.Media)
    if q:
        like = f"%{q}%"
        query = query.filter(or_(
            models.Media.filename.ilike(like),
            models.Media.original_name.ilike(like),
            models.Media.alt_text.ilike(like),
        ))
    if type == "image":
        query = query.filter(models.Media.mime_type.ilike("image/%"))
    elif type == "video":
        query = query.filter(models.Media.mime_type.ilike("video/%"))
    elif type == "other":
        query = query.filter(or_(
            models.Media.mime_type.is_(None),
            ~models.Media.mime_type.ilike("image/%") & ~models.Media.mime_type.ilike("video/%"),
        ))
    return query.order_by(models.Media.created_at.desc(), models.Media.id.desc()).offset(skip).limit(min(limit, 200)).all()

@router.post("/upload", response_model=List[MediaResponse])
def upload_media(request: Request, files: List[UploadFile] = File(...), seo_name: str = Form(None), db: Session = Depends(get_db)):
    uploaded = [store_upload(db, f, seo_name=seo_name) for f in files]
    log_audit(db, request, "Created", "media", None, f"Uploaded {len(uploaded)} file(s): {', '.join(m.filename for m in uploaded)}")
    db.commit()
    return uploaded

@router.post("/sync")
def sync_media(request: Request, db: Session = Depends(get_db)):
    added = sync_existing_media(db, LOCAL_UPLOAD_DIR)
    if added:
        log_audit(db, request, "Created", "media", None, f"Imported {added} existing file(s) into media library")
        db.commit()
    return {"added": added}

@router.get("/{media_id}/usage")
def media_usage(media_id: int, db: Session = Depends(get_db)):
    media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    return {"usage": find_media_usage(db, media.url)}

@router.patch("/{media_id}", response_model=MediaResponse)
def update_media(media_id: int, data: MediaUpdate, request: Request, db: Session = Depends(get_db)):
    media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(media, key, value)
    log_audit(db, request, "Updated", "media", media.id, f"Updated media: {media.filename}")
    db.commit()
    db.refresh(media)
    return media

@router.delete("/{media_id}")
def delete_media(media_id: int, request: Request, force: bool = False, db: Session = Depends(get_db)):
    media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    usage = find_media_usage(db, media.url)
    if usage and not force:
        raise HTTPException(status_code=409, detail={"message": "Media is in use", "usage": usage})
    delete_file(media.url)
    db.delete(media)
    log_audit(db, request, "Deleted", "media", media_id, f"Deleted media: {media.filename}")
    db.commit()
    return {"message": "Deleted successfully"}
