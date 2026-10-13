import os
import re
import time
import mimetypes
from typing import Optional
# pyrefly: ignore [missing-import]
from fastapi import UploadFile, HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy import cast, Text, or_
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
import models
from utils.storage import save_upload_file


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')


def _image_dimensions(upload_file: UploadFile):
    try:
        # pyrefly: ignore [missing-import]
        from PIL import Image
        with Image.open(upload_file.file) as img:
            return img.width, img.height
    except Exception:
        return None, None
    finally:
        upload_file.file.seek(0)


def store_upload(db: Session, file: UploadFile, seo_name: Optional[str] = None, remove_bg: bool = False, alt_text: Optional[str] = None) -> models.Media:
    """Saves an uploaded file to storage and records it in the media library."""
    original_filename = file.filename if file.filename else "uploaded_asset"
    name, ext = os.path.splitext(original_filename)

    base_name = slugify(seo_name) if seo_name else slugify(name)
    if not base_name:
        base_name = "asset"

    timestamp = int(time.time() * 1000)
    new_filename = f"{base_name}-{timestamp}{ext.lower()}"

    file.file.seek(0, os.SEEK_END)
    size = file.file.tell()
    file.file.seek(0)

    mime_type = file.content_type or mimetypes.guess_type(original_filename)[0]
    width, height = (None, None)
    if mime_type and mime_type.startswith("image/") and not mime_type.endswith("svg+xml"):
        width, height = _image_dimensions(file)

    file_url = save_upload_file(file, new_filename, remove_bg=remove_bg)
    if not file_url:
        raise HTTPException(status_code=500, detail="Failed to upload file")

    media = models.Media(
        url=file_url,
        filename=new_filename,
        original_name=original_filename,
        alt_text=alt_text or (seo_name or name.replace('-', ' ').replace('_', ' ')).strip(),
        mime_type=mime_type,
        size=size,
        width=width,
        height=height,
    )
    db.add(media)
    db.commit()
    db.refresh(media)
    return media


def _like(column, url: str):
    escaped = url.replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_')
    return cast(column, Text).like(f"%{escaped}%", escape='\\')


def find_media_usage(db: Session, url: str) -> list[str]:
    """Returns human readable places where a media URL is referenced."""
    usage: list[str] = []

    product_cols = [
        models.Product.cover_image, models.Product.hero_animated_image,
        models.Product.section1_image, models.Product.section2_image,
        models.Product.banner_images, models.Product.description_points,
    ]
    for p in db.query(models.Product).filter(or_(*[_like(c, url) for c in product_cols])).all():
        usage.append(f"Product: {p.name}")

    for c in db.query(models.Category).filter(_like(models.Category.cover_image, url)).all():
        usage.append(f"Category: {c.name}")

    for p in db.query(models.Page).filter(_like(models.Page.og_image, url)).all():
        usage.append(f"Page: {p.title or p.slug}")

    for s in db.query(models.SiteSetting).filter(_like(models.SiteSetting.value, url)).all():
        usage.append(f"Setting: {s.key}")

    return usage


def _collect_urls(value, found: set):
    if isinstance(value, dict):
        for v in value.values():
            _collect_urls(v, found)
    elif isinstance(value, list):
        for v in value:
            _collect_urls(v, found)
    elif isinstance(value, str):
        if value.startswith("/uploads/") or "res.cloudinary.com" in value:
            found.add(value)


def sync_existing_media(db: Session, upload_dir: str) -> int:
    """Registers files that were uploaded before the media library existed."""
    found: set = set()

    for p in db.query(models.Product).all():
        for v in [p.cover_image, p.hero_animated_image, p.section1_image, p.section2_image, p.banner_images, p.description_points]:
            _collect_urls(v, found)
    for c in db.query(models.Category).all():
        _collect_urls(c.cover_image, found)
    for p in db.query(models.Page).all():
        _collect_urls(p.og_image, found)
    for s in db.query(models.SiteSetting).all():
        _collect_urls(s.value, found)

    if os.path.isdir(upload_dir):
        for fname in os.listdir(upload_dir):
            if os.path.isfile(os.path.join(upload_dir, fname)):
                found.add(f"/uploads/{fname}")

    existing = {m.url for m in db.query(models.Media.url).all()}
    added = 0
    for url in sorted(found - existing):
        filename = url.rsplit('/', 1)[-1]
        size = None
        if url.startswith("/uploads/"):
            local_path = os.path.join(upload_dir, filename)
            if not os.path.exists(local_path):
                continue  # referenced but missing on disk, nothing to reuse
            size = os.path.getsize(local_path)
        db.add(models.Media(
            url=url,
            filename=filename,
            original_name=filename,
            alt_text=os.path.splitext(filename)[0].replace('-', ' ').replace('_', ' '),
            mime_type=mimetypes.guess_type(filename)[0],
            size=size,
        ))
        added += 1
    db.commit()
    return added
