'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

// ── مكوّن FAQ ─────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        background: open ? 'linear-gradient(135deg, rgba(201,169,98,0.08), rgba(201,169,98,0.03))' : 'linear-gradient(145deg, #16111e, #1a1428)',
        border: `1px solid ${open ? 'rgba(201,169,98,0.35)' : 'rgba(201,169,98,0.1)'}`,
      }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-white text-sm font-medium">{q}</span>
        <span
          className="text-[#c9a962] transition-transform duration-300 flex-shrink-0 mr-3"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-white/55 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ── مكوّن الصفحة الداخلي ─────────────────────────────────────────────
function ContactContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const { lang } = useLanguage();
  const t = (ar: string, en: string) => lang === 'en' ? en : ar;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: typeParam === 'consultation' ? t('استشارة', 'Consultation') : '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,169,98,0.15)',
    color: '#e8e0d0',
    borderRadius: '10px',
    padding: '10px 14px',
    width: '100%',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: t('الهاتف', 'Phone'),
      line1: '+966 11 123 4567',
      line2: '+966 50 123 4567',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: t('البريد الإلكتروني', 'Email'),
      line1: 'info@viveltgold.sa',
      line2: 'support@viveltgold.sa',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t('العنوان', 'Address'),
      line1: t('الرياض، المملكة العربية السعودية', 'Riyadh, Saudi Arabia'),
      line2: t('طريق الملك فهد، برج المملكة', 'King Fahd Road, Kingdom Tower'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('ساعات العمل', 'Working Hours'),
      line1: t('الأحد - الخميس: 9ص - 6م', 'Sun - Thu: 9AM - 6PM'),
      line2: t('الجمعة - السبت: 10ص - 4م', 'Fri - Sat: 10AM - 4PM'),
    },
  ];

  const faqs = [
    { q: t('كيف يعمل تصميم المجوهرات بالذكاء الاصطناعي؟', 'How does AI jewelry design work?'), a: t('نستخدم خوارزميات متقدمة تحلل تفضيلاتك وأسلوبك لاقتراح تصاميم مجوهرات فريدة تعكس شخصيتك.', 'We use advanced algorithms that analyze your preferences and style to suggest unique jewelry designs that reflect your personality.') },
    { q: t('ما هي فترة الضمان؟', 'What is the warranty period?'), a: t('جميع مجوهراتنا مضمونة لمدة سنة كاملة من تاريخ الشراء.', 'All our jewelry is warranted for a full year from the date of purchase.') },
    { q: t('هل يمكنني إرجاع أو استبدال المنتج؟', 'Can I return or exchange a product?'), a: t('نعم، نقبل الإرجاع خلال 30 يوماً من الاستلام.', 'Yes, we accept returns within 30 days of receipt, provided the item is in its original condition.') },
    { q: t('هل المجوهرات مضمونة الجودة؟', 'Is the jewelry quality guaranteed?'), a: t('بالتأكيد، كل قطعة تأتي مع شهادة مصادقة من جهات معتمدة.', 'Absolutely, every piece comes with an authentication certificate from accredited bodies.') },
    { q: t('هل يمكنني تخصيص تصميم مجوهرات؟', 'Can I customize jewelry designs?'), a: t('نعم! خدمة التصميم الشخصي متاحة لجميع عملائنا.', 'Yes! Custom design services are available for all our customers.') },
    { q: t('ما هي طرق الدفع المتاحة؟', 'What payment methods are available?'), a: t('نقبل بطاقات الائتمان والخصم المباشر، مدى، Apple Pay، وتحويل بنكي.', 'We accept credit/debit cards, Mada, Apple Pay, and bank transfers.') },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0d0a0e 0%, #110d15 50%, #0a0810 100%)' }}
      dir={lang === 'en' ? 'ltr' : 'rtl'}
    >
      {/* ━━━━━━━━━━━━━━━━━━ Hero ━━━━━━━━━━━━━━━━━━ */}
      <div className="text-center py-16 px-6">
        <p className="text-[#c9a962] text-xs uppercase tracking-[0.3em] mb-3 font-semibold">
          {t('نحن هنا لك', 'We Are Here For You')}
        </p>
        <h1 className="text-4xl lg:text-5xl font-display font-light text-white mb-4">
          {t('تواصل ', 'Contact ')}<span style={{ color: '#c9a962' }}>{t('معنا', 'Us')}</span>
        </h1>
        <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
          {t(
            'فريقنا جاهز للرد على استفساراتك ومساعدتك في اختيار المجوهرات المثالية',
            'Our team is ready to answer your inquiries and help you choose the perfect jewelry.'
          )}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">

        {/* ━━━━━━━━━━━━━━━━━━ بطاقات المعلومات ━━━━━━━━━━━━━━━━━━ */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {contactInfo.map((info, i) => (
            <div
              key={i}
              className="p-5 rounded-xl text-center transition-all duration-300"
              style={{
                background: 'linear-gradient(145deg, #16111e, #1a1428)',
                border: '1px solid rgba(201,169,98,0.12)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,169,98,0.35)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,169,98,0.12)')}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(201,169,98,0.1)', color: '#c9a962' }}
              >
                {info.icon}
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm">{info.title}</h3>
              <p className="text-white/50 text-xs leading-relaxed">{info.line1}</p>
              <p className="text-white/50 text-xs leading-relaxed">{info.line2}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8">

          {/* ━━━━━━━━━━━━━━━━━━ الفورم ━━━━━━━━━━━━━━━━━━ */}
          <div
            className="rounded-2xl p-7"
            style={{
              background: 'linear-gradient(145deg, #16111e, #1a1428)',
              border: '1px solid rgba(201,169,98,0.12)',
            }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              {t('أرسل رسالتك', 'Send Your Message')}
            </h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(201,169,98,0.15)' }}>
                  <svg className="w-8 h-8 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{t('تم الإرسال!', 'Sent!')}</h3>
                <p className="text-white/50 text-sm">{t('سنتواصل معك قريباً.', 'We will be in touch soon.')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" dir={lang === 'en' ? 'ltr' : 'rtl'}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs mb-1.5">{t('الاسم الكامل', 'Full Name')}</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('اسمك الكريم', 'Your name')}
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs mb-1.5">{t('رقم الهاتف', 'Phone Number')}</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+966 5X XXX XXXX"
                      style={inputStyle}
                      dir="ltr"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">{t('البريد الإلكتروني', 'Email Address')}</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    style={inputStyle}
                    dir="ltr"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">{t('الموضوع', 'Subject')}</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">{t('اختر الموضوع', 'Select subject')}</option>
                    <option value={t('استفسار عام', 'General Inquiry')}>{t('استفسار عام', 'General Inquiry')}</option>
                    <option value={t('استشارة', 'Consultation')}>{t('استشارة', 'Consultation')}</option>
                    <option value={t('شكوى', 'Complaint')}>{t('شكوى', 'Complaint')}</option>
                    <option value={t('تصميم مخصص', 'Custom Design')}>{t('تصميم مخصص', 'Custom Design')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">{t('رسالتك', 'Your Message')}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder={t('اكتب رسالتك هنا...', 'Write your message here...')}
                    style={{ ...inputStyle, resize: 'none' }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #c9a962, #b8944f)', color: '#0d0a0e' }}
                >
                  {t('إرسال الرسالة', 'Send Message')}
                </button>
              </form>
            )}
          </div>

          {/* ━━━━━━━━━━━━━━━━━━ FAQ ━━━━━━━━━━━━━━━━━━ */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">
              {t('الأسئلة الشائعة', 'Frequently Asked Questions')}
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── الصفحة الرئيسية ───────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0a0e' }}>
        <div className="w-8 h-8 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ContactContent />
    </Suspense>
  );
}
