'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface PaymentMethodData {
  id: number;
  method_name: string;
  qr_code_image: string | null;
  is_active: boolean;
  notes: string | null;
}

export default function CheckoutPage() {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [subtotal, setSubtotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'سوريا',
    paymentMethod: 'cod',
  });

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }
      try {
        const [cartRes, pmRes] = await Promise.all([
          fetch(`${API_URL}/cart/`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/products/payment-methods/`),
        ]);
        if (cartRes.ok) {
          const data = await cartRes.json();
          let sum = 0;
          data.items.forEach((item: any) => sum += (item.product.price * item.quantity));
          setSubtotal(sum);
        }
        if (pmRes.ok) {
          const methods = await pmRes.json();
          setPaymentMethods(methods);
        }
      } catch (e) { }
    };
    init();
  }, [router]);

  const uploadReceipt = async (): Promise<string | null> => {
    if (!receiptFile) return null;
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', receiptFile);
    try {
      const res = await fetch(`${API_URL}/admin/upload-receipt`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        return data.receipt_path;
      }
    } catch (e) { }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      try {
        const token = localStorage.getItem('token');
        const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`;

        // Map payment method to ID
        let paymentMethodId: number | null = null;
        if (formData.paymentMethod === 'cod') {
          const codMethod = paymentMethods.find(m => m.method_name.toLowerCase().includes('cash'));
          paymentMethodId = codMethod?.id || 4;
        } else if (formData.paymentMethod === 'shamcash') {
          const shamMethod = paymentMethods.find(m => m.method_name.toLowerCase().includes('sham') || m.method_name.toLowerCase().includes('transfer') || m.method_name.toLowerCase().includes('bank'));
          paymentMethodId = shamMethod?.id || 2;
        }

        // Upload receipt if shamcash
        let transferReceipt: string | null = null;
        if (formData.paymentMethod === 'shamcash' && receiptFile) {
          transferReceipt = await uploadReceipt();
        }

        const payload = {
          payment_method_id: paymentMethodId,
          shipping_address: fullAddress,
          transfer_receipt: transferReceipt,
        };

        const res = await fetch(`${API_URL}/orders/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert(t('checkout.orderSuccess') || 'تم الطلب بنجاح!');
          router.push('/shop');
        } else {
          alert(t('checkout.orderError') || 'حدث خطأ');
        }
      } catch (e) {
        alert(t('checkout.orderError') || 'حدث خطأ');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setReceiptPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(null);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  };

  const shamCashMethod = paymentMethods.find(m => m.method_name.toLowerCase().includes('sham') || m.method_name.toLowerCase().includes('transfer') || m.method_name.toLowerCase().includes('bank'));
  const shamCashQR = shamCashMethod?.qr_code_image;

  return (
    <div className="min-h-screen bg-[#faf9f7]" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8 text-right">{t('checkout.title')}</h1>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[t('checkout.shippingInfo'), t('checkout.payment'), t('checkout.confirm')].map((label, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step > index + 1 ? 'bg-[#c9a962] text-white' : step === index + 1 ? 'bg-[#c9a962] text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > index + 1 ? '✓' : index + 1}
              </div>
              <span className={`mr-2 text-sm ${step >= index + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
              {index < 2 && <div className="w-8 h-0.5 mx-4 bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold">{t('checkout.shippingInfo')}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('checkout.firstName')}</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('checkout.lastName')}</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('checkout.email')}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('checkout.phone')}</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('checkout.address')}</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('checkout.city')}</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('checkout.state')}</label>
                    <select name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]">
                      <option value="">{t('checkout.chooseState')}</option>
                      <option value="hama">حماة</option>
                      <option value="damascus">دمشق</option>
                      <option value="aleppo">حلب</option>
                      <option value="homs">حمص</option>
                      <option value="latakia">اللاذقية</option>
                      <option value="tartus">طرطوس</option>
                      <option value="idlib">إدلب</option>
                      <option value="deir">دير الزور</option>
                      <option value="raqqa">الرقة</option>
                      <option value="hasaka">الحسكة</option>
                      <option value="daraa">درعا</option>
                      <option value="suwayda">السويداء</option>
                      <option value="quneitra">القنيطرة</option>
                      <option value="rif">ريف دمشق</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('checkout.zip')}</label>
                    <input type="text" name="zip" value={formData.zip} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]" dir="ltr" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold">{t('checkout.paymentMethod')}</h2>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-[#c9a962] bg-[#c9a962]/5' : 'border-gray-200 hover:border-[#c9a962]'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="w-4 h-4 text-[#c9a962] focus:ring-[#c9a962]" />
                      <span className="font-medium">💵 الدفع عند الاستلام</span>
                    </div>
                    <span className="text-xs text-gray-400">Cash on Delivery</span>
                  </label>

                  {/* ShamCash */}
                  <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === 'shamcash' ? 'border-[#c9a962] bg-[#c9a962]/5' : 'border-gray-200 hover:border-[#c9a962]'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="paymentMethod" value="shamcash" checked={formData.paymentMethod === 'shamcash'} onChange={handleChange} className="w-4 h-4 text-[#c9a962] focus:ring-[#c9a962]" />
                      <span className="font-medium">📱 شام كاش</span>
                    </div>
                    <span className="text-xs text-gray-400">ShamCash</span>
                  </label>
                </div>

                {/* ShamCash QR Code */}
                {formData.paymentMethod === 'shamcash' && (
                  <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-base font-semibold mb-3 text-center">📍 امسح QR Code للدفع عبر شام كاش</h3>
                    
                    {shamCashQR ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative w-56 h-56 bg-white rounded-xl shadow-md p-3">
                          <img
                            src={shamCashQR.startsWith('http') ? shamCashQR : `${API_URL.replace('/api', '')}${shamCashQR}`}
                            alt="ShamCash QR Code"
                            width={200}
                            height={200}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-sm text-gray-500 text-center">امسح الكود من تطبيق شام كاش وحوّل المبلغ المطلوب</p>
                        <div className="bg-[#c9a962] text-white px-6 py-2 rounded-lg font-bold text-lg">
                          المبلغ: {formatPrice(subtotal + (subtotal > 1000 || subtotal === 0 ? 0 : 50))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-yellow-700 text-sm">⚠️ لم يتم رفع QR Code بعد. يرجى التواصل مع الإدارة.</p>
                      </div>
                    )}

                    {/* Receipt Upload */}
                    <div className="mt-6 border-t pt-5">
                      <h4 className="font-medium mb-3 text-center">📤 ارفع وصل الحوالة بعد التحويل</h4>
                      <p className="text-xs text-gray-400 mb-3 text-center">صورة (JPG/PNG) أو PDF — الحد الأقصى 5MB</p>
                      
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#c9a962] transition-colors"
                      >
                        {receiptPreview ? (
                          <div className="flex flex-col items-center gap-2">
                            <img src={receiptPreview} alt="Receipt preview" className="max-w-48 max-h-48 rounded-lg object-contain" />
                            <p className="text-sm text-green-600">✅ تم اختيار الوصل</p>
                            <p className="text-xs text-gray-400">{receiptFile?.name}</p>
                          </div>
                        ) : receiptFile ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-red-50 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-sm text-green-600">✅ {receiptFile.name}</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-400">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">اضغط لرفع صورة أو PDF</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {receiptFile && (
                        <button
                          type="button"
                          onClick={() => { setReceiptFile(null); setReceiptPreview(null); }}
                          className="mt-2 text-sm text-red-500 hover:text-red-700 mx-auto block"
                        >
                          🗑️ إزالة الوصل
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="bg-white rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold">{t('checkout.confirmOrder')}</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-[#faf9f7] rounded-lg">
                    <h3 className="font-medium mb-2">{t('checkout.shippingAddress')}</h3>
                    <p className="text-sm text-gray-600">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.zip}<br />
                      {formData.country}
                    </p>
                  </div>
                  <div className="p-4 bg-[#faf9f7] rounded-lg">
                    <h3 className="font-medium mb-2">طريقة الدفع</h3>
                    <p className="text-sm text-gray-600">
                      {formData.paymentMethod === 'cod' ? '💵 الدفع عند الاستلام' : '📱 شام كاش'}
                    </p>
                    {receiptFile && formData.paymentMethod === 'shamcash' && (
                      <p className="text-xs text-green-600 mt-1">✅ تم رفع وصل الحوالة</p>
                    )}
                  </div>
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" required className="mt-1 w-4 h-4 text-[#c9a962] rounded focus:ring-[#c9a962]" />
                  <span className="text-sm text-gray-600">
                    أوافق على <Link href="/terms" className="text-[#c9a962] hover:underline">الشروط والأحكام</Link> و <Link href="/privacy" className="text-[#c9a962] hover:underline">سياسة الخصوصية</Link>
                  </span>
                </label>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="flex-1 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  {t('checkout.previous')}
                </button>
              )}
              <button type="submit" disabled={isProcessing} className="flex-1 py-3 bg-[#c9a962] text-white rounded-lg font-medium hover:bg-[#b8944f] transition-colors disabled:opacity-50">
                {isProcessing ? '⏳ جاري المعالجة...' : (step === 3 ? '✅ تأكيد الطلب' : 'التالي ←')}
              </button>
            </div>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">{t('checkout.orderSummary')}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('checkout.subtotal')}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('checkout.shipping')}</span>
                  <span className="text-green-600">{subtotal > 1000 || subtotal === 0 ? t('cart.free') : formatPrice(50)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>{t('checkout.total')}</span>
                  <span className="text-[#c9a962]">{formatPrice(subtotal + (subtotal > 1000 || subtotal === 0 ? 0 : 50))}</span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm">دفع آمن ومشفر</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
