from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Optional
import os, uuid
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from database import get_db
from models import (
    User,
    Product,
    Category,
    Jeweler,
    Order,
    OrderItem,
    PaymentMethod,
    UserGeneratedDesign,
    DesignRequest,
    UserRole,
    OrderStatus,
    DesignRequestStatus,
    ProductImage,
)
from schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    CategoryCreate,
    CategoryResponse,
    JewelerCreate,
    JewelerResponse,
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


import logging

logger = logging.getLogger(__name__)

@router.post("/products", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    
    # Ensure jeweler_id is valid
    jeweler_id = product.jeweler_id
    jeweler = db.query(Jeweler).filter(Jeweler.id == jeweler_id).first()
    if not jeweler:
        logger.warning(f"Jeweler ID {jeweler_id} not found, attempting to find first available jeweler")
        first_jeweler = db.query(Jeweler).first()
        if not first_jeweler:
            logger.error("No jewelers found in database")
            raise HTTPException(status_code=400, detail="No jewelers found in database. Please create a jeweler first.")
        jeweler_id = first_jeweler.id
        logger.info(f"Assigned to jeweler ID {jeweler_id}")

    try:
        # Auto-translate Arabic fields to English
        from core.translator import translate_product_fields
        translations = translate_product_fields(product.dict())

        new_product = Product(
            jeweler_id=jeweler_id,
            name=product.name,
            name_en=product.name_en or translations.get("name_en"),
            material=product.material,
            material_en=product.material_en or translations.get("material_en"),
            karat=product.karat,
            weight=product.weight,
            price=product.price,
            stock_quantity=product.stock_quantity,
            description=product.description,
            description_en=product.description_en or translations.get("description_en"),
            image_path=product.image_path,
            color=product.color,
            color_en=product.color_en or translations.get("color_en"),
            is_new=product.is_new,
            is_bestseller=product.is_bestseller,
            is_featured=product.is_featured,
        )
        db.add(new_product)

        if product.category_ids:
            categories = (
                db.query(Category).filter(Category.id.in_(product.category_ids)).all()
            )
            new_product.categories = categories

        db.commit()
        db.refresh(new_product)
        logger.info(f"Product created successfully: {new_product.id} - {new_product.name}")
        return new_product
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating product: {str(e)}")


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


@router.get("/products", response_model=List[ProductResponse])
def get_all_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    return (
        db.query(Product)
        .options(joinedload(Product.categories), joinedload(Product.images))
        .all()
    )


@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    body: ProductUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        logger.error(f"Product not found for update: {product_id}")
        raise HTTPException(status_code=404, detail="Product not found")
    
    try:
        update_data = body.model_dump(exclude_unset=True)
        category_ids = update_data.pop("category_ids", None)
        
        # Auto-translate if Arabic fields changed but _en not provided
        from core.translator import translate_product_fields
        translations = translate_product_fields(update_data)
        for k, v in translations.items():
            if k not in update_data:
                update_data[k] = v
        
        for field, value in update_data.items():
            setattr(product, field, value)
            
        if category_ids is not None:
            categories = db.query(Category).filter(Category.id.in_(category_ids)).all()
            product.categories = categories
            
        db.commit()
        db.refresh(product)
        logger.info(f"Product updated successfully: {product.id}")
        return product
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating product {product_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating product: {str(e)}")


@router.delete("/products/images/{image_id}")
def delete_product_image(
    image_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    image = db.query(ProductImage).filter(ProductImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(image)
    db.commit()
    return {"message": "Image deleted"}


@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}


@router.get("/jewelers", response_model=List[JewelerResponse])
def get_all_jewelers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    return db.query(Jeweler).all()


@router.post("/jewelers", response_model=JewelerResponse)
def create_jeweler(
    jeweler: JewelerCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    new_jeweler = Jeweler(
        name=jeweler.name,
        shop_name=jeweler.shop_name,
        bio=jeweler.bio,
        address=jeweler.address,
        phone=jeweler.phone,
        email=jeweler.email,
    )
    db.add(new_jeweler)
    db.commit()
    db.refresh(new_jeweler)
    return new_jeweler


@router.get("/orders-detailed")
def get_all_orders_detailed(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    orders = (
        db.query(Order)
        .options(
            joinedload(Order.user),
            joinedload(Order.items).joinedload(OrderItem.product),
            joinedload(Order.payment_method),
        )
        .order_by(Order.order_date.desc())
        .all()
    )
    result = []
    for o in orders:
        result.append(
            {
                "id": o.id,
                "user_id": o.user_id,
                "status": o.status.value if o.status else None,
                "total_amount": o.total_amount,
                "shipping_address": o.shipping_address,
                "transfer_receipt": o.transfer_receipt,
                "order_date": o.order_date.isoformat() if o.order_date else None,
                "user": {
                    "id": o.user.id,
                    "username": o.user.username,
                    "email": o.user.email,
                    "first_name": o.user.first_name,
                    "last_name": o.user.last_name,
                    "phone": o.user.phone,
                }
                if o.user
                else None,
                "payment_method": {
                    "id": o.payment_method.id,
                    "method_name": o.payment_method.method_name,
                }
                if o.payment_method
                else None,
                "items": [
                    {
                        "id": item.id,
                        "product_id": item.product_id,
                        "quantity": item.quantity,
                        "unit_price": item.unit_price,
                        "subtotal": item.subtotal,
                        "product": {
                            "id": item.product.id,
                            "name": item.product.name,
                            "price": item.product.price,
                            "image_path": item.product.image_path,
                        }
                        if item.product
                        else None,
                    }
                    for item in o.items
                ],
            }
        )
    return result


class AddImageUrlBody(BaseModel):
    image_url: str


@router.post("/products/{product_id}/upload-image")
def admin_upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
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


@router.post("/products/{product_id}/add-image-url")
def admin_add_image_url(
    product_id: int,
    body: AddImageUrlBody,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    max_order = (
        db.query(ProductImage)
        .filter(ProductImage.product_id == product_id)
        .order_by(ProductImage.display_order.desc())
        .first()
    )
    next_order = (max_order.display_order + 1) if max_order else 0

    if not product.image_path:
        product.image_path = body.image_url

    new_image = ProductImage(
        product_id=product_id,
        image_path=body.image_url,
        display_order=next_order,
    )
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    return {"id": new_image.id, "image_path": new_image.image_path}


# ── Payment Method QR Code Management ──
@router.get("/payment-methods")
def list_payment_methods(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    return db.query(PaymentMethod).all()


@router.put("/payment-methods/{method_id}")
def update_payment_method(
    method_id: int,
    method_name: Optional[str] = None,
    is_active: Optional[bool] = None,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    pm = db.query(PaymentMethod).filter(PaymentMethod.id == method_id).first()
    if not pm:
        raise HTTPException(status_code=404, detail="Payment method not found")
    if method_name is not None:
        pm.method_name = method_name
    if is_active is not None:
        pm.is_active = is_active
    if notes is not None:
        pm.notes = notes
    db.commit()
    db.refresh(pm)
    return pm


@router.post("/payment-methods/{method_id}/upload-qr")
def upload_payment_qr(
    method_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_admin(current_user)
    pm = db.query(PaymentMethod).filter(PaymentMethod.id == method_id).first()
    if not pm:
        raise HTTPException(status_code=404, detail="Payment method not found")
    
    save_dir = "static/qr_codes"
    os.makedirs(save_dir, exist_ok=True)
    filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    filepath = os.path.join(save_dir, filename)
    
    with open(filepath, "wb") as f:
        f.write(file.file.read())
    
    pm.qr_code_image = f"/static/qr_codes/{filename}"
    db.commit()
    db.refresh(pm)
    return {"id": pm.id, "qr_code_image": pm.qr_code_image}


# ── Transfer Receipt Upload (Customer) ──
@router.post("/upload-receipt")
def upload_transfer_receipt(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    save_dir = "static/receipts"
    os.makedirs(save_dir, exist_ok=True)
    filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    filepath = os.path.join(save_dir, filename)
    
    with open(filepath, "wb") as f:
        f.write(file.file.read())
    
    return {"receipt_path": f"/static/receipts/{filename}"}


@router.post("/products/translate-all")
def translate_all_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Translate all products that don't have English translations yet."""
    check_admin(current_user)
    from core.translator import translate_to_english
    
    products = db.query(Product).all()
    translated = 0
    errors = []
    
    for p in products:
        try:
            changed = False
            if p.name and not p.name_en:
                p.name_en = translate_to_english(p.name)
                changed = True
            if p.description and not p.description_en:
                p.description_en = translate_to_english(p.description)
                changed = True
            if p.material and not p.material_en:
                p.material_en = translate_to_english(p.material)
                changed = True
            if p.color and not p.color_en:
                p.color_en = translate_to_english(p.color)
                changed = True
            if changed:
                translated += 1
        except Exception as e:
            errors.append(f"Product {p.id}: {str(e)}")
    
    db.commit()
    return {
        "total": len(products),
        "translated": translated,
        "errors": errors,
    }
