'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
    lang: Language;
    setLang: (l: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: 'ar',
    setLang: () => { },
    t: (k) => k,
});

// ── قاموس الترجمات ───────────────────────────────────────────────────
export const translations: Record<Language, Record<string, string>> = {
    ar: {
        // Navbar
        'nav.ramadan': 'مجموعة رمضان',
        'nav.diamonds': 'ألماس',
        'nav.gold': 'ذهب',
        'nav.modern': 'مجوهرات عصرية',
        'nav.labDiamonds': 'ألماس مختبرات',
        'nav.wedding': 'زفاف وخطوبة',
        'nav.gifts': 'هدايا ومناسبات',
        'nav.all': 'تسوّقوا كلّ المجوهرات',
        'nav.about': 'من نحن',
        'nav.contact': 'تواصل معنا',
        'nav.search': 'ابحثي عن المجوهرات...',
        'nav.language': 'عربي',
        'nav.country': 'KSA',
        // Hero (الصفحة الرئيسية)
        'home.hero.badge': 'مجوهرات فاخرة',
        'home.hero.title1': 'أناقة',
        'home.hero.title2': 'بلا حدود',
        'home.hero.subtitle': 'اكتشفي مجموعتنا الحصرية من المجوهرات الفاخرة المصممة بأرقى المعادن والأحجار الكريمة',
        'home.hero.cta': 'تسوّقي الآن',
        'home.hero.builder': 'صمّمي قطعتك',
        'home.featured': 'المجموعة المميزة',
        'home.featured.sub': 'أحدث تصاميمنا الفاخرة',
        'home.viewAll': 'عرض الكل',
        'home.whyUs': 'لماذا Vivelt Gold',
        'home.story.title': 'من نحن',
        'home.story.sub': 'قصتنا مع الجمال',
        // Shop
        'shop.title': 'المتجر',
        'shop.products': 'منتج',
        'shop.filter': 'تصفية',
        'shop.noProducts': 'لم يتم العثور على منتجات',
        'shop.clearFilters': 'مسح الفلاتر',
        'shop.addToCart': 'أضف للسلة',
        // Filter
        'filter.title': 'التصفية',
        'filter.clearAll': 'مسح الكل',
        'filter.sortBy': 'ترتيب حسب',
        'filter.type': 'النوع',
        'filter.all': 'الكل',
        'filter.metal': 'المعدن',
        'filter.stone': 'الحجر الكريم',
        'filter.priceRange': 'نطاق السعر',
        'filter.popular': 'الأكثر شيوعاً',
        'filter.priceAsc': 'السعر: من الأقل للأعلى',
        'filter.priceDesc': 'السعر: من الأعلى للأقل',
        'filter.newest': 'الأحدث',
        // About
        'about.hero.badge': 'Vivelt Gold',
        'about.hero.title1': 'قصتنا مع',
        'about.hero.title2': 'الإبداع',
        'about.hero.sub': 'من ورشة صغيرة إلى مرجع عالمي — رحلة من الشغف والإبداع والتميز',
        'about.story.badge': 'قصتنا',
        'about.story.title1': 'رحلة الإبداع',
        'about.story.title2': 'والتميز',
        'about.values.badge': 'ما يميزنا',
        'about.values.title': 'قيمنا الأساسية',
        'about.values.sub': 'المبادئ التي تحكم كل قرار نتخذه وكل قطعة نصنعها',
        'about.timeline.badge': 'مسيرتنا',
        'about.timeline.title': 'رحلة النجاح',
        'about.cta.title': 'ابدأي رحلتك معنا',
        'about.cta.shop': 'تسوقي الآن',
        'about.cta.contact': 'تواصلي معنا',
        // Contact
        'contact.hero.badge': 'نحن هنا لك',
        'contact.hero.title1': 'تواصل',
        'contact.hero.title2': 'معنا',
        'contact.hero.sub': 'فريقنا جاهز للرد على استفساراتك ومساعدتك',
        'contact.form.title': 'أرسل لنا رسالة',
        'contact.form.name': 'الاسم الكامل',
        'contact.form.email': 'البريد الإلكتروني',
        'contact.form.phone': 'رقم الهاتف',
        'contact.form.subject': 'الموضوع',
        'contact.form.message': 'الرسالة',
        'contact.form.send': 'إرسال الرسالة',
        'contact.form.success': '✓ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً',
        'contact.faq.badge': 'لديك استفسار؟',
        'contact.faq.title': 'الأسئلة الشائعة',
        'contact.phone': 'الهاتف',
        'contact.emailLabel': 'البريد الإلكتروني',
        'contact.address': 'العنوان',
        'contact.hours': 'ساعات العمل',
        // Footer
        'footer.rights': '© 2024 Vivelt gold. جميع الحقوق محفوظة.',
        'footer.sections': 'الأقسام',
        'footer.help': 'المساعدة',
        'footer.contactUs': 'تواصل معنا',
        'footer.about': 'من نحن',
        'footer.faq': 'الأسئلة الشائعة',
        'footer.returns': 'سياسة الإرجاع',
        'footer.consultation': 'حجز استشارة',
    },

    en: {
        // Navbar
        'nav.ramadan': 'Ramadan Collection',
        'nav.diamonds': 'Diamonds',
        'nav.gold': 'Gold',
        'nav.modern': 'Modern Jewelry',
        'nav.labDiamonds': 'Lab Diamonds',
        'nav.wedding': 'Wedding & Engagement',
        'nav.gifts': 'Gifts & Occasions',
        'nav.all': 'Shop All Jewelry',
        'nav.about': 'About Us',
        'nav.contact': 'Contact Us',
        'nav.search': 'Search jewelry...',
        'nav.language': 'English',
        'nav.country': 'KSA',
        // Hero
        'home.hero.badge': 'Luxury Jewelry',
        'home.hero.title1': 'Elegance',
        'home.hero.title2': 'Redefined',
        'home.hero.subtitle': 'Discover our exclusive collection of luxury jewelry crafted with the finest metals and gemstones',
        'home.hero.cta': 'Shop Now',
        'home.hero.builder': 'Design Yours',
        'home.featured': 'Featured Collection',
        'home.featured.sub': 'Our latest luxury designs',
        'home.viewAll': 'View All',
        'home.whyUs': 'Why Vivelt Gold',
        'home.story.title': 'About Us',
        'home.story.sub': 'Our story of beauty',
        // Shop
        'shop.title': 'Shop',
        'shop.products': 'Products',
        'shop.filter': 'Filter',
        'shop.noProducts': 'No products found',
        'shop.clearFilters': 'Clear Filters',
        'shop.addToCart': 'Add to Cart',
        // Filter
        'filter.title': 'Filter',
        'filter.clearAll': 'Clear All',
        'filter.sortBy': 'Sort By',
        'filter.type': 'Type',
        'filter.all': 'All',
        'filter.metal': 'Metal',
        'filter.stone': 'Gemstone',
        'filter.priceRange': 'Price Range',
        'filter.popular': 'Most Popular',
        'filter.priceAsc': 'Price: Low to High',
        'filter.priceDesc': 'Price: High to Low',
        'filter.newest': 'Newest',
        // About
        'about.hero.badge': 'Vivelt Gold',
        'about.hero.title1': 'Our Story of',
        'about.hero.title2': 'Creativity',
        'about.hero.sub': 'From a small workshop to a global reference — a journey of passion, creativity, and excellence',
        'about.story.badge': 'Our Story',
        'about.story.title1': 'Journey of Creativity',
        'about.story.title2': '& Excellence',
        'about.values.badge': 'What Sets Us Apart',
        'about.values.title': 'Our Core Values',
        'about.values.sub': 'The principles that guide every decision we make and every piece we craft',
        'about.timeline.badge': 'Our Journey',
        'about.timeline.title': 'Road to Success',
        'about.cta.title': 'Start Your Journey With Us',
        'about.cta.shop': 'Shop Now',
        'about.cta.contact': 'Contact Us',
        // Contact
        'contact.hero.badge': "We're Here For You",
        'contact.hero.title1': 'Contact',
        'contact.hero.title2': 'Us',
        'contact.hero.sub': 'Our team is ready to answer your queries and help you find the perfect jewelry',
        'contact.form.title': 'Send Us a Message',
        'contact.form.name': 'Full Name',
        'contact.form.email': 'Email Address',
        'contact.form.phone': 'Phone Number',
        'contact.form.subject': 'Subject',
        'contact.form.message': 'Message',
        'contact.form.send': 'Send Message',
        'contact.form.success': '✓ Your message was sent successfully! We will contact you soon',
        'contact.faq.badge': 'Have a Question?',
        'contact.faq.title': 'Frequently Asked Questions',
        'contact.phone': 'Phone',
        'contact.emailLabel': 'Email',
        'contact.address': 'Address',
        'contact.hours': 'Working Hours',
        // Footer
        'footer.rights': '© 2024 Vivelt gold. All rights reserved.',
        'footer.sections': 'Collections',
        'footer.help': 'Help',
        'footer.contactUs': 'Contact Us',
        'footer.about': 'About Us',
        'footer.faq': 'FAQ',
        'footer.returns': 'Return Policy',
        'footer.consultation': 'Book Consultation',
    },
};

// ── Provider ─────────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Language>('ar');

    useEffect(() => {
        const saved = localStorage.getItem('vivelt-lang') as Language | null;
        if (saved === 'ar' || saved === 'en') setLangState(saved);
    }, []);

    const setLang = (l: Language) => {
        setLangState(l);
        localStorage.setItem('vivelt-lang', l);
        // تحديث dir و lang على <html>
        document.documentElement.lang = l;
        document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    };

    const t = (key: string): string =>
        translations[lang][key] ?? translations['ar'][key] ?? key;

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

// ── Hook ─────────────────────────────────────────────────────────────
export function useLanguage() {
    return useContext(LanguageContext);
}
