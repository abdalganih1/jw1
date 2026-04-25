import { Product } from '@/types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export function resolveImageUrl(path: string | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = API_URL.replace('/api', '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function mapApiProduct(p: any): Product {
  const category = p.categories?.[0]?.name?.toLowerCase() || 'rings';
  const metal = (p.material || 'gold').toLowerCase().replace(/\s+/g, '-');

  const images: string[] = [];
  if (p.images && p.images.length > 0) {
    images.push(...p.images.map((img: any) => resolveImageUrl(img.image_path)).filter(Boolean));
  }
  if (images.length === 0 && p.image_path) {
    images.push(resolveImageUrl(p.image_path));
  }
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800');
  }

  return {
    id: String(p.id),
    name: p.name || '',
    nameAr: p.name || '',
    description: p.description || '',
    descriptionAr: p.description || '',
    price: p.price || 0,
    originalPrice: p.price ? Math.round(p.price * 1.2) : undefined,
    images,
    category,
    metal,
    color: p.color || undefined,
    stone: 'none',
    weight: p.weight || 0,
    isNew: p.is_new !== undefined ? p.is_new : true,
    isBestSeller: p.is_bestseller || false,
    isFeatured: p.is_featured || false,
    sizes: ['6', '7', '8'],
    inStock: p.stock_quantity > 0,
    rating: 5.0,
    reviews: 0,
  };
}

export const categoryIconMap: Record<string, string> = {
  rings: '💍',
  necklaces: '📿',
  bracelets: '⌚',
  earrings: '✨',
};

export const categoryNameArMap: Record<string, string> = {
  rings: 'خواتم',
  necklaces: 'قلادات',
  bracelets: 'أساور',
  earrings: 'أقراط',
};

export interface ApiCategory {
  id: number;
  name: string;
  parent_id: number | null;
}

export function mapApiCategory(cat: ApiCategory) {
  const slug = cat.name.toLowerCase();
  return {
    id: slug,
    name: cat.name,
    nameAr: categoryNameArMap[slug] || cat.name,
    icon: categoryIconMap[slug] || '💎',
  };
}
