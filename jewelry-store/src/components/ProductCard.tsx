'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div 
      className="group relative bg-white rounded-lg overflow-hidden card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setImageIndex(0);
      }}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.images[isHovered && product.images.length > 1 ? 1 : 0]}
            alt={product.nameAr}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {product.isNew && (
            <span className="absolute top-3 right-3 bg-[#c9a962] text-white text-xs px-3 py-1 rounded-full">
              جديد
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="absolute top-3 right-3 bg-[#2d2d2d] text-white text-xs px-3 py-1 rounded-full">
              الأكثر مبيعاً
            </span>
          )}
          {product.originalPrice && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
              خصم
            </span>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2 justify-center">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${idx === (isHovered && product.images.length > 1 ? 1 : 0) ? 'bg-white' : 'bg-white/50'}`}
                  onMouseEnter={() => setImageIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </Link>

      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-3 left-3 z-10 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <svg 
          className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <div className="p-4 text-right" dir="rtl">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-[#c9a962] transition-colors mb-1">
            {product.nameAr}
          </h3>
        </Link>
        
        <p className="text-xs text-gray-500 mb-2">
          {product.metal === 'gold' ? 'ذهب' : product.metal === 'silver' ? 'فضة' : product.metal === 'platinum' ? 'بلاتين' : 'ذهب وردي'}
          {product.stone && product.stone !== 'none' && ` • ${product.stone === 'diamond' ? 'ماس' : product.stone === 'ruby' ? 'ياقوت' : product.stone === 'emerald' ? 'زمرد' : product.stone === 'sapphire' ? 'ياقوت أزرق' : 'لؤلؤ'}`}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="font-bold text-[#c9a962]">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-4 h-4 text-[#c9a962] fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{product.rating}</span>
          </div>
        </div>

        <button className="w-full mt-3 py-2.5 border border-[#c9a962] text-[#c9a962] rounded-lg text-sm font-medium hover:bg-[#c9a962] hover:text-white transition-colors duration-300">
          أضف للسلة
        </button>
      </div>
    </div>
  );
}
