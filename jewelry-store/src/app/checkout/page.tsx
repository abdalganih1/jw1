'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [subtotal, setSubtotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'السعودية',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  });

  useEffect(() => {
    // Basic initialization: get cart total to show
    const fetchCartTotal = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/cart/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          let sum = 0;
          data.items.forEach((item: any) => sum += (item.product.price * item.quantity));
          setSubtotal(sum);
        }
      } catch (e) { }
    };
    fetchCartTotal();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      try {
        const token = localStorage.getItem('token');
        const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`;
        const payload = {
          payment_method_id: formData.paymentMethod === 'card' ? 1 : formData.paymentMethod === 'mada' ? 2 : 3,
          shipping_address: fullAddress,
          transfer_receipt: null
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/orders/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert('تم تأكيد الطلب بنجاح! شكراً لتسوقكم معنا.');
          router.push('/shop');
        } else {
          const errData = await res.json();
          alert(`فشل الطلب: ${errData.detail || 'حدث خطأ غير متوقع'}`);
        }
      } catch (e) {
        console.error(e);
        alert('عذراً، لم نتمكن من معالجة الطلب.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8 text-right" dir="rtl">إتمام الشراء</h1>

        <div className="flex items-center justify-center gap-4 mb-8" dir="rtl">
          {['معلومات الشحن', 'الدفع', 'تأكيد الطلب'].map((label, index) => (
            <div key={index} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step > index + 1 ? 'bg-[#c9a962] text-white' : step === index + 1 ? 'bg-[#c9a962] text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                {step > index + 1 ? '✓' : index + 1}
              </div>
              <span className={`mr-2 text-sm ${step >= index + 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                {label}
              </span>
              {index < 2 && <div className="w-8 h-0.5 mx-4 bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2" dir="rtl">
            {step === 1 && (
              <div className="bg-white rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold">معلومات الشحن</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">الاسم الأول</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">الاسم الأخير</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">العنوان</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">المدينة</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">المنطقة</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                    >
                      <option value="">اختر المنطقة</option>
                      <option value="riyadh">الرياض</option>
                      <option value="jeddah">جدة</option>
                      <option value="makkah">مكة</option>
                      <option value="madinah">المدينة</option>
                      <option value="dammam">الدمام</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">الرمز البريدي</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold">طريقة الدفع</h2>

                <div className="space-y-3">
                  {[
                    { id: 'card', label: 'بطاقة ائتمان', icons: ['VISA', 'MasterCard'] },
                    { id: 'mada', label: 'مدى', icons: ['MADA'] },
                    { id: 'apple', label: 'Apple Pay', icons: [] },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === method.id ? 'border-[#c9a962] bg-[#c9a962]/5' : 'border-gray-200 hover:border-[#c9a962]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                          className="w-4 h-4 text-[#c9a962] focus:ring-[#c9a962]"
                        />
                        <span>{method.label}</span>
                      </div>
                      <div className="flex gap-2">
                        {method.icons.map((icon) => (
                          <span key={icon} className="px-2 py-1 bg-gray-100 rounded text-xs">{icon}</span>
                        ))}
                      </div>
                    </label>
                  ))}
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium mb-1">رقم البطاقة</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                        dir="ltr"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">تاريخ الانتهاء</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CVC</label>
                        <input
                          type="text"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">اسم حامل البطاقة</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                        dir="ltr"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold">تأكيد الطلب</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-[#faf9f7] rounded-lg">
                    <h3 className="font-medium mb-2">عنوان الشحن</h3>
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
                      {formData.paymentMethod === 'card' ? 'بطاقة ائتمان' : formData.paymentMethod === 'mada' ? 'مدى' : 'Apple Pay'}
                      {formData.cardNumber && ` •••• ${formData.cardNumber.slice(-4)}`}
                    </p>
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
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  السابق
                </button>
              )}
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-3 bg-[#c9a962] text-white rounded-lg font-medium hover:bg-[#b8944f] transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'جاري المعالجة...' : (step === 3 ? 'تأكيد الطلب' : 'التالي')}
              </button>
            </div>
          </form>

          <div className="lg:col-span-1" dir="rtl">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">ملخص الطلب</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">المجموع الفرعي</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الشحن</span>
                  <span className="text-green-600">{subtotal > 1000 || subtotal === 0 ? 'مجاني' : formatPrice(50)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span className="text-[#c9a962]">
                    {formatPrice(subtotal + (subtotal > 1000 || subtotal === 0 ? 0 : 50))}
                  </span>
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
