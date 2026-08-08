# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(
    prefix="/settings",
    tags=["settings"],
)

@router.get("/")
def get_public_settings(preview: bool = False, db: Session = Depends(get_db)):
    settings = db.query(models.SiteSetting).all()
    # In a real app, you might want to restrict which keys are public
    res = {}
    for s in settings:
        if isinstance(s.value, dict) and "published" in s.value:
            res[s.key] = s.value["draft"] if preview else s.value["published"]
        else:
            res[s.key] = s.value
    return res

@router.get("/{key}")
def get_public_setting(key: str, preview: bool = False, db: Session = Depends(get_db)):
    setting = db.query(models.SiteSetting).filter(models.SiteSetting.key == key).first()
    if not setting:
        return {"key": key, "value": {}}
    val = setting.value
    if isinstance(val, dict) and "published" in val:
        val = val["draft"] if preview else val["published"]
    return {"key": setting.key, "value": val}
