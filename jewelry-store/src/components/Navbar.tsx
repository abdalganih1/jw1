'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

// ── المكوّن الرئيسي ──────────────────────────────────────────────────
export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { isAuthenticated, user, token } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ── بيانات الأقسام مع Mega Menu وصور ──────────────────────────────────
  const navCategories: Array<{
    id: string;
    label: string;
    href: string;
    highlight?: boolean;
    megaMenu: {
      columns: { title: string; links: { label: string; href: string }[] }[];
      promoImage?: { src: string; alt: string; label: string; sublabel: string; href: string };
    } | null;
  }> = [
    {
      id: 'diamonds',
      label: t('nav.diamonds'),
      href: '/shop?search=ألماس',
      megaMenu: {
        columns: [
          {
            title: t('nav.mega.categories'),
            links: [
              { label: t('nav.mega.diamondRings'), href: '/shop?search=ألماس&category=rings' },
              { label: t('nav.mega.diamondBracelets'), href: '/shop?search=ألماس&category=bracelets' },
              { label: t('nav.mega.diamondEarrings'), href: '/shop?search=ألماس&category=earrings' },
              { label: t('nav.mega.diamondNecklaces'), href: '/shop?search=ألماس&category=necklaces' },
            ],
          },
          {
            title: t('nav.mega.featured'),
            links: [
              { label: t('nav.mega.bestSeller'), href: '/shop?search=ألماس&sort=popular' },
            ],
          },
          {
            title: t('nav.mega.metal'),
            links: [
              { label: t('nav.mega.whiteGold'), href: '/shop?search=ألماس+أبيض' },
              { label: t('nav.mega.yellowGold'), href: '/shop?search=ألماس+أصفر' },
              { label: t('nav.mega.roseGold'), href: '/shop?search=ألماس+وردي' },
            ],
          },
          {
            title: t('nav.mega.byPrice'),
            links: [
              { label: t('nav.price.under1k'), href: '/shop?search=ألماس&maxPrice=1000' },
              { label: t('nav.price.1k5k'), href: '/shop?search=ألماس&minPrice=1000&maxPrice=5000' },
              { label: t('nav.price.5k15k'), href: '/shop?search=ألماس&minPrice=5000&maxPrice=15000' },
              { label: t('nav.price.over15k'), href: '/shop?search=ألماس&minPrice=15000' },
            ],
          },
        ],
        promoImage: {
          src: '/nav-diamonds.jpg',
          alt: t('nav.promoAlt.diamonds'),
          label: t('nav.diamonds'),
          sublabel: t('nav.promo.diamonds'),
          href: '/shop?search=ألماس',
        },
      },
    },
    {
      id: 'gold',
      label: t('nav.gold'),
      href: '/shop?search=ذهب',
      megaMenu: {
        columns: [
          {
            title: t('nav.mega.categories'),
            links: [
              { label: t('nav.mega.goldRings'), href: '/shop?search=ذهب&category=rings' },
              { label: t('nav.mega.goldBracelets'), href: '/shop?search=ذهب&category=bracelets' },
              { label: t('nav.mega.goldEarrings'), href: '/shop?search=ذهب&category=earrings' },
              { label: t('nav.mega.goldNecklaces'), href: '/shop?search=ذهب&category=necklaces' },
              { label: t('nav.mega.goldBars'), href: '/shop?search=سبائك+ذهب' },
            ],
          },
          {
            title: t('nav.mega.karat'),
            links: [
              { label: t('nav.mega.karat18'), href: '/shop?search=ذهب&karat=18' },
              { label: t('nav.mega.karat21'), href: '/shop?search=ذهب&karat=21' },
              { label: t('nav.mega.karat24'), href: '/shop?search=ذهب&karat=24' },
            ],
          },
          {
            title: t('nav.mega.color'),
            links: [
              { label: t('nav.mega.yellowGold'), href: '/shop?search=ذهب+أصفر' },
              { label: t('nav.mega.whiteGold'), href: '/shop?search=ذهب+أبيض' },
              { label: t('nav.mega.roseGold'), href: '/shop?search=ذهب+وردي' },
            ],
          },
          {
            title: t('nav.mega.byPrice'),
            links: [
              { label: t('nav.price.under500'), href: '/shop?search=ذهب&maxPrice=500' },
              { label: t('nav.price.5002k'), href: '/shop?search=ذهب&minPrice=500&maxPrice=2000' },
              { label: t('nav.price.over2k'), href: '/shop?search=ذهب&minPrice=2000' },
            ],
          },
        ],
        promoImage: {
          src: '/nav-gold.jpg',
          alt: t('nav.promoAlt.gold'),
          label: t('nav.gold'),
          sublabel: t('nav.promo.gold'),
          href: '/shop?search=ذهب',
        },
      },
    },
    {
      id: 'silver',
      label: t('nav.silver'),
      href: '/shop?search=فضة',
      megaMenu: {
        columns: [
          {
            title: t('nav.mega.categories'),
            links: [
              { label: t('nav.mega.silverRings'), href: '/shop?search=فضة&category=rings' },
              { label: t('nav.mega.silverBracelets'), href: '/shop?search=فضة&category=bracelets' },
              { label: t('nav.mega.silverEarrings'), href: '/shop?search=فضة&category=earrings' },
              { label: t('nav.mega.silverNecklaces'), href: '/shop?search=فضة&category=necklaces' },
            ],
          },
          {
            title: t('nav.mega.byPrice'),
            links: [
              { label: t('nav.price.under200'), href: '/shop?search=فضة&maxPrice=200' },
              { label: t('nav.price.200500'), href: '/shop?search=فضة&minPrice=200&maxPrice=500' },
              { label: t('nav.price.over500'), href: '/shop?search=فضة&minPrice=500' },
            ],
          },
        ],
        promoImage: {
          src: '/nav-silver.jpg',
          alt: t('nav.promoAlt.silver'),
          label: t('nav.silver'),
          sublabel: t('nav.promo.silver'),
          href: '/shop?search=فضة',
        },
      },
    },
    {
      id: 'platinum',
      label: t('nav.platinum'),
      href: '/shop?search=بلاتين',
      megaMenu: {
        columns: [
          {
            title: t('nav.mega.categories'),
            links: [
              { label: t('nav.mega.platinumRings'), href: '/shop?search=بلاتين&category=rings' },
              { label: t('nav.mega.platinumBracelets'), href: '/shop?search=بلاتين&category=bracelets' },
              { label: t('nav.mega.platinumEarrings'), href: '/shop?search=بلاتين&category=earrings' },
              { label: t('nav.mega.platinumNecklaces'), href: '/shop?search=بلاتين&category=necklaces' },
            ],
          },
          {
            title: t('nav.mega.byPrice'),
            links: [
              { label: t('nav.price.under1k'), href: '/shop?search=بلاتين&maxPrice=1000' },
              { label: t('nav.price.1k5k'), href: '/shop?search=بلاتين&minPrice=1000&maxPrice=5000' },
              { label: t('nav.price.over5k'), href: '/shop?search=بلاتين&minPrice=5000' },
            ],
          },
        ],
        promoImage: {
          src: '/nav-platinum.jpg',
          alt: t('nav.promoAlt.platinum'),
          label: t('nav.platinum'),
          sublabel: t('nav.promo.platinum'),
          href: '/shop?search=بلاتين',
        },
      },
    },
    {
      id: 'all',
      label: t('nav.all'),
      href: '/shop',
      megaMenu: null,
    },
    {
      id: 'about',
      label: t('nav.about'),
      href: '/about',
      megaMenu: null,
    },
    {
      id: 'contact',
      label: t('nav.contact'),
      href: '/contact',
      megaMenu: null,
    },
  ];

  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        try {
          const items = JSON.parse(cart);
          setCartCount(Array.isArray(items) ? items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0) : 0);
        } catch { setCartCount(0); }
      }
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    const interval = setInterval(updateCartCount, 2000);
    return () => { window.removeEventListener('storage', updateCartCount); clearInterval(interval); };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMouseEnter = (categoryId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const cat = navCategories.find((c) => c.id === categoryId);
    if (cat?.megaMenu) setActiveMegaMenu(categoryId);
    else setActiveMegaMenu(null);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMegaMenu(null), 200);
  };

  const keepMenuOpen = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const activeCategory = navCategories.find((c) => c.id === activeMegaMenu);

  return (
    <header className="fixed top-0 left-0 right-0 z-50" dir={lang === 'en' ? 'ltr' : 'rtl'}>

      {/* ━━━━━━━━━━━━━━━━━━ الشريط العلوي ━━━━━━━━━━━━━━━━━━ */}
      <div className="text-xs" style={{ background: '#c9a962' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-10">

            {/* الأيقونات - يسار */}
            <div className="flex items-center gap-1">

              <Link href="/cart" className="p-2 hover:text-white transition-colors" style={{ color: '#110d15' }} aria-label={t('nav.cartAria')}>
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>

              <span style={{ color: 'rgba(17,13,21,0.3)' }}>|</span>

              <Link href="/account?tab=favorites" className="p-2 hover:text-white transition-colors" style={{ color: '#110d15' }} aria-label={t('nav.favAria')}>
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              {isAuthenticated && (
                <Link href="/builder" className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-black/10 transition-colors animate-pulse" style={{ color: '#110d15' }} aria-label={t('nav.designAria')}>
                  <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  <span className="text-[11px] font-bold">{t('nav.design')}</span>
                </Link>
              )}

              {isAuthenticated ? (
                <Link href="/account" className="p-2 hover:text-white transition-colors" style={{ color: '#110d15' }} aria-label={t('nav.accountAria')}>
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              ) : (
                <Link href="/login" className="p-2 hover:text-white transition-colors" style={{ color: '#110d15' }} aria-label={t('nav.loginAria')}>
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </Link>
              )}

              {isAuthenticated && user?.role === 'ADMIN' && (
                <Link href="/admin" className="p-2 hover:text-white transition-colors" style={{ color: '#110d15' }} aria-label={t('nav.adminAria')}>
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
              )}

              <span style={{ color: 'rgba(17,13,21,0.3)' }}>|</span>

              {/* قائمة اللغة */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-black/10 transition-colors"
                  style={{ color: '#110d15' }}
                >
                  <span className="font-bold text-[11px]">{lang === 'ar' ? 'AR' : 'EN'}</span>
                  <span className="text-[11px]">{lang === 'ar' ? 'عربي' : 'English'}</span>
                  <svg
                    className="w-3 h-3 transition-transform duration-200"
                    style={{ transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isLangOpen && (
                  <div
                    className="absolute top-full mt-1 rounded-xl overflow-hidden shadow-2xl"
                    style={{
                      background: '#1a1428',
                      border: '1px solid rgba(201,169,98,0.25)',
                      minWidth: '150px',
                      right: 0,
                      zIndex: 200,
                    }}
                  >
                    <button
                      onClick={() => { setLang('ar'); setIsLangOpen(false); }}
                      className="flex items-center gap-2.5 w-full px-4 py-3 text-sm transition-colors hover:bg-white/5 text-right"
                      style={{ color: lang === 'ar' ? '#c9a962' : '#e8e0d0' }}
                    >
                      <span
                        className="font-bold text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(201,169,98,0.15)', color: '#c9a962' }}
                      >
                        AR
                      </span>
                      <span>العربية</span>
                      {lang === 'ar' && (
                        <svg className="w-3.5 h-3.5 mr-auto" style={{ color: '#c9a962' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <div className="h-px mx-3" style={{ background: 'rgba(201,169,98,0.1)' }} />
                    <button
                      onClick={() => { setLang('en'); setIsLangOpen(false); }}
                      className="flex items-center gap-2.5 w-full px-4 py-3 text-sm transition-colors hover:bg-white/5 text-right"
                      style={{ color: lang === 'en' ? '#c9a962' : '#e8e0d0' }}
                    >
                      <span
                        className="font-bold text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(201,169,98,0.15)', color: '#c9a962' }}
                      >
                        EN
                      </span>
                      <span>English</span>
                      {lang === 'en' && (
                        <svg className="w-3.5 h-3.5 mr-auto" style={{ color: '#c9a962' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <span style={{ color: 'rgba(17,13,21,0.3)' }}>|</span>

              {/* موقع */}
              <button className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-black/10 transition-colors" style={{ color: '#110d15' }}>
                <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-[11px]">{t('nav.country')}</span>
              </button>

            </div>

            {/* اسم العلامة - يمين */}
            <Link href="/" className="flex items-center gap-1.5" style={{ direction: 'ltr' }}>
              <span className="font-light tracking-[0.25em] text-[10px] uppercase" style={{ color: '#110d15' }}>Vivelt</span>
              <span className="font-bold tracking-[0.2em] text-[10px] uppercase" style={{ color: '#110d15' }}>Gold</span>
            </Link>

          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━ Header الرئيسي ━━━━━━━━━━━━━━━━━━ */}
      <div className="border-b" style={{ background: '#c9a962', borderColor: '#b8940d' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-16 lg:h-[68px] relative">

            {/* بحث + موبايل menu - يسار */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:text-white transition-colors hidden lg:flex"
                style={{ color: '#110d15' }}
                aria-label={t('nav.searchAria')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:text-white transition-colors"
                style={{ color: '#110d15' }}
                aria-label={t('nav.menuAria')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>

            {/* الشعار في المنتصف */}
            <Link href="/" className="flex flex-col items-center select-none absolute left-1/2 -translate-x-1/2">
              <span className="font-display text-3xl lg:text-4xl tracking-[0.08em] font-light leading-none" style={{ color: '#110d15' }}>
                Vivelt
              </span>
              <span className="tracking-[0.35em] text-[10px] font-bold uppercase mt-0.5" style={{ color: '#110d15' }}>
                Gold
              </span>
            </Link>

            {/* سلة - يمين */}
            <div className="flex items-center gap-2">
              <Link href="/cart" className="relative p-2 hover:text-white transition-colors" style={{ color: '#110d15' }} aria-label={t('nav.cartAria')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#110d15] text-[#c9a962] text-[9px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━ شريط الأقسام (Desktop) ━━━━━━━━━━━━━━━━━━ */}
      <div
        className="hidden lg:block border-b border-[#b8940d]/30"
        style={{ background: '#c9a962' }}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <nav className="flex items-center gap-0">
            {navCategories.map((cat) => (
              <div
                key={cat.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(cat.id)}
              >
                <Link
                  href={cat.href}
                  className={`block px-3.5 py-3.5 text-[13px] font-medium whitespace-nowrap transition-colors hover:text-white ${cat.highlight ? 'text-[#110d15] font-semibold' : 'text-[#110d15]/80'
                    } ${activeMegaMenu === cat.id ? 'text-white' : ''}`}
                >
                  {cat.label}
                  {cat.highlight && (
                    <span className="mr-1 text-[9px] align-super font-bold text-[#110d15]/60">{t('nav.new')}</span>
                  )}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Mega Menu */}
        {activeMegaMenu && activeCategory?.megaMenu && (
          <div
            className="absolute left-0 right-0 shadow-2xl z-40"
            style={{ background: '#110d15', borderTop: '1px solid rgba(201,169,98,0.1)' }}
            onMouseEnter={keepMenuOpen}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-[1400px] mx-auto px-6 py-8">
              <div className="flex gap-12">

                {/* الأعمدة */}
                <div className="flex gap-12 flex-1">
                  {activeCategory.megaMenu.columns.map((col, i) => (
                    <div key={i} className="min-w-[140px]">
                      <h4 className="text-[#c9a962] text-[10px] font-bold uppercase tracking-[0.15em] mb-4">
                        {col.title}
                      </h4>
                      <ul className="space-y-2.5">
                        {col.links.map((link, j) => (
                          <li key={j}>
                            <Link
                              href={link.href}
                              className="text-white/60 hover:text-[#c9a962] text-sm transition-colors block"
                              onClick={() => setActiveMegaMenu(null)}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* صورة ترويجية */}
                {activeCategory.megaMenu.promoImage && (
                  <Link
                    href={activeCategory.megaMenu.promoImage.href}
                    className="relative w-[200px] h-[240px] rounded-xl overflow-hidden flex-shrink-0 group"
                    onClick={() => setActiveMegaMenu(null)}
                  >
                    <Image
                      src={activeCategory.megaMenu.promoImage.src}
                      alt={activeCategory.megaMenu.promoImage.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(13,10,14,0.85), transparent)' }}
                    />
                    <div className={`absolute bottom-4 ${lang === 'en' ? 'left-4 text-left' : 'right-4 text-right'}`}>
                      <p className="text-white font-semibold text-sm">{activeCategory.megaMenu.promoImage.label}</p>
                      <p className="text-[#c9a962] text-xs">{activeCategory.megaMenu.promoImage.sublabel}</p>
                    </div>
                  </Link>
                )}

              </div>
            </div>
          </div>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━ قائمة الموبايل ━━━━━━━━━━━━━━━━━━ */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-0.5">
            {navCategories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 px-3 rounded-lg text-sm font-medium transition-colors ${cat.highlight
                  ? 'text-[#c9a962]'
                  : 'text-gray-800 hover:bg-gray-50 hover:text-[#c9a962]'
                  }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━ شريط البحث ━━━━━━━━━━━━━━━━━━ */}
      {isSearchOpen && (
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="relative">
              <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search')}
                className="w-full px-5 py-3 pr-5 border border-gray-200 rounded-full focus:outline-none focus:border-[#c9a962] text-sm text-right bg-gray-50 transition-colors"
                dir="rtl"
                autoFocus
              />
              </form>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c9a962] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
