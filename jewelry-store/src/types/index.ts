export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  metal: string;
  stone?: string;
  weight: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  sizes?: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  engraving?: string;
  giftWrap?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
  favorites: string[];
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  createdAt: string;
  trackingNumber?: string;
}

export interface FilterOptions {
  category?: string[];
  metal?: string[];
  stone?: string[];
  priceRange?: [number, number];
  sortBy?: 'popular' | 'price-asc' | 'price-desc' | 'newest';
}

export interface BuilderStep {
  id: number;
  title: string;
  titleAr: string;
  isComplete: boolean;
  isActive: boolean;
}

export interface CustomJewelry {
  type: 'ring' | 'bracelet' | 'necklace' | 'earrings';
  metal: string;
  stone: string;
  size: string;
  engraving?: string;
  giftWrap?: boolean;
}
