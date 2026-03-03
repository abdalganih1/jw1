'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

// ── بيانات القيم الأساسية ────────────────────────────────────────────
const coreValues = [
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        title: 'الابتكار',
        desc: 'نسعى دائماً لتقديم تصاميم مبتكرة تعكس روح العصر وتتجاوز التوقعات في كل قطعة نصنعها.',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        ),
        title: 'الجودة',
        desc: 'نختار أفضل المواد وأرقى الأحجار الكريمة لضمان جودة استثنائية في كل تفصيل وكل قطعة.',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        title: 'رضا العملاء',
        desc: 'عملاؤنا هم محور عملنا، نضمن لهم تجربة تسوق استثنائية وخدمة ما بعد البيع مميزة.',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: 'الثقة',
        desc: 'نبني علاقات طويلة الأمد مبنية على الشفافية والنزاهة مع عملائنا وشركائنا.',
    },
];

// ── بيانات Timeline ──────────────────────────────────────────────────
const milestones = [
    { year: '2020', title: 'تأسيس الشركة', desc: 'بدأت رحلتنا بحلم صغير وفريق متحمس لتغيير صناعة المجوهرات الفاخرة في المنطقة.', color: '#c9a962' },
    { year: '2021', title: 'إطلاق التقنية', desc: 'أطلقنا أول منصتنا الرقمية لتصميم المجوهرات بالذكاء الاصطناعي، وفزنا بجائزة الابتكار التقني.', color: '#c9a962' },
    { year: '2022', title: 'التوسع الإقليمي', desc: 'فتحنا أبوابنا في 5 دول خليجية وضاعفنا قاعدة عملائنا ثلاث مرات خلال عام واحد.', color: '#c9a962' },
    { year: '2023', title: 'مئة ألف عميل', desc: 'تجاوزنا 100,000 عميل سعيد وأطلقنا خدمة التصميم الشخصي المدعومة بالذكاء الاصطناعي.', color: '#c9a962' },
    { year: '2024', title: 'الريادة العالمية', desc: 'حصلنا على جوائز دولية وأصبحنا المرجع الأول لمجوهرات الذكاء الاصطناعي في العالم العربي.', color: '#c9a962' },
];

// ── الإحصائيات ───────────────────────────────────────────────────────
const stats = [
    { value: '+50K', label: 'عميل سعيد' },
    { value: '+100K', label: 'قطعة مصممة' },
    { value: '+15', label: 'جائزة دولية' },
];

export default function AboutPage() {
    const { t, lang } = useLanguage();
    const [activeYear, setActiveYear] = useState<string | null>(null);

    // ترجمة القيم الأساسية
    const localizedValues = [
        { icon: coreValues[0].icon, title: lang === 'en' ? 'Innovation' : 'الابتكار', desc: lang === 'en' ? 'We constantly push boundaries, creating innovative designs that reflect the spirit of the era and exceed all expectations.' : 'نسعى دائماً لتقديم تصاميم مبتكرة تعكس روح العصر وتتجاوز التوقعات في كل قطعة نصنعها.' },
        { icon: coreValues[1].icon, title: lang === 'en' ? 'Quality' : 'الجودة', desc: lang === 'en' ? 'We select the finest materials and most precious gemstones to ensure exceptional quality in every detail.' : 'نختار أفضل المواد وأرقى الأحجار الكريمة لضمان جودة استثنائية في كل تفصيل وكل قطعة.' },
        { icon: coreValues[2].icon, title: lang === 'en' ? 'Customer Satisfaction' : 'رضا العملاء', desc: lang === 'en' ? 'Our customers are our focus — we guarantee an exceptional shopping experience and outstanding after-sales service.' : 'عملاؤنا هم محور عملنا، نضمن لهم تجربة تسوق استثنائية وخدمة ما بعد البيع مميزة.' },
        { icon: coreValues[3].icon, title: lang === 'en' ? 'Trust' : 'الثقة', desc: lang === 'en' ? 'We build long-term relationships founded on transparency and integrity with our customers and partners.' : 'نبني علاقات طويلة الأمد مبنية على الشفافية والنزاهة مع عملائنا وشركائنا.' },
    ];

    // ترجمة Timeline
    const localizedMilestones = [
        { year: '2020', title: lang === 'en' ? 'Company Founded' : 'تأسيس الشركة', desc: lang === 'en' ? 'Our journey began with a small dream and an enthusiastic team determined to transform the luxury jewelry industry.' : 'بدأت رحلتنا بحلم صغير وفريق متحمس لتغيير صناعة المجوهرات الفاخرة في المنطقة.' },
        { year: '2021', title: lang === 'en' ? 'Technology Launch' : 'إطلاق التقنية', desc: lang === 'en' ? 'We launched our first AI-powered jewelry design platform and won the Technology Innovation Award.' : 'أطلقنا أول منصتنا الرقمية لتصميم المجوهرات بالذكاء الاصطناعي، وفزنا بجائزة الابتكار التقني.' },
        { year: '2022', title: lang === 'en' ? 'Regional Expansion' : 'التوسع الإقليمي', desc: lang === 'en' ? 'We expanded to 5 Gulf countries and tripled our customer base within a single year.' : 'فتحنا أبوابنا في 5 دول خليجية وضاعفنا قاعدة عملائنا ثلاث مرات خلال عام واحد.' },
        { year: '2023', title: lang === 'en' ? '100K Customers' : 'مئة ألف عميل', desc: lang === 'en' ? 'We surpassed 100,000 happy customers and launched our AI-powered personal design service.' : 'تجاوزنا 100,000 عميل سعيد وأطلقنا خدمة التصميم الشخصي المدعومة بالذكاء الاصطناعي.' },
        { year: '2024', title: lang === 'en' ? 'Global Leadership' : 'الريادة العالمية', desc: lang === 'en' ? 'We received international awards and became the #1 reference for AI jewelry in the Arab world.' : 'حصلنا على جوائز دولية وأصبحنا المرجع الأول لمجوهرات الذكاء الاصطناعي في العالم العربي.' },
    ];

    const statsLabels = lang === 'en'
        ? [{ value: '+50K', label: 'Happy Customers' }, { value: '+100K', label: 'Pieces Designed' }, { value: '+15', label: 'Int. Awards' }]
        : [{ value: '+50K', label: 'عميل سعيد' }, { value: '+100K', label: 'قطعة مصممة' }, { value: '+15', label: 'جائزة دولية' }];

    return (
        <div
            className="min-h-screen"
            style={{ background: 'linear-gradient(135deg, #0d0a0e 0%, #110d15 50%, #0a0810 100%)' }}
            dir="rtl"
        >
            {/* ━━━━━━━━━━━━━━━━━━ Hero ━━━━━━━━━━━━━━━━━━ */}
            <div className="relative overflow-hidden">
                {/* خلفية Hero */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1400&h=600&fit=crop"
                        alt="ورشة مجوهرات"
                        fill
                        className="object-cover opacity-30"
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to bottom, rgba(13,10,14,0.6), rgba(13,10,14,0.85))' }}
                    />
                </div>

                <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
                    <p className="text-[#c9a962] text-sm uppercase tracking-[0.3em] mb-4 font-medium">{t('about.hero.badge')}</p>
                    <h1 className="text-4xl lg:text-6xl font-display font-light text-white leading-tight mb-6">
                        {t('about.hero.title1')}{' '}
                        <span style={{ color: '#c9a962' }}>{t('about.hero.title2')}</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('about.hero.sub')}
                    </p>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━ قسم القصة + الإحصائيات ━━━━━━━━━━━━━━━━━━ */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-14 items-center">

                    {/* الصورة - يسار */}
                    <div className="relative">
                        <div
                            className="rounded-2xl overflow-hidden"
                            style={{ border: '1px solid rgba(201,169,98,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&h=520&fit=crop"
                                alt="قصة الإبداع والتميز"
                                width={700}
                                height={520}
                                className="w-full object-cover"
                            />
                        </div>
                        {/* شارة عليها */}
                        <div
                            className="absolute -bottom-5 -right-4 px-5 py-3 rounded-xl text-center"
                            style={{
                                background: 'linear-gradient(135deg, #c9a962, #a87c2a)',
                                boxShadow: '0 8px 24px rgba(201,169,98,0.3)',
                            }}
                        >
                            <p className="text-[#110d15] text-2xl font-bold leading-none">5+</p>
                            <p className="text-[#110d15]/80 text-xs mt-1 font-medium">سنوات خبرة</p>
                        </div>
                    </div>

                    {/* النص - يمين */}
                    <div>
                        <p className="text-[#c9a962] text-xs uppercase tracking-[0.25em] mb-3 font-semibold">{t('about.story.badge')}</p>
                        <h2 className="text-3xl lg:text-4xl font-display font-light text-white mb-6 leading-snug">
                            {t('about.story.title1')}<br />
                            <span style={{ color: '#c9a962' }}>{t('about.story.title2')}</span>
                        </h2>
                        <p className="text-white/55 leading-relaxed mb-4 text-[15px]">
                            {lang === 'en'
                                ? 'Since 2020, we set out with a clear vision: making luxury jewelry accessible to everyone through AI. We started with a team of five passionate individuals, and today we serve over 50,000 happy customers.'
                                : 'منذ عام 2020، انطلقنا برؤية واضحة: نجعل المجوهرات الفاخرة في متناول الجميع عبر الذكاء الاصطناعي. بدأنا بفريق من خمسة أشخاص متحمسين، واليوم نفخر بخدمة أكثر من 50,000 عميل سعيد.'}
                        </p>
                        <p className="text-white/45 leading-relaxed text-[15px] mb-8">
                            {lang === 'en'
                                ? 'We believe every piece of jewelry carries a story, and our mission is to make that story as unique and special as the person wearing it.'
                                : 'نؤمن أن كل قطعة مجوهرات تحمل قصة، ومهمتنا أن نجعل تلك القصة فريدة ومميزة تماماً مثل الشخص الذي يرتديها.'}
                        </p>

                        {/* الإحصائيات */}
                        <div className="grid grid-cols-3 gap-4">
                            {statsLabels.map((s, i) => (
                                <div
                                    key={i}
                                    className="text-center py-4 px-3 rounded-xl"
                                    style={{
                                        background: 'rgba(201,169,98,0.07)',
                                        border: '1px solid rgba(201,169,98,0.15)',
                                    }}
                                >
                                    <p className="text-2xl font-bold" style={{ color: '#c9a962' }}>{s.value}</p>
                                    <p className="text-white/50 text-[11px] mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━ القيم الأساسية ━━━━━━━━━━━━━━━━━━ */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* العنوان */}
                <div className="text-center mb-14">
                    <p className="text-[#c9a962] text-xs uppercase tracking-[0.3em] mb-3 font-semibold">{t('about.values.badge')}</p>
                    <h2 className="text-3xl lg:text-4xl font-display font-light text-white mb-4">{t('about.values.title')}</h2>
                    <p className="text-white/45 max-w-xl mx-auto text-sm">{t('about.values.sub')}</p>
                    <div className="w-16 h-px mx-auto mt-5" style={{ background: '#c9a962' }} />
                </div>

                {/* البطاقات الأربع */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {localizedValues.map((val, i) => (
                        <div
                            key={i}
                            className="group p-6 rounded-xl transition-all duration-300 text-center"
                            style={{
                                background: 'linear-gradient(145deg, #16111e, #1a1428)',
                                border: '1px solid rgba(201,169,98,0.12)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,169,98,0.4)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,169,98,0.12)')}
                        >
                            {/* أيقونة */}
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 transition-all duration-300"
                                style={{
                                    background: 'rgba(201,169,98,0.1)',
                                    color: '#c9a962',
                                    border: '1px solid rgba(201,169,98,0.2)',
                                }}
                            >
                                {val.icon}
                            </div>
                            <h3 className="text-white font-semibold mb-3 text-base">{val.title}</h3>
                            <p className="text-white/45 text-[13px] leading-relaxed">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━ Timeline رحلة النجاح ━━━━━━━━━━━━━━━━━━ */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* العنوان */}
                <div className="text-center mb-14">
                    <p className="text-[#c9a962] text-xs uppercase tracking-[0.3em] mb-3 font-semibold">{t('about.timeline.badge')}</p>
                    <h2 className="text-3xl lg:text-4xl font-display font-light text-white mb-4">{t('about.timeline.title')}</h2>
                    <p className="text-white/45 text-sm">{lang === 'en' ? 'Key milestones in our journey' : 'أبرز المحطات في مسيرتنا'}</p>
                    <div className="w-16 h-px mx-auto mt-5" style={{ background: '#c9a962' }} />
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* الخط الرأسي */}
                    <div
                        className="absolute right-1/2 translate-x-1/2 top-0 bottom-0 w-px"
                        style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,169,98,0.4), transparent)' }}
                    />

                    <div className="space-y-10">
                        {localizedMilestones.map((m, i) => (
                            <div
                                key={i}
                                className={`grid grid-cols-2 gap-8 items-center ${i % 2 === 0 ? '' : 'direction-ltr'}`}
                            >
                                {/* المحتوى */}
                                {i % 2 === 0 ? (
                                    <>
                                        {/* النص - يمين */}
                                        <div className="text-right pr-8">
                                            <div
                                                className="p-5 rounded-xl transition-all duration-300 cursor-pointer"
                                                style={{
                                                    background: 'linear-gradient(145deg, #16111e, #1a1428)',
                                                    border: '1px solid rgba(201,169,98,0.12)',
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.borderColor = 'rgba(201,169,98,0.35)';
                                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,169,98,0.1)';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.borderColor = 'rgba(201,169,98,0.12)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <p className="text-[#c9a962] font-bold text-xl mb-1">{m.year}</p>
                                                <h3 className="text-white font-semibold mb-2">{m.title}</h3>
                                                <p className="text-white/45 text-[13px] leading-relaxed">{m.desc}</p>
                                            </div>
                                        </div>
                                        {/* النقطة + اليسار فارغ */}
                                        <div className="relative flex items-center justify-start pl-8">
                                            <div
                                                className="absolute -right-[calc(50%-16px)] w-4 h-4 rounded-full z-10"
                                                style={{ background: '#c9a962', boxShadow: '0 0 0 4px rgba(201,169,98,0.2)' }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* اليمين فارغ */}
                                        <div className="relative flex items-center justify-end pr-8">
                                            <div
                                                className="absolute -left-[calc(50%-16px)] w-4 h-4 rounded-full z-10"
                                                style={{ background: '#c9a962', boxShadow: '0 0 0 4px rgba(201,169,98,0.2)' }}
                                            />
                                        </div>
                                        {/* النص - يسار */}
                                        <div className="text-left pl-8">
                                            <div
                                                className="p-5 rounded-xl transition-all duration-300 cursor-pointer"
                                                style={{
                                                    background: 'linear-gradient(145deg, #16111e, #1a1428)',
                                                    border: '1px solid rgba(201,169,98,0.12)',
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.borderColor = 'rgba(201,169,98,0.35)';
                                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,169,98,0.1)';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.borderColor = 'rgba(201,169,98,0.12)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <p className="text-[#c9a962] font-bold text-xl mb-1">{m.year}</p>
                                                <h3 className="text-white font-semibold mb-2">{m.title}</h3>
                                                <p className="text-white/45 text-[13px] leading-relaxed">{m.desc}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━ CTA ━━━━━━━━━━━━━━━━━━ */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div
                    className="rounded-2xl p-12 text-center"
                    style={{
                        background: 'linear-gradient(135deg, rgba(201,169,98,0.12), rgba(201,169,98,0.04))',
                        border: '1px solid rgba(201,169,98,0.2)',
                    }}
                >
                    <h2 className="text-3xl font-display font-light text-white mb-4">{t('about.cta.title')}</h2>
                    <p className="text-white/50 mb-8 max-w-xl mx-auto">
                        {lang === 'en' ? 'Discover a world of jewelry crafted especially for you with AI technology' : 'اكتشفي عالماً من المجوهرات المصممة خصيصاً لكِ بتقنية الذكاء الاصطناعي'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/shop"
                            className="px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
                            style={{ background: '#c9a962', color: '#110d15' }}
                        >
                            {t('about.cta.shop')}
                        </Link>
                        <Link
                            href="/contact"
                            className="px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 border hover:bg-white/5"
                            style={{ border: '1px solid rgba(201,169,98,0.4)', color: '#c9a962' }}
                        >
                            {t('about.cta.contact')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
