from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from models import UserRole, OrderStatus, DesignRequestStatus


# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[datetime] = None
    gender: Optional[str] = None
    address: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    role: UserRole = UserRole.CUSTOMER
    created_at: datetime

    class Config:
        from_attributes = True


# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# --- Jeweler Schemas ---
class JewelerBase(BaseModel):
    name: str
    shop_name: str
    bio: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: EmailStr


class JewelerCreate(JewelerBase):
    pass


class JewelerResponse(JewelerBase):
    id: int
    rating: float
    created_at: datetime

    class Config:
        from_attributes = True


# --- Category Schemas ---
class CategoryBase(BaseModel):
    name: str
    parent_id: Optional[int] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True


# --- Product Image Schemas ---
class ProductImageBase(BaseModel):
    image_path: str
    display_order: Optional[int] = 0


class ProductImageCreate(ProductImageBase):
    product_id: int


class ProductImageResponse(ProductImageBase):
    id: int
    product_id: int

    class Config:
        from_attributes = True


# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    material: Optional[str] = None
    color: Optional[str] = None
    karat: Optional[str] = None
    weight: Optional[float] = None
    price: float
    stock_quantity: Optional[int] = 0
    description: Optional[str] = None
    image_path: Optional[str] = None
    is_new: Optional[bool] = True
    is_bestseller: Optional[bool] = False
    is_featured: Optional[bool] = False

class ProductCreate(ProductBase):
    jeweler_id: int
    category_ids: List[int] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    material: Optional[str] = None
    color: Optional[str] = None
    karat: Optional[str] = None
    weight: Optional[float] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    description: Optional[str] = None
    image_path: Optional[str] = None
    is_new: Optional[bool] = None
    is_bestseller: Optional[bool] = None
    is_featured: Optional[bool] = None
    category_ids: Optional[List[int]] = None


class ProductResponse(ProductBase):
    id: int
    jeweler_id: int
    categories: List[CategoryResponse] = []
    images: List[ProductImageResponse] = []

    class Config:
        from_attributes = True


# --- Cart Schemas ---
class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemCreate(CartItemBase):
    pass


class CartItemResponse(CartItemBase):
    id: int
    cart_id: int
    product: ProductResponse

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    id: int
    user_id: int
    updated_at: datetime
    items: List[CartItemResponse] = []

    class Config:
        from_attributes = True


# --- Payment Method Schemas ---
class PaymentMethodBase(BaseModel):
    method_name: str
    qr_code_image: Optional[str] = None
    is_active: Optional[bool] = True
    notes: Optional[str] = None


class PaymentMethodResponse(PaymentMethodBase):
    id: int

    class Config:
        from_attributes = True


# --- Order Schemas ---
class OrderBase(BaseModel):
    payment_method_id: Optional[int] = None
    total_amount: float
    shipping_address: Optional[str] = None
    transfer_receipt: Optional[str] = None
    status: Optional[OrderStatus] = OrderStatus.PENDING


class OrderCreate(BaseModel):  # for checkout from cart
    payment_method_id: Optional[int] = None
    shipping_address: str
    transfer_receipt: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    subtotal: float
    product: ProductResponse

    class Config:
        from_attributes = True


class OrderResponse(OrderBase):
    id: int
    user_id: int
    order_date: datetime
    items: List[OrderItemResponse] = []
    payment_method: Optional[PaymentMethodResponse] = None

    class Config:
        from_attributes = True


# --- AI Design Schemas ---
class AIDesignRequest(BaseModel):
    type: str
    color: str
    shape: str = "classic"
    material: str
    karat: str
    weight: Optional[float] = None
    gemstone_type: Optional[str] = None
    gemstone_color: Optional[str] = None
    gemstone_cut: Optional[str] = "Round"
    gemstone_size: Optional[float] = None
    style_notes: Optional[str] = None


class AIDesignResponse(BaseModel):
    id: int
    generated_image_url: str
    selected_options: Dict[str, Any]
    prompt_used: Optional[str] = None
    model_used: Optional[str] = None


class UserGeneratedDesignResponse(BaseModel):
    id: int
    user_id: int
    selected_options: Dict[str, Any]
    generated_image_url: str
    created_at: datetime
    prompt_used: Optional[str] = None
    model_used: Optional[str] = None
    is_favorite: bool = False

    class Config:
        from_attributes = True


class AIDesignListResponse(BaseModel):
    designs: List[UserGeneratedDesignResponse]
    total: int


# --- Design Request Schemas ---
class CustomDesignRequestCreate(BaseModel):
    jeweler_id: int
    generated_design_id: Optional[int] = None
    description: Optional[str] = None
    attachment_url: Optional[str] = None
    estimated_budget: Optional[float] = None


class CustomDesignRequestResponse(BaseModel):
    id: int
    user_id: int
    jeweler_id: int
    generated_design_id: Optional[int] = None
    request_date: datetime
    description: Optional[str] = None
    attachment_url: Optional[str] = None
    estimated_budget: Optional[float] = None
    jeweler_price_offer: Optional[float] = None
    status: DesignRequestStatus

    class Config:
        from_attributes = True
