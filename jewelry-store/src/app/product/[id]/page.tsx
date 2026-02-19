'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { products, metals, stones } from '@/data/products';
import ImageGallery from '@/components/ImageGallery';
import { EngravingModal } from '@/components/Modal';
import Toast from '@/components/Toast';

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = products.find(p => p.id === productId);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedMetal, setSelectedMetal] = useState(product?.metal || 'gold');
  const [quantity, setQuantity] = useState(1);
  const [engraving, setEngraving] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [isEngravingModalOpen, setIsEngravingModalOpen] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '' });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">المنتج غير موجود</h1>
          <Link href="/shop" className="text-[#c9a962] hover:underline">
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateTotal = () => {
    let total = product.price * quantity;
    if (engraving) total += 150;
    if (giftWrap) total += 50;
    return total;
  };

  const handleAddToCart = () => {
    setToast({ isVisible: true, message: 'تمت الإضافة إلى السلة بنجاح!' });
    setTimeout(() => setToast({ ...toast, isVisible: false }), 3000);
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8" dir="rtl">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-[#c9a962]">الرئيسية</Link></li>
            <li>/</li>
            <li><Link href="/shop" className="hover:text-[#c9a962]">المتجر</Link></li>
            <li>/</li>
            <li><Link href={`/shop?category=${product.category}`} className="hover:text-[#c9a962]">
              {product.category === 'rings' ? 'خواتم' : product.category === 'necklaces' ? 'قلادات' : product.category === 'bracelets' ? 'أساور' : 'أقراط'}
            </Link></li>
            <li>/</li>
            <li className="text-gray-900">{product.nameAr}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <ImageGallery
              images={product.images}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
            />
          </div>

          <div className="text-right" dir="rtl">
            <div className="mb-4">
              {product.isNew && (
                <span className="inline-block bg-[#c9a962] text-white text-xs px-3 py-1 rounded-full mb-2">
                  جديد
                </span>
              )}
              {product.isBestSeller && (
                <span className="inline-block bg-[#2d2d2d] text-white text-xs px-3 py-1 rounded-full mb-2 mr-2">
                  الأكثر مبيعاً
                </span>
              )}
            </div>

            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              {product.nameAr}
            </h1>
            <p className="text-gray-500 text-sm mb-4">{product.name}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-[#c9a962] fill-current' : 'text-gray-300'}`} 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-500 mr-1">({product.reviews} تقييم)</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-3xl font-bold text-[#c9a962]">
                {formatPrice(product.price)}
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              {product.descriptionAr}
            </p>

            <div className="space-y-6 mb-8">
              {product.sizes && (
                <div>
                  <label className="block text-sm font-medium mb-2">المقاس</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          selectedSize === size 
                            ? 'border-[#c9a962] bg-[#c9a962]/10 text-[#c9a962]' 
                            : 'border-gray-200 hover:border-[#c9a962]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">المعدن</label>
                <div className="flex flex-wrap gap-2">
                  {metals.map((metal) => (
                    <button
                      key={metal.id}
                      onClick={() => setSelectedMetal(metal.id)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedMetal === metal.id 
                          ? 'border-[#c9a962] bg-[#c9a962]/10 text-[#c9a962]' 
                          : 'border-gray-200 hover:border-[#c9a962]'
                      }`}
                    >
                      {metal.nameAr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الكمية</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:border-[#c9a962] transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:border-[#c9a962] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsEngravingModalOpen(true)}
                  className="flex items-center gap-2 text-sm text-[#c9a962] hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  {engraving ? `النقش: "${engraving}"` : 'إضافة نقش (+150 ر.س)'}
                </button>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="w-4 h-4 text-[#c9a962] border-gray-300 rounded focus:ring-[#c9a962]"
                  />
                  <span className="text-sm text-gray-600">تغليف هدية (+50 ر.س)</span>
                </label>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#c9a962] text-white rounded-lg font-medium hover:bg-[#b8944f] transition-colors"
              >
                أضف للسلة - {formatPrice(calculateTotal())}
              </button>
              
              <Link
                href="/contact?type=consultation"
                className="w-full py-4 border border-[#c9a962] text-[#c9a962] rounded-lg font-medium hover:bg-[#c9a962]/10 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                احجز استشارة مجانية
              </Link>
            </div>

            <div className="bg-[#faf9f7] rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm text-gray-600">ضمان سنة كاملة</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-600">شحن مجاني للطلبات فوق 1000 ر.س</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm text-gray-600">إرجاع خلال 30 يوم</span>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="font-medium mb-3">تفاصيل المنتج</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">الوزن:</span>
                  <span>{product.weight} غرام</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">المعدن:</span>
                  <span>{metals.find(m => m.id === product.metal)?.nameAr}</span>
                </div>
                {product.stone && product.stone !== 'none' && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">الحجر:</span>
                    <span>{stones.find(s => s.id === product.stone)?.nameAr}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">التوفر:</span>
                  <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                    {product.inStock ? 'متوفر' : 'غير متوفر'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 text-right" dir="rtl">
              منتجات مشابهة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link 
                  key={p.id} 
                  href={`/product/${p.id}`}
                  className="group bg-white rounded-lg overflow-hidden card-hover"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={p.images[0]}
                      alt={p.nameAr}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                  </div>
                  <div className="p-4 text-right">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#c9a962] transition-colors">
                      {p.nameAr}
                    </h3>
                    <p className="text-[#c9a962] font-medium mt-1">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <EngravingModal
        isOpen={isEngravingModalOpen}
        onClose={() => setIsEngravingModalOpen(false)}
        onSave={(text) => setEngraving(text)}
      />

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
