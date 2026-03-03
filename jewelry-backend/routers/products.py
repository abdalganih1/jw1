from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from database import get_db
from models import Product, Category, Jeweler
from schemas import ProductResponse, CategoryResponse

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[ProductResponse])
def get_products(
    category_id: Optional[int] = None, 
    material: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).options(joinedload(Product.categories), joinedload(Product.images))
    
    if material:
        query = query.filter(Product.material == material)
        
    if category_id:
        query = query.filter(Product.categories.any(id=category_id))
        
    return query.all()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).options(joinedload(Product.categories), joinedload(Product.images)).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/categories/", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()
