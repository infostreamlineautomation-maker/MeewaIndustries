# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, Request
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
from models import Category
from schemas import CategoryResponse, CategoryCreate, CategoryUpdate
from utils.audit import log_audit

router = APIRouter(
    prefix="/categories",
    tags=["admin_categories"],
)

@router.get("", response_model=list[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.post("", response_model=CategoryResponse)
def create_category(category: CategoryCreate, request: Request, db: Session = Depends(get_db)):
    db_cat = Category(**category.model_dump())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    log_audit(db, request, "Created", "category", db_cat.id, f"Created category: {db_cat.name}")
    return db_cat

@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    db_cat = db.query(Category).filter(Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_cat

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(category_id: int, category: CategoryUpdate, request: Request, db: Session = Depends(get_db)):
    db_cat = db.query(Category).filter(Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in category.model_dump(exclude_unset=True).items():
        setattr(db_cat, key, value)
    db.commit()
    db.refresh(db_cat)
    log_audit(db, request, "Updated", "category", db_cat.id, f"Updated category: {db_cat.name}")
    return db_cat

@router.delete("/{category_id}")
def delete_category(category_id: int, request: Request, db: Session = Depends(get_db)):
    db_cat = db.query(Category).filter(Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_cat)
    db.commit()
    log_audit(db, request, "Deleted", "category", category_id, f"Deleted category: {db_cat.name}")
    return {"message": "Deleted successfully"}
