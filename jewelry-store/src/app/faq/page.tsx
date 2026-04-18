import Link from 'next/link';

const faqs = [
  {
    question: 'كيف يمكنني معرفة مقاسي بالضبط؟',
    answer: 'نوفر لك دليل مقاسات تفصيلي لكل نوع من المجوهرات. يمكنك أيضاً زيارة أحد فروعنا لقياس مقاسك بدقة، أو حجز استشارة مجانية عبر الفيديو مع أحد خبرائنا.',
  },
  {
    question: 'ما هي سياسة الإرجاع والاستبدال؟',
    answer: 'يمكنك إرجاع أو استبدال المنتج خلال 30 يوماً من تاريخ الاستلام، بشرط أن يكون المنتج بحالته الأصلية وغير مستخدم. المنتجات المخصصة والمنقوشة لا يمكن إرجاعها إلا في حالة وجود عيب صناعة.',
  },
  {
    question: 'كم تستغرق عملية التوصيل؟',
    answer: 'التوصيل داخل المدن الرئيسية يستغرق 2-3 أيام عمل. للمناطق الأخرى 5-7 أيام عمل. المنتجات المخصصة تحتاج 7-14 يوم عمل للتجهيز قبل الشحن.',
  },
  {
    question: 'هل يمكنني تتبع طلبي؟',
    answer: 'نعم، بمجرد شحن طلبك ستصلك رسالة نصية وبريد إلكتروني تحتوي على رقم التتبع. يمكنك تتبع طلبك من خلال صفحة "طلباتي" في حسابك.',
  },
  {
    question: 'ما هي طرق الدفع المتاحة؟',
    answer: 'نقبل الدفع ببطاقات الائتمان (Visa, MasterCard)، Apple Pay، والدفع عند الاستلام للطلبات أقل من $5,000.',
  },
  {
    question: 'هل تقدمون خدمة التصميم المخصص؟',
    answer: 'نعم، نقدم خدمة تصميم المجوهرات المخصصة. يمكنك استخدام أداة "صمم قطعتك" على موقعنا، أو حجز موعد مع أحد مصممينا لتحويل أفكارك إلى واقع.',
  },
  {
    question: 'ما هي الضمانات المتاحة؟',
    answer: 'جميع منتجاتنا تأتي مع ضمان سنة كاملة ضد عيوب الصناعة. كما نقدم خدمة تنظيف وصيانة مجانية مدى الحياة للقطع المشتراة من متاجرنا.',
  },
  {
    question: 'هل الشحن مجاني؟',
    answer: 'الشحن مجاني لجميع الطلبات فوق $1,000 داخل المملكة. للطلبات أقل من ذلك، رسوم الشحن $50.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
            الأسئلة الشائعة
          </h1>
          <p className="text-gray-600">
            إجابات على أكثر الأسئلة شيوعاً
          </p>
        </div>

        <div className="space-y-4" dir="rtl">
          {faqs.map((faq, index) => (
            <details 
              key={index} 
              className="group bg-white rounded-lg overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="font-medium text-gray-900">{faq.question}</span>
                <svg 
                  className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center bg-white rounded-lg p-8" dir="rtl">
          <h2 className="text-xl font-semibold mb-2">لم تجد إجابة لسؤالك؟</h2>
          <p className="text-gray-600 mb-4">تواصل معنا وسنرد عليك في أقرب وقت</p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a962] text-white rounded-lg hover:bg-[#b8944f] transition-colors"
          >
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}
