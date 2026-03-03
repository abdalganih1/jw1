from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, Cart, CartItem, Product
from schemas import CartResponse, CartItemCreate, CartItemResponse
from routers.auth import get_current_user
from datetime import datetime, timezone

router = APIRouter(prefix="/cart", tags=["cart"])

def get_or_create_cart(db: Session, user_id: int):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

@router.get("/", response_model=CartResponse)
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = get_or_create_cart(db, current_user.id)
    return cart

@router.post("/items", response_model=CartResponse)
def add_to_cart(item: CartItemCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = get_or_create_cart(db, current_user.id)
    
    # check if product exists
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # check if item already in cart
    cart_item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == item.product_id).first()
    
    if cart_item:
        cart_item.quantity += item.quantity
    else:
        new_item = CartItem(cart_id=cart.id, product_id=item.product_id, quantity=item.quantity)
        db.add(new_item)
        
    cart.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(cart)
    return cart

@router.delete("/items/{item_id}", response_model=CartResponse)
def remove_from_cart(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = get_or_create_cart(db, current_user.id)
    cart_item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")
        
    db.delete(cart_item)
    cart.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(cart)
    return cart

@router.delete("/", response_model=CartResponse)
def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = get_or_create_cart(db, current_user.id)
    # Delete all items
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    
    cart.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(cart)
    return cart
