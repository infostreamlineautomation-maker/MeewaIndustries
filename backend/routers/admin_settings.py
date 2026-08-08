# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Dict, Any, List
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
import models
from utils.storage import save_upload_file
from utils.audit import log_audit
# pyrefly: ignore [missing-import]
from fastapi import Form
import os
import time
import re

router = APIRouter(
    prefix="/settings",
    tags=["admin_settings"],
)

@router.post("/upload")
async def upload_asset(file: UploadFile = File(...), remove_bg: bool = False, seo_name: str = Form(None)):
    original_filename = file.filename if file.filename else "uploaded_asset"
    name, ext = os.path.splitext(original_filename)
    
    def slugify(text: str) -> str:
        text = text.lower()
        text = re.sub(r'[^a-z0-9]+', '-', text)
        return text.strip('-')

    base_name = slugify(seo_name) if seo_name else slugify(name)
    if not base_name:
        base_name = "asset"
        
    timestamp = int(time.time())
    new_filename = f"{base_name}-{timestamp}{ext.lower()}"
    
    file_url = save_upload_file(file, new_filename, remove_bg=remove_bg)
    if not file_url:
        raise HTTPException(status_code=500, detail="Failed to upload file")
    return {"url": file_url}

class SiteSettingUpdate(BaseModel):
    key: str
    value: Any
    
@router.get("/")
def get_all_settings(db: Session = Depends(get_db)):
    settings = db.query(models.SiteSetting).all()
    res = {}
    for s in settings:
        if isinstance(s.value, dict) and "draft" in s.value:
            res[s.key] = s.value["draft"]
        else:
            res[s.key] = s.value
    return res

@router.get("/{key}")
def get_setting(key: str, db: Session = Depends(get_db)):
    setting = db.query(models.SiteSetting).filter(models.SiteSetting.key == key).first()
    if not setting:
        return {"key": key, "value": {}} # Return empty object if not found
    val = setting.value
    if isinstance(val, dict) and "draft" in val:
        val = val["draft"]
    return {"key": setting.key, "value": val}

@router.post("/")
def update_setting(data: SiteSettingUpdate, db: Session = Depends(get_db)):
    setting = db.query(models.SiteSetting).filter(models.SiteSetting.key == data.key).first()
    if setting:
        old_val = setting.value
        if isinstance(old_val, dict) and "draft" in old_val:
            new_val = {"draft": data.value, "published": old_val.get("published")}
        else:
            new_val = {"draft": data.value, "published": old_val}
        setting.value = new_val
    else:
        setting = models.SiteSetting(key=data.key, value={"draft": data.value, "published": None})
        db.add(setting)
    
    db.commit()
    db.refresh(setting)
    return {"message": "Setting draft updated successfully", "data": {"key": setting.key, "value": setting.value["draft"]}}

@router.post("/bulk")
def update_settings(settings: List[SiteSettingUpdate], request: Request, db: Session = Depends(get_db)):
    for item in settings:
        db_item = db.query(models.SiteSetting).filter(models.SiteSetting.key == item.key).first()
        if db_item:
            old_val = db_item.value
            if isinstance(old_val, dict) and "draft" in old_val:
                db_item.value = {"draft": item.value, "published": old_val.get("published")}
            else:
                db_item.value = {"draft": item.value, "published": old_val}
        else:
            db_item = models.SiteSetting(key=item.key, value={"draft": item.value, "published": None})
            db.add(db_item)
    db.commit()
    
    # Audit log
    keys_updated = ", ".join([s.key for s in settings])
    log_audit(db, request, "Updated Draft", "settings", None, f"Updated draft settings: {keys_updated}")
    
    return {"message": "Settings drafted successfully"}

@router.post("/publish")
def publish_settings(request: Request, db: Session = Depends(get_db)):
    settings = db.query(models.SiteSetting).all()
    count = 0
    for s in settings:
        if isinstance(s.value, dict) and "draft" in s.value:
            s.value = {"draft": s.value["draft"], "published": s.value["draft"]}
            count += 1
    db.commit()
    log_audit(db, request, "Published", "settings", None, f"Published {count} settings to live website")
    return {"message": f"Successfully published {count} settings."}
