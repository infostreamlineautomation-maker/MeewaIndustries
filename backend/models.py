# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, Boolean, JSON, ForeignKey, DateTime
# pyrefly: ignore [missing-import]
from sqlalchemy.sql import func
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
from database import Base

class Page(Base):
    __tablename__ = "pages"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    title = Column(String)
    meta_title = Column(String)
    meta_description = Column(String)
    og_image = Column(String)
    published = Column(Boolean, default=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    name = Column(String)
    description = Column(String)
    cover_image = Column(String)
    meta_title = Column(String)
    meta_description = Column(String)
    sequence = Column(Integer, default=0)
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    name = Column(String)
    short_description = Column(String)
    hero_description = Column(String)
    moq = Column(String)
    price_from = Column(String)
    specs = Column(JSON)
    cover_image = Column(String)
    hero_animated_image = Column(String)
    marquee_text = Column(String)
    banner_images = Column(JSON)
    status = Column(String, default="active")
    sequence = Column(Integer, default=0)
    category = relationship("Category", back_populates="products")

class Enquiry(Base):
    __tablename__ = "enquiries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    message = Column(String)
    source_page = Column(String)
    status = Column(String, default="New")
    products_requested = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    replies = relationship("EnquiryReply", back_populates="enquiry")

class EnquiryReply(Base):
    __tablename__ = "enquiry_replies"
    id = Column(Integer, primary_key=True, index=True)
    enquiry_id = Column(Integer, ForeignKey("enquiries.id"))
    message = Column(String)
    is_from_admin = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    enquiry = relationship("Enquiry", back_populates="replies")

class SiteSetting(Base):
    __tablename__ = "site_settings"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(JSON)

class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("admin_users.id"))
    action = Column(String) # e.g. "Updated", "Created", "Deleted"
    target_type = Column(String) # e.g. "product", "category", "settings"
    target_id = Column(String, nullable=True) # ID of the affected resource if any
    details = Column(String) # extra info like "Changed price"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    admin = relationship("AdminUser")
