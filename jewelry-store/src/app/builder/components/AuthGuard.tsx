'use client';

import Link from 'next/link';

export default function AuthGuard() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" dir="rtl">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 mx-auto mb-6 bg-[#c9a962]/10 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">
          صمّم مجوهراتك بالذكاء الاصطناعي
        </h2>
        <p className="text-gray-600 mb-8">
          سجّل دخولك للوصول إلى استوديو التصميم وإنشاء تصاميمك الفريدة
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#c9a962] text-white font-medium rounded-lg hover:bg-[#b8944f] transition-colors"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#c9a962] text-[#c9a962] font-medium rounded-lg hover:bg-[#c9a962]/5 transition-colors"
          >
            إنشاء حساب
          </Link>
        </div>
      </div>
    </div>
  );
}
