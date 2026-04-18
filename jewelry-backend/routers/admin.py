from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
from models import (
    User,
    Product,
    Category,
    Jeweler,
    Order,
    PaymentMethod,
    UserGeneratedDesign,
    DesignRequest,
    UserRole,
    OrderStatus,
    DesignRequestStatus,
)
from schemas import (
    ProductCreate,
    ProductResponse,
    CategoryCreate,
    CategoryResponse,
    OrderResponse,
    UserResponse,
    CustomDesignRequestResponse,
)
from routers.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["admin"])


def check_admin(user: User):
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )


class OrderStatusUpdate(BaseModel):
    new_status: OrderStatus


class DesignRequestStatusUpdate(BaseModel):
    new_status: DesignRequestStatus


@router.get("/dashboard-stats")
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    total_users = db.query(User).count()
    total_orders = db.query(Order).count()
    total_designs = db.query(UserGeneratedDesign).count()
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0
    pending_orders = db.query(Order).filter(Order.status == OrderStatus.PENDING).count()
    recent_orders = db.query(Order).order_by(Order.order_date.desc()).limit(5).all()
    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "total_designs": total_designs,
        "total_revenue": float(total_revenue),
        "pending_orders": pending_orders,
        "recent_orders": [
            {
                "id": o.id,
                "user_id": o.user_id,
                "status": o.status.value if o.status else None,
                "total_amount": o.total_amount,
                "order_date": o.order_date.isoformat() if o.order_date else None,
            }
            for o in recent_orders
        ],
    }


@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    return db.query(User).all()


@router.get("/designs")
def get_all_designs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    designs = (
        db.query(UserGeneratedDesign)
        .order_by(UserGeneratedDesign.created_at.desc())
        .all()
    )
    return [
        {
            "id": d.id,
            "user_id": d.user_id,
            "username": d.user.username if d.user else None,
            "generated_image_url": d.generated_image_url,
            "selected_options": d.selected_options,
            "prompt_used": d.prompt_used,
            "model_used": d.model_used,
            "is_favorite": d.is_favorite,
            "created_at": d.created_at.isoformat() if d.created_at else None,
        }
        for d in designs
    ]


@router.get("/design-requests", response_model=List[CustomDesignRequestResponse])
def get_all_design_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    return db.query(DesignRequest).order_by(DesignRequest.request_date.desc()).all()


@router.put("/design-requests/{request_id}/status")
def update_design_request_status(
    request_id: int,
    body: DesignRequestStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    dr = db.query(DesignRequest).filter(DesignRequest.id == request_id).first()
    if not dr:
        raise HTTPException(status_code=404, detail="Design request not found")
    dr.status = body.new_status
    db.commit()
    return {"message": "Design request status updated", "status": dr.status.value}


@router.post("/products", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
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
        image_path=product.image_path,
    )
    db.add(new_product)

    if product.category_ids:
        categories = (
            db.query(Category).filter(Category.id.in_(product.category_ids)).all()
        )
        new_product.categories = categories

    db.commit()
    db.refresh(new_product)
    return new_product


@router.post("/categories", response_model=CategoryResponse)
def create_category(
    category: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    new_category = Category(name=category.name, parent_id=category.parent_id)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


@router.get("/orders", response_model=List[OrderResponse])
def get_all_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    return db.query(Order).all()


@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    body: OrderStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = body.new_status
    db.commit()
    return {"message": "Order status updated", "status": order.status.value}
