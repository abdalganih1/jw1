'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

function ContactContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: typeParam === 'consultation' ? 'استشارة' : '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
            تواصل معنا
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            نسعد بتواصلكم معنا. فريقنا جاهز للإجابة على استفساراتكم ومساعدتكم
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div dir="rtl">
            <div className="bg-white rounded-lg p-6 lg:p-8">
              <h2 className="text-xl font-semibold mb-6">أرسل لنا رسالة</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">الاسم</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      dir="ltr"
                    />
                  </div>
                </div>

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
                  <label className="block text-sm font-medium mb-1">الموضوع</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                  >
                    <option value="">اختر الموضوع</option>
                    <option value="استفسار">استفسار عام</option>
                    <option value="استشارة">حجز استشارة</option>
                    <option value="طلب">استفسار عن طلب</option>
                    <option value="تصميم">تصميم مخصص</option>
                    <option value="شكاوى">شكاوى واقتراحات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">الرسالة</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#c9a962] text-white rounded-lg font-medium hover:bg-[#b8944f] transition-colors"
                >
                  إرسال الرسالة
                </button>
              </form>
            </div>
          </div>

          <div dir="rtl">
            <div className="bg-[#1a1a1a] text-white rounded-lg p-6 lg:p-8 mb-6">
              <h2 className="text-xl font-semibold mb-6">معلومات التواصل</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#c9a962] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">العنوان</h3>
                    <p className="text-gray-400">
                      مركز المملكة، الدور الأرضي<br />
                      طريق الملك فهد، الرياض<br />
                      المملكة العربية السعودية
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#c9a962] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">الهاتف</h3>
                    <p className="text-gray-400" dir="ltr">+966 11 234 5678</p>
                    <p className="text-gray-400 text-sm mt-1">السبت - الخميس: 10ص - 10م</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#c9a962] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">البريد الإلكتروني</h3>
                    <p className="text-gray-400" dir="ltr">info@luxejewelry.sa</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">حجز موعد</h2>
              <p className="text-gray-600 mb-4">
                احجز موعداً لاستشارة مجانية مع أحد خبرائنا للحصول على نصائح شخصية حول اختيار المجوهرات المناسبة.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>جلسة 30 دقيقة</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>أونلاين أو في المتجر</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return <ContactContent />;
}
