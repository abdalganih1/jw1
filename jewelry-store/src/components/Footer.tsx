'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { lang } = useLanguage();
  const t = (ar: string, en: string) => lang === 'en' ? en : ar;
  const dir = lang === 'en' ? 'ltr' : 'rtl';

  return (
    <footer className="bg-[#1a1a1a] text-white" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

            {/* العلامة التجارية */}
            <div className="space-y-6">
              <Link href="/" className="inline-block">
                <span className="text-3xl font-display font-bold text-gradient-gold">Vivelt Gold</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t(
                  'نقدم لكم أرقى المجوهرات الفاخرة بتصاميم عصرية راقية. كل قطعة تروي قصة من الجمال والإبداع.',
                  'We offer the finest luxury jewelry with refined modern designs. Every piece tells a story of beauty and creativity.'
                )}
              </p>
              <div className="flex gap-4">
                {/* Facebook */}
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c9a962] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c9a962] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                {/* X */}
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c9a962] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* الأقسام */}
            <div>
              <h3 className="text-lg font-semibold mb-6">{t('الأقسام', 'Collections')}</h3>
              <ul className="space-y-3">
                <li><Link href="/shop?category=rings" className="text-gray-400 hover:text-[#c9a962] transition-colors text-sm">{t('خواتم', 'Rings')}</Link></li>
                <li><Link href="/shop?category=necklaces" className="text-gray-400 hover:text-[#c9a962] transition-colors text-sm">{t('قلادات', 'Necklaces')}</Link></li>
                <li><Link href="/shop?category=bracelets" className="text-gray-400 hover:text-[#c9a962] transition-colors text-sm">{t('أساور', 'Bracelets')}</Link></li>
                <li><Link href="/shop?category=earrings" className="text-gray-400 hover:text-[#c9a962] transition-colors text-sm">{t('أقراط', 'Earrings')}</Link></li>
                <li><Link href="/builder" className="text-gray-400 hover:text-[#c9a962] transition-colors text-sm">{t('صمّم قطعتك', 'Design Yours')}</Link></li>
              </ul>
            </div>

            {/* المساعدة */}
            <div>
              <h3 className="text-lg font-semibold mb-6">{t('المساعدة', 'Help')}</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-[#c9a962] transition-colors text-sm">{t('من نحن', 'About Us')}</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-[#c9a962] transition-colors text-sm">{t('تواصل معنا', 'Contact Us')}</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-[#c9a962] transition-colors text-sm">{t('الأسئلة الشائعة', 'FAQ')}</Link></li>
                <li><Link href="/returns" className="text-gray-400 hover:text-[#c9a962] transition-colors text-sm">{t('سياسة الإرجاع', 'Return Policy')}</Link></li>
                <li><Link href="/contact?type=consultation" className="text-gray-400 hover:text-[#c9a962] transition-colors text-sm">{t('حجز استشارة', 'Book Consultation')}</Link></li>
              </ul>
            </div>

            {/* تواصل معنا */}
            <div>
              <h3 className="text-lg font-semibold mb-6">{t('تواصل معنا', 'Contact Us')}</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <svg className="w-5 h-5 text-[#c9a962] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{t('الرياض، المملكة العربية السعودية', 'Riyadh, Saudi Arabia')}</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <svg className="w-5 h-5 text-[#c9a962] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span dir="ltr">+966 11 234 5678</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <svg className="w-5 h-5 text-[#c9a962] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>info@viveltgold.sa</span>
                </li>
              </ul>
            </div>
          </div>

          {/* الشريط السفلي */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                {t('© 2024 Vivelt Gold. جميع الحقوق محفوظة.', '© 2024 Vivelt Gold. All rights reserved.')}
              </p>
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <span>{t('نقبل الدفع بـ:', 'We accept:')}</span>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-white/10 rounded text-xs">VISA</span>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs">MADA</span>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs">Apple Pay</span>
                </div>
              </div>
            </div>
          </div>

          {/* مزايا */}
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>{t('ضمان سنة كاملة', '1-Year Warranty')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <span>{t('شحن مجاني فوق $1,000', 'Free Shipping over $1,000')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{t('إرجاع خلال 30 يوم', '30-Day Returns')}</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
