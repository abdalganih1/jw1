'use client';

import { useState } from 'react';
import Link from 'next/link';
import { products, categories } from '@/data/products';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-[#c9a962] transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-display font-bold text-gradient-gold">LUXE</span>
              <span className="hidden sm:inline text-sm text-gray-400 font-light tracking-widest">JEWELRY</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.id}`}
                className="text-gray-700 hover:text-[#c9a962] transition-colors text-sm tracking-wide font-medium"
              >
                {category.nameAr}
              </Link>
            ))}
            <Link href="/builder" className="text-gray-700 hover:text-[#c9a962] transition-colors text-sm tracking-wide font-medium">
              صمم قطعتك
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-700 hover:text-[#c9a962] transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link href="/account" className="p-2 text-gray-700 hover:text-[#c9a962] transition-colors" aria-label="Account">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <Link href="/account?tab=favorites" className="p-2 text-gray-700 hover:text-[#c9a962] transition-colors" aria-label="Favorites">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-[#c9a962] transition-colors" aria-label="Cart">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c9a962] text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>

        {isSearchOpen && (
          <div className="py-4 border-t border-gray-100 animate-fadeIn">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن المجوهرات..."
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962] text-right"
                dir="rtl"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.id}`}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-[#c9a962] transition-colors text-lg"
              >
                {category.icon} {category.nameAr}
              </Link>
            ))}
            <Link
              href="/builder"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-[#c9a962] font-medium text-lg"
            >
              ✨ صمم قطعتك
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
