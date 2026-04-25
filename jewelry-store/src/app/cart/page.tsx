'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Toast from '@/components/Toast';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CartPage() {
  const { lang, t } = useLanguage();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [toast, setToast] = useState({ isVisible: false, message: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return; // user not logged in, keep empty cart for now
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/cart/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Map backend cart items to component state
          const items = data.items.map((item: any) => ({
            id: item.id,
            productId: String(item.product.id),
            productData: item.product,
            quantity: item.quantity,
            size: undefined, // Backend schema doesn't have size/engraving directly in cart item yet
            engraving: '',
            giftWrap: false
          }));
          setCartItems(items);
        }
      } catch (e) {
        console.error("Error fetching cart", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getItemTotal = (item: any) => {
    const basePrice = item.productData ? item.productData.price : 0;
    let total = basePrice * item.quantity;
    if (item.engraving) total += 150;
    if (item.giftWrap) total += 50;
    return total;
  };

  const subtotal = cartItems.reduce((sum, item) =>
    sum + getItemTotal(item), 0
  );

  const discount = appliedCoupon === 'WELCOME10' ? subtotal * 0.1 : 0;
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal - discount + shipping;

  const updateQuantity = async (item: any, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(item);
      return;
    }

    // Update locally first for fast UI
    setCartItems(items =>
      items.map(i =>
        i.id === item.id ? { ...i, quantity: newQuantity } : i
      )
    );

    // Attempt remote update or ignore if not supported by simple add/remove scheme
  };

  const removeItem = async (item: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Backend supports DELETE /api/cart/items/{product_id}
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/cart/items/${item.productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {
        console.error(e);
      }
    }
    setCartItems(items => items.filter(i => i.id !== item.id));
    setToast({ isVisible: true, message: t('cart.removed') });
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setAppliedCoupon('WELCOME10');
      setToast({ isVisible: true, message: t('cart.couponApplied') });
    } else {
      setToast({ isVisible: true, message: t('cart.invalidCoupon') });
    }
    setCouponCode('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center" dir={lang === 'en' ? 'ltr' : 'rtl'}>
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('cart.empty')}</h1>
          <p className="text-gray-600 mb-6">{t('cart.emptySub')}</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a962] text-white rounded-lg hover:bg-[#b8944f] transition-colors"
          >
            {t('cart.shopNow')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8" dir={lang === 'en' ? 'ltr' : 'rtl'}>{t('cart.title')}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4" dir="rtl">
            {cartItems.map((item) => {
              const product = item.productData;
              if (!product) return null;

              return (
                <div key={item.id} className="bg-white rounded-lg p-4 lg:p-6">
                  <div className="flex gap-4">
                    <Link href={`/product/${product.id}`} className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                      <Image
                        src={product.images && product.images.length > 0 ? product.images[0].image_path : 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'}
                        alt={product.nameAr || product.name || ''}
                        fill
                        className="object-cover rounded-lg"
                        sizes="128px"
                      />
                    </Link>

                    <div className="flex-1 text-right">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-[#c9a962] transition-colors">
                          {product.nameAr || product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {product.material === 'gold' ? 'ذهب' : product.material === 'silver' ? 'فضة' : product.material === 'platinum' ? 'بلاتين' : (product.material || '')}
                      </p>

                      {item.size && (
                        <p className="text-sm text-gray-500">المقاس: {item.size}</p>
                      )}
                      {item.engraving && (
                        <p className="text-sm text-gray-500">النقش: "{item.engraving}"</p>
                      )}
                      {item.giftWrap && (
                        <p className="text-sm text-gray-500">تغليف هدية</p>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center hover:border-[#c9a962] transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center hover:border-[#c9a962] transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => removeItem(item)}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            {t('cart.removeItem')}
                          </button>
                          <span className="font-bold text-[#c9a962]">
                            {formatPrice(getItemTotal(item))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div dir={lang === 'en' ? 'ltr' : 'rtl'}>
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">{t('cart.orderSummary')}</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('cart.subtotal')}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('cart.shipping')}</span>
                  <span>{shipping === 0 ? t('cart.free') : formatPrice(shipping)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>{t('cart.total')}</span>
                  <span className="text-[#c9a962]">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">{t('cart.discountCode')}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={t('cart.enterCode')}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t('cart.apply')}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-green-600 text-sm mt-2">✓ كوبون WELCOME10 مطبق</p>
                )}
              </div>

              <Link
                href="/checkout"
                className="block w-full mt-6 py-3 bg-[#c9a962] text-white text-center rounded-lg font-medium hover:bg-[#b8944f] transition-colors"
              >
                {t('cart.checkout')}
              </Link>

              <Link
                href="/shop"
                className="block w-full mt-3 py-3 border border-gray-200 text-center rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {t('cart.continueShopping')}
              </Link>

              <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>{t('cart.securePayment')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{t('cart.returns30')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
