import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
            سياسة الإرجاع والاستبدال
          </h1>
          <p className="text-gray-600">
            نضمن لك تجربة تسوق مريحة ومطمئنة
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 lg:p-8 space-y-8" dir="rtl">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">شروط الإرجاع</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#c9a962] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>يمكن إرجاع المنتج خلال 30 يوماً من تاريخ الاستلام</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#c9a962] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>يجب أن يكون المنتج بحالته الأصلية وغير مستخدم</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#c9a962] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>يجب إرفاق الفاتورة الأصلية وشهادة الضمان</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#c9a962] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>يجب أن يكون التغليف الأصلي سليماً</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">المنتجات غير القابلة للإرجاع</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>المنتجات المخصصة والمصممة حسب الطلب</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>المنتجات المنقوشة بأسماء أو رسائل شخصية</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>المنتجات المستخدمة أو التالفة</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>المنتجات المشتراة خلال فترة التخفيضات النهائية</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">كيفية الإرجاع</h2>
            <ol className="space-y-4 text-gray-600">
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-[#c9a962] text-white rounded-full flex items-center justify-center flex-shrink-0">1</span>
                <div>
                  <h3 className="font-medium text-gray-900">تواصل معنا</h3>
                  <p>اتصل بنا أو أرسل بريداً إلكترونياً خلال 30 يوماً من الاستلام</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-[#c9a962] text-white rounded-full flex items-center justify-center flex-shrink-0">2</span>
                <div>
                  <h3 className="font-medium text-gray-900">تعبئة النموذج</h3>
                  <p>سنرسل لك نموذج الإرجاع لتعبئته</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-[#c9a962] text-white rounded-full flex items-center justify-center flex-shrink-0">3</span>
                <div>
                  <h3 className="font-medium text-gray-900">تجهيز المنتج</h3>
                  <p>ضع المنتج في عبوته الأصلية مع جميع المستندات</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-[#c9a962] text-white rounded-full flex items-center justify-center flex-shrink-0">4</span>
                <div>
                  <h3 className="font-medium text-gray-900">الاستلام</h3>
                  <p>سيقوم مندوبنا باستلام المنتج منك مجاناً</p>
                </div>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">استرداد المبلغ</h2>
            <p className="text-gray-600">
              بعد استلام المنتج وفحصه، سيتم استرداد المبلغ خلال 5-7 أيام عمل إلى نفس طريقة الدفع المستخدمة. في حالة الدفع عند الاستلام، سيتم التحويل إلى حسابك البنكي.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">الاستبدال</h2>
            <p className="text-gray-600">
              يمكنك استبدال المنتج بمنتج آخر من نفس القيمة أو أعلى. في حالة اختيار منتج ذو قيمة أعلى، سيُطلب منك دفع الفرق.
            </p>
          </section>

          <div className="bg-[#faf9f7] rounded-lg p-6 text-center">
            <h3 className="font-semibold mb-2">هل لديك استفسار؟</h3>
            <p className="text-gray-600 mb-4">تواصل معنا وسنساعدك في حل أي مشكلة</p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a962] text-white rounded-lg hover:bg-[#b8944f] transition-colors"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
