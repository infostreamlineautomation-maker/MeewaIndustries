# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, Request
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import get_db
from models import Product
from schemas import ProductResponse, ProductCreate, ProductUpdate
from utils.audit import log_audit

router = APIRouter(
    prefix="/products",
    tags=["admin_products"],
)

@router.get("/", response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, request: Request, db: Session = Depends(get_db)):
    db_prod = Product(**product.model_dump())
    db.add(db_prod)
    db.commit()
    db.refresh(db_prod)
    log_audit(db, request, "Created", "product", db_prod.id, f"Created product: {db_prod.name}")
    return db_prod

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    db_prod = db.query(Product).filter(Product.id == product_id).first()
    if not db_prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_prod

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product: ProductUpdate, request: Request, db: Session = Depends(get_db)):
    db_prod = db.query(Product).filter(Product.id == product_id).first()
    if not db_prod:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.model_dump(exclude_unset=True).items():
        setattr(db_prod, key, value)
    db.commit()
    db.refresh(db_prod)
    log_audit(db, request, "Updated", "product", db_prod.id, f"Updated product: {db_prod.name}")
    return db_prod

@router.delete("/{product_id}")
def delete_product(product_id: int, request: Request, db: Session = Depends(get_db)):
    db_prod = db.query(Product).filter(Product.id == product_id).first()
    if not db_prod:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_prod)
    db.commit()
    log_audit(db, request, "Deleted", "product", product_id, f"Deleted product: {db_prod.name}")
    return {"message": "Deleted successfully"}
