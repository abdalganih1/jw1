from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, Product, Category, Jeweler, Order, PaymentMethod
from schemas import ProductCreate, ProductResponse, CategoryCreate, CategoryResponse, OrderResponse
from routers.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

def check_admin(user: User):
    # For now, let's assume jewelers are admins or we check an 'is_admin' flag.
    # Since we don't have is_admin, we will just simulate admin check.
    # This should be improved in production.
    pass

@router.post("/products", response_model=ProductResponse)
def create_product(product: ProductCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_admin(current_user)
    new_product = Product(
        jeweler_id=product.jeweler_id,
        name=product.name,
        material=product.material,
        karat=product.karat,
        weight=product.weight,
        price=product.price,
        stock_quantity=product.stock_quantity,
        description=product.description,
        image_path=product.image_path
    )
    db.add(new_product)
    
    # Handle categories
    if product.category_ids:
        categories = db.query(Category).filter(Category.id.in_(product.category_ids)).all()
        new_product.categories = categories
        
    db.commit()
    db.refresh(new_product)
    return new_product

@router.post("/categories", response_model=CategoryResponse)
def create_category(category: CategoryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_admin(current_user)
    new_category = Category(name=category.name, parent_id=category.parent_id)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get("/orders", response_model=List[OrderResponse])
def get_all_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_admin(current_user)
    return db.query(Order).all()

@router.put("/orders/{order_id}/status")
def update_order_status(order_id: int, status: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_admin(current_user)
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    db.commit()
    return {"message": "Order status updated"}
