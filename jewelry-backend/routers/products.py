from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
import os
import uuid
from database import get_db
from models import Product, Category, Jeweler, ProductImage
from schemas import ProductResponse, CategoryResponse

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=List[ProductResponse])
def get_products(
    category_id: Optional[int] = None,
    material: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Product).options(
        joinedload(Product.categories), joinedload(Product.images)
    )

    if material:
        query = query.filter(Product.material == material)

    if category_id:
        query = query.filter(Product.categories.any(id=category_id))

    return query.all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = (
        db.query(Product)
        .options(joinedload(Product.categories), joinedload(Product.images))
        .filter(Product.id == product_id)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/categories/", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


@router.post("/{product_id}/upload-image")
def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    upload_dir = os.path.join("static", "product_images")
    os.makedirs(upload_dir, exist_ok=True)

    ext = os.path.splitext(file.filename or "image.jpg")[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(upload_dir, filename)

    with open(filepath, "wb") as f:
        content = file.file.read()
        f.write(content)

    max_order = (
        db.query(ProductImage)
        .filter(ProductImage.product_id == product_id)
        .order_by(ProductImage.display_order.desc())
        .first()
    )
    next_order = (max_order.display_order + 1) if max_order else 0

    image_url = f"/static/product_images/{filename}"
    if not product.image_path:
        product.image_path = image_url

    new_image = ProductImage(
        product_id=product_id,
        image_path=image_url,
        display_order=next_order,
    )
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    return {"id": new_image.id, "image_path": new_image.image_path}
