# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
from typing import Optional
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
from utils.faqs import validate_location, get_location_faqs

router = APIRouter(
    prefix="/faqs",
    tags=["faqs"],
)

@router.get("")
def get_faqs(location: str, fallback: Optional[str] = None, db: Session = Depends(get_db)):
    """FAQs for a page or product. `fallback` is used when the location has none (e.g. product -> product_default)."""
    faqs = get_location_faqs(db, validate_location(location))
    if not faqs and fallback:
        faqs = get_location_faqs(db, validate_location(fallback))
    return [{"id": f.id, "question": f.question, "answer": f.answer} for f in faqs]
