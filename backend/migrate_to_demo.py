import os
import sys
import json
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models import Base, Category, Product, Enquiry, EnquiryReply, SiteSetting, AdminUser, AuditLog

old_url = "postgresql+psycopg://postgres:root123@localhost:5432/meewa"
new_url = os.getenv("DATABASE_URL")

if new_url == old_url or not new_url:
    print("Please set DATABASE_URL to your Supabase URL in .env")
    sys.exit(1)

old_engine = create_engine(old_url)
OldSession = sessionmaker(bind=old_engine)
old_db = OldSession()

new_engine = create_engine(new_url)
NewSession = sessionmaker(bind=new_engine)
new_db = NewSession()

print("Creating tables in Supabase...")
Base.metadata.drop_all(new_engine)
Base.metadata.create_all(new_engine)

print("Uploading media to Cloudinary...")
url_map = {}
uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
if os.path.exists(uploads_dir):
    for filename in os.listdir(uploads_dir):
        filepath = os.path.join(uploads_dir, filename)
        if os.path.isfile(filepath):
            print(f"Uploading {filename}...")
            try:
                # We use use_filename=True to keep track
                res = cloudinary.uploader.upload(filepath, resource_type="auto")
                url_map[f"/uploads/{filename}"] = res.get("secure_url")
                url_map[f"uploads/{filename}"] = res.get("secure_url") # sometimes no leading slash
            except Exception as e:
                print(f"Failed to upload {filename}: {e}")

def replace_urls(val):
    if not val:
        return val
    if isinstance(val, str):
        for local_url, cloud_url in url_map.items():
            val = val.replace(local_url, cloud_url)
        return val
    if isinstance(val, (dict, list)):
        val_str = json.dumps(val)
        for local_url, cloud_url in url_map.items():
            val_str = val_str.replace(local_url, cloud_url)
        return json.loads(val_str)
    return val

print("Migrating Categories...")
for old_cat in old_db.query(Category).all():
    new_db.add(Category(
        id=old_cat.id,
        slug=old_cat.slug,
        name=old_cat.name,
        description=old_cat.description,
        cover_image=replace_urls(old_cat.cover_image),
        meta_title=old_cat.meta_title,
        meta_description=old_cat.meta_description,
        sequence=old_cat.sequence
    ))

print("Migrating Products...")
for old_prod in old_db.query(Product).all():
    new_db.add(Product(
        id=old_prod.id,
        slug=old_prod.slug,
        category_id=old_prod.category_id,
        name=old_prod.name,
        short_description=old_prod.short_description,
        hero_description=old_prod.hero_description,
        moq=old_prod.moq,
        price_from=old_prod.price_from,
        specs=old_prod.specs,
        cover_image=replace_urls(old_prod.cover_image),
        hero_animated_image=replace_urls(old_prod.hero_animated_image),
        marquee_text=old_prod.marquee_text,
        banner_images=replace_urls(old_prod.banner_images),
        status=old_prod.status,
        sequence=old_prod.sequence
    ))

print("Migrating Enquiries...")
for e in old_db.query(Enquiry).all():
    new_db.add(Enquiry(
        id=e.id,
        name=e.name,
        email=e.email,
        phone=e.phone,
        product_id=e.product_id,
        message=e.message,
        source_page=e.source_page,
        status=e.status,
        products_requested=e.products_requested,
        created_at=e.created_at
    ))

for er in old_db.query(EnquiryReply).all():
    new_db.add(EnquiryReply(
        id=er.id,
        enquiry_id=er.enquiry_id,
        message=er.message,
        is_from_admin=er.is_from_admin,
        created_at=er.created_at
    ))

print("Migrating Admin Users...")
for a in old_db.query(AdminUser).all():
    new_db.add(AdminUser(
        id=a.id,
        username=a.username,
        password_hash=a.password_hash,
        created_at=a.created_at
    ))

print("Migrating Audit Logs...")
for al in old_db.query(AuditLog).all():
    new_db.add(AuditLog(
        id=al.id,
        admin_id=al.admin_id,
        action=al.action,
        target_type=al.target_type,
        target_id=al.target_id,
        details=al.details,
        created_at=al.created_at
    ))

print("Migrating Site Settings...")
for s in old_db.query(SiteSetting).all():
    new_db.add(SiteSetting(
        id=s.id,
        key=s.key,
        value=replace_urls(s.value)
    ))

new_db.commit()

print("Updating Postgres Sequences...")
tables_seqs = {
    'categories': 'categories_id_seq',
    'products': 'products_id_seq',
    'enquiries': 'enquiries_id_seq',
    'enquiry_replies': 'enquiry_replies_id_seq',
    'admin_users': 'admin_users_id_seq',
    'audit_logs': 'audit_logs_id_seq',
    'site_settings': 'site_settings_id_seq'
}
for table, seq in tables_seqs.items():
    new_db.execute(text(f"SELECT setval('{seq}', coalesce(max(id), 1), max(id) IS NOT null) FROM {table};"))
new_db.commit()

old_db.close()
new_db.close()
print("Migration completed successfully!")
