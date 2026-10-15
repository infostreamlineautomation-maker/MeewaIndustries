import re
# pyrefly: ignore [missing-import]
from fastapi import HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
import models

# Pages that render the FAQ section on the public website
PAGE_LOCATIONS = ["landing", "about", "products", "product_default"]
_PRODUCT_LOCATION = re.compile(r"^product:\d+$")


def validate_location(location: str) -> str:
    location = (location or "").strip()
    if location in PAGE_LOCATIONS or _PRODUCT_LOCATION.match(location):
        return location
    raise HTTPException(status_code=400, detail=f"Unknown FAQ location: {location}")


def get_location_faqs(db: Session, location: str, active_only: bool = True) -> list[models.Faq]:
    query = (
        db.query(models.Faq)
        .join(models.FaqPlacement, models.FaqPlacement.faq_id == models.Faq.id)
        .filter(models.FaqPlacement.location == location)
    )
    if active_only:
        query = query.filter(models.Faq.is_active.is_(True))
    return query.order_by(models.FaqPlacement.sequence.asc(), models.FaqPlacement.id.asc()).all()
