import { Product } from '@/types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export function resolveImageUrl(path: string | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = API_URL.replace('/api', '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function mapApiProduct(p: any): Product {
  try {
    if (!p) throw new Error("Null product");

    // Get all category slugs
    const categories = Array.isArray(p.categories) 
      ? p.categories.map((c: any) => c?.name?.toLowerCase()).filter(Boolean)
      : [];
    const primaryCategory = categories[0] || 'rings';
    
    const metal = (p.material || 'gold').toLowerCase().replace(/\s+/g, '-');

    const images: string[] = [];
    if (Array.isArray(p.images) && p.images.length > 0) {
      images.push(...p.images.map((img: any) => resolveImageUrl(img?.image_path)).filter(Boolean));
    }
    if (images.length === 0 && p.image_path) {
      images.push(resolveImageUrl(p.image_path));
    }
    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800');
    }

    return {
      id: String(p.id || Math.random()),
      name: p.name_en || p.name || '',
      nameAr: p.name || '',
      description: p.description_en || p.description || '',
      descriptionAr: p.description || '',
      price: Number(p.price) || 0,
      originalPrice: p.price ? Math.round(Number(p.price) * 1.2) : undefined,
      images,
      category: primaryCategory,
      categories: categories,
      metal,
      metalAr: p.material || '',
      color: p.color_en || p.color || undefined,
      colorAr: p.color || undefined,
      stone: 'none',
      weight: Number(p.weight) || 0,
      isNew: p.is_new !== undefined ? Boolean(p.is_new) : true,
      isBestSeller: Boolean(p.is_bestseller),
      isFeatured: Boolean(p.is_featured),
      sizes: ['6', '7', '8'],
      inStock: (Number(p.stock_quantity) || 0) > 0,
      rating: 5.0,
      reviews: 0,
      karat: p.karat || ''
    };
  } catch (err) {
    console.error("Error mapping product:", err, p);
    // Return a minimal valid product instead of failing
    return {
      id: String(p?.id || 'error'),
      name: p?.name_en || p?.name || 'Error loading product',
      nameAr: p?.name || 'خطأ في تحميل المنتج',
      description: '', descriptionAr: '',
      price: 0, images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
      category: 'rings', metal: 'gold', weight: 0, inStock: false, rating: 0, reviews: 0
    };
  }
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
