'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API_URL, resolveImageUrl } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { lang } = useLanguage();
  const t = (ar: string, en: string) => lang === 'en' ? en : ar;

  // ── المفضلة: قراءة من localStorage ──
  const [isFavorite, setIsFavorite] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = localStorage.getItem('favorites');
      if (!saved) return false;
      return JSON.parse(saved).includes(String(product.id));
    } catch { return false; }
  });

  const toggleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = localStorage.getItem('favorites');
      let favs: string[] = saved ? JSON.parse(saved) : [];
      const pid = String(product.id);
      if (favs.includes(pid)) {
        favs = favs.filter(id => id !== pid);
        setIsFavorite(false);
      } else {
        favs.push(pid);
        setIsFavorite(true);
      }
      localStorage.setItem('favorites', JSON.stringify(favs));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, [product.id]);

  // ── السلة: إضافة سريعة ──
  const handleQuickAdd = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      const res = await fetch(`${API_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: parseInt(String(product.id)), quantity: 1 }),
      });
      if (res.ok) {
        const cart = localStorage.getItem('cart');
        const items = cart ? JSON.parse(cart) : [];
        const existing = items.find((i: any) => String(i.product_id) === String(product.id));
        if (existing) { existing.quantity += 1; } else { items.push({ product_id: parseInt(String(product.id)), quantity: 1 }); }
        localStorage.setItem('cart', JSON.stringify(items));
        window.dispatchEvent(new CustomEvent('cart-updated'));
        window.dispatchEvent(new Event('storage'));
        
        const btn = e.currentTarget as HTMLButtonElement;
        const originalText = btn.innerText;
        btn.innerText = lang === 'en' ? '✓ Added' : '✓ تمت الإضافة';
        btn.style.background = '#16a34a';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#16a34a';
        
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.background = isHovered ? '#c9a962' : 'transparent';
          btn.style.color = isHovered ? '#0d0a0e' : '#c9a962';
          btn.style.borderColor = 'rgba(201,169,98,0.4)';
        }, 2000);
      }
    } catch {}
  }, [product.id, isHovered, lang]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'ar-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // حل الصور: تأكد من تمريرها عبر resolveImageUrl
  const productImage = resolveImageUrl(product.images[0] || '');
  const productImageHover = product.images.length > 1 ? resolveImageUrl(product.images[1]) : productImage;

  return (
    <div
      className="group relative rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: 'linear-gradient(145deg, #16111e, #1c1526)',
        border: '1px solid rgba(201,169,98,0.12)',
        boxShadow: isHovered
          ? '0 8px 32px rgba(201,169,98,0.15), 0 2px 8px rgba(0,0,0,0.4)'
          : '0 2px 12px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* صورة المنتج */}
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-[#0d0a0e]">
          <Image
            src={isHovered ? productImageHover : productImage}
            alt={product.nameAr}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-108"
            style={{ transform: isHovered ? 'scale(1.07)' : 'scale(1)' }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* overlay ذهبي خفيف عند hover */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to top, rgba(201,169,98,0.12) 0%, transparent 60%)',
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* badges */}
          {product.isNew && (
            <span className="absolute top-3 right-3 bg-[#c9a962] text-[#0d0a0e] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
              {t('جديد', 'NEW')}
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="absolute top-3 right-3 text-white text-[10px] font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
              {t('الأكثر مبيعاً', 'Best Seller')}
            </span>
          )}
          {product.originalPrice && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              {t('خصم', 'SALE')}
            </span>
          )}
        </div>
      </Link>

      {/* زر المفضلة */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        style={{
          background: 'rgba(13,10,14,0.7)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(201,169,98,0.2)',
        }}
      >
        <svg
          className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-[#c9a962] text-[#c9a962]' : 'text-white/70'}`}
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* معلومات المنتج */}
      <div className={`p-4 ${lang === 'en' ? 'text-left' : 'text-right'}`} dir={lang === 'en' ? 'ltr' : 'rtl'}>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-white hover:text-[#c9a962] transition-colors mb-1 text-sm leading-snug">
            {lang === 'en' ? product.name : product.nameAr}
          </h3>
        </Link>

        <p className="text-[11px] text-white/35 mb-3">
          {lang === 'en'
            ? `${product.metal === 'gold' ? 'Gold' : product.metal === 'silver' ? 'Silver' : product.metal === 'platinum' ? 'Platinum' : 'Rose Gold'}${product.stone && product.stone !== 'none' ? ` • ${product.stone === 'diamond' ? 'Diamond' : product.stone === 'ruby' ? 'Ruby' : product.stone === 'emerald' ? 'Emerald' : 'Pearl'}` : ''}`
            : `${product.metal === 'gold' ? 'ذهب' : product.metal === 'silver' ? 'فضة' : product.metal === 'platinum' ? 'بلاتين' : 'ذهب وردي'}${product.stone && product.stone !== 'none' ? ` • ${product.stone === 'diamond' ? 'ماس' : product.stone === 'ruby' ? 'ياقوت' : product.stone === 'emerald' ? 'زمرد' : 'لؤلؤ'}` : ''}`
          }
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            {product.originalPrice && (
              <span className="text-xs text-white/30 line-through">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="font-bold text-[#c9a962] text-base">{formatPrice(product.price)}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-white/40">
            <svg className="w-3.5 h-3.5 text-[#c9a962] fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{product.rating}</span>
          </div>
        </div>

        {/* زر إضافة للسلة */}
        <button
          onClick={handleQuickAdd}
          className="w-full py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: isHovered ? '#c9a962' : 'transparent',
            border: '1px solid rgba(201,169,98,0.4)',
            color: isHovered ? '#0d0a0e' : '#c9a962',
          }}
        >
          {t('أضف للسلة', 'Add to Cart')}
        </button>
      </div>
    </div>
  );
}