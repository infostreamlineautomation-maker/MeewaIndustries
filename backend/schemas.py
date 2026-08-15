# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional, Any, Dict

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: int
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    slug: str
    category_id: int
    short_description: Optional[str] = None
    hero_description: Optional[str] = None
    moq: Optional[str] = None
    price_from: Optional[str] = None
    specs: Optional[Dict[str, Any]] = None
    cover_image: Optional[str] = None
    hero_animated_image: Optional[str] = None
    section1_image: Optional[str] = None
    section2_image: Optional[str] = None
    marquee_text: Optional[str] = None
    banner_images: Optional[list[str]] = None
    banner_title: Optional[str] = None
    banner_subtitle: Optional[str] = None
    description_title: Optional[str] = None
    description_points: Optional[list[str]] = None
    description_list_style: Optional[str] = "checkmarks"
    status: Optional[str] = "active"

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category_id: Optional[int] = None
    short_description: Optional[str] = None
    hero_description: Optional[str] = None
    moq: Optional[str] = None
    price_from: Optional[str] = None
    specs: Optional[Dict[str, Any]] = None
    cover_image: Optional[str] = None
    hero_animated_image: Optional[str] = None
    section1_image: Optional[str] = None
    section2_image: Optional[str] = None
    marquee_text: Optional[str] = None
    banner_images: Optional[list[str]] = None
    banner_title: Optional[str] = None
    banner_subtitle: Optional[str] = None
    description_title: Optional[str] = None
    description_points: Optional[list[str]] = None
    description_list_style: Optional[str] = None
    status: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    class Config:
        from_attributes = True

from datetime import datetime
from typing import List

class EnquiryReplyBase(BaseModel):
    message: str
    is_from_admin: bool = True

class EnquiryReplyCreate(EnquiryReplyBase):
    pass

class EnquiryReplyResponse(EnquiryReplyBase):
    id: int
    enquiry_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class EnquiryBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    product_id: Optional[int] = None
    message: str
    source_page: Optional[str] = None
    status: Optional[str] = "New"
    products_requested: Optional[list[dict]] = None

class EnquiryCreate(EnquiryBase):
    pass

class EnquiryResponse(EnquiryBase):
    id: int
    created_at: datetime
    replies: List[EnquiryReplyResponse] = []
    class Config:
        from_attributes = True

class AdminUserResponse(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True

class AuditLogResponse(BaseModel):
    id: int
    admin_id: int
    action: str
    target_type: str
    target_id: Optional[str] = None
    details: str
    created_at: datetime
    admin: AdminUserResponse
    class Config:
        from_attributes = True
