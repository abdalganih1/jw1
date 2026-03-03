from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, Cart, Order, OrderItem, PaymentMethod
from schemas import OrderCreate, OrderResponse
from routers.auth import get_current_user
from routers.cart import get_or_create_cart
from datetime import datetime, timezone

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/checkout", response_model=OrderResponse)
def checkout(order_data: OrderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = get_or_create_cart(db, current_user.id)
    
    if not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
        
    # verify payment method if provided
    if order_data.payment_method_id:
        payment_method = db.query(PaymentMethod).filter(PaymentMethod.id == order_data.payment_method_id).first()
        if not payment_method or not payment_method.is_active:
            raise HTTPException(status_code=400, detail="Invalid or inactive payment method")

    # calculate total
    total_amount = 0.0
    for item in cart.items:
        total_amount += item.product.price * item.quantity
        
    new_order = Order(
        user_id=current_user.id,
        payment_method_id=order_data.payment_method_id,
        total_amount=total_amount,
        shipping_address=order_data.shipping_address,
        transfer_receipt=order_data.transfer_receipt
    )
    
    db.add(new_order)
    db.flush() # get order id
    
    for item in cart.items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.product.price,
            subtotal=item.product.price * item.quantity
        )
        db.add(order_item)
        
    # clear cart
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    cart.updated_at = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/", response_model=List[OrderResponse])
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.user_id == current_user.id).all()

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
