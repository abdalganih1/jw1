'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CheckoutPage() {
  const { lang, t } = useLanguage();
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
    country: 'سوريا',
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
          payment_method_id: ({ card: 1, mada: 3, apple: 5, cod: 4 } as Record<string,number>)[formData.paymentMethod] || 1,
          shipping_address: fullAddress,
          transfer_receipt: null
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/orders/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert(t('checkout.orderSuccess'));
          router.push('/shop');
        } else {
          const errData = await res.json();
          alert(t('checkout.orderError'));
        }
      } catch (e) {
        console.error(e);
        alert(t('checkout.orderError'));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8 text-right" dir={lang === 'en' ? 'ltr' : 'rtl'}>{t('checkout.title')}</h1>

        <div className="flex items-center justify-center gap-4 mb-8" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          {[t('checkout.shippingInfo'), t('checkout.payment'), t('checkout.confirm')].map((label, index) => (
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
          <form onSubmit={handleSubmit} className="lg:col-span-2" dir={lang === 'en' ? 'ltr' : 'rtl'}>
            {step === 1 && (
              <div className="bg-white rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold">{t('checkout.shippingInfo')}</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('checkout.firstName')}</label>
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
                    <label className="block text-sm font-medium mb-1">{t('checkout.lastName')}</label>
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
                    <label className="block text-sm font-medium mb-1">{t('checkout.email')}</label>
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
                    <label className="block text-sm font-medium mb-1">{t('checkout.phone')}</label>
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
                  <label className="block text-sm font-medium mb-1">{t('checkout.address')}</label>
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
                    <label className="block text-sm font-medium mb-1">{t('checkout.city')}</label>
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
                    <label className="block text-sm font-medium mb-1">{t('checkout.state')}</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                    >
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
                <h2 className="text-lg font-semibold">{t('checkout.paymentMethod')}</h2>

                <div className="space-y-3">
                  {[
                    { id: 'card', label: t('checkout.creditCard'), icons: ['VISA', 'MasterCard'] },
                    { id: 'mada', label: t('checkout.mada'), icons: ['MADA'] },
                    { id: 'apple', label: 'Apple Pay', icons: [''] },
                    { id: 'cod', label: t('checkout.cod'), icons: ['💵'] },
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
                      <label className="block text-sm font-medium mb-1">{t('checkout.cardNumber')}</label>
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
                        <label className="block text-sm font-medium mb-1">{t('checkout.expiry')}</label>
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
                      <label className="block text-sm font-medium mb-1">{t('checkout.cardName')}</label>
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
                    <h3 className="font-medium mb-2">{t('checkout.paymentMethod')}</h3>
                    <p className="text-sm text-gray-600">
                      {formData.paymentMethod === 'card' ? t('checkout.creditCard') : formData.paymentMethod === 'mada' ? t('checkout.mada') : formData.paymentMethod === 'apple' ? 'Apple Pay' : t('checkout.cod')}
                      {formData.cardNumber && ` •••• ${formData.cardNumber.slice(-4)}`}
                    </p>
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" required className="mt-1 w-4 h-4 text-[#c9a962] rounded focus:ring-[#c9a962]" />
                  <span className="text-sm text-gray-600">
                    {t('checkout.agree')} <Link href="/terms" className="text-[#c9a962] hover:underline">{t('checkout.terms')}</Link> {t('checkout.and')} <Link href="/privacy" className="text-[#c9a962] hover:underline">{t('checkout.privacy')}</Link>
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
                  {t('checkout.previous')}
                </button>
              )}
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-3 bg-[#c9a962] text-white rounded-lg font-medium hover:bg-[#b8944f] transition-colors disabled:opacity-50"
              >
                {isProcessing ? t('checkout.processing') : (step === 3 ? t('checkout.confirmOrder') : t('checkout.next'))}
              </button>
            </div>
          </form>

          <div className="lg:col-span-1" dir={lang === 'en' ? 'ltr' : 'rtl'}>
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
                  <span className="text-[#c9a962]">
                    {formatPrice(subtotal + (subtotal > 1000 || subtotal === 0 ? 0 : 50))}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm">{t('checkout.securePayment')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
