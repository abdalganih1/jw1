'use client';

import { categories, metals, stones } from '@/data/products';

interface FilterSidebarProps {
  selectedCategory: string | null;
  selectedMetals: string[];
  selectedStones: string[];
  priceRange: [number, number];
  sortBy: string;
  onCategoryChange: (category: string | null) => void;
  onMetalChange: (metal: string) => void;
  onStoneChange: (stone: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  selectedCategory,
  selectedMetals,
  selectedStones,
  priceRange,
  sortBy,
  onCategoryChange,
  onMetalChange,
  onStoneChange,
  onPriceChange,
  onSortChange,
  onClearFilters
}: FilterSidebarProps) {
  const hasFilters = selectedCategory || selectedMetals.length > 0 || selectedStones.length > 0 || priceRange[0] > 0 || priceRange[1] < 15000;

  return (
    <div
      className="rounded-xl p-5 text-right border"
      style={{
        background: 'linear-gradient(145deg, #16111e, #1a1428)',
        borderColor: 'rgba(201,169,98,0.15)',
      }}
      dir="rtl"
    >
      {/* رأس القسم */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-white tracking-wide">التصفية</h2>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-[#c9a962] hover:text-[#e0c070] transition-colors"
          >
            مسح الكل
          </button>
        )}
      </div>

      {/* فاصل */}
      <div className="h-px bg-[#c9a962]/15 mb-5" />

      {/* الترتيب */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-[#c9a962]/80 uppercase tracking-widest mb-3">ترتيب حسب</h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#c9a962]/50 transition-colors"
          style={{
            background: '#0d0a0e',
            border: '1px solid rgba(201,169,98,0.2)',
            color: '#e8e0d0',
          }}
        >
          <option value="popular">الأكثر شيوعاً</option>
          <option value="price-asc">السعر: من الأقل للأعلى</option>
          <option value="price-desc">السعر: من الأعلى للأقل</option>
          <option value="newest">الأحدث</option>
        </select>
      </div>

      {/* النوع */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-[#c9a962]/80 uppercase tracking-widest mb-3">النوع</h3>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange(null)}
            className={`block w-full text-right px-3 py-2 rounded-lg text-sm transition-all duration-200 ${!selectedCategory
                ? 'bg-[#c9a962] text-[#0d0a0e] font-semibold'
                : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`block w-full text-right px-3 py-2 rounded-lg text-sm transition-all duration-200 ${selectedCategory === category.id
                  ? 'bg-[#c9a962] text-[#0d0a0e] font-semibold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              {category.icon} {category.nameAr}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#c9a962]/10 mb-5" />

      {/* المعدن */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-[#c9a962]/80 uppercase tracking-widest mb-3">المعدن</h3>
        <div className="space-y-2.5">
          {metals.map((metal) => (
            <label key={metal.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedMetals.includes(metal.id)}
                onChange={() => onMetalChange(metal.id)}
                className="w-4 h-4 rounded accent-[#c9a962] border-gray-600"
                style={{ accentColor: '#c9a962' }}
              />
              <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors">{metal.nameAr}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#c9a962]/10 mb-5" />

      {/* الحجر */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-[#c9a962]/80 uppercase tracking-widest mb-3">الحجر الكريم</h3>
        <div className="space-y-2.5">
          {stones.map((stone) => (
            <label key={stone.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedStones.includes(stone.id)}
                onChange={() => onStoneChange(stone.id)}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#c9a962' }}
              />
              <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors">{stone.nameAr}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#c9a962]/10 mb-5" />

      {/* نطاق السعر */}
      <div>
        <h3 className="text-xs font-semibold text-[#c9a962]/80 uppercase tracking-widest mb-3">نطاق السعر</h3>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="15000"
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: '#c9a962' }}
          />
          <div className="flex justify-between text-xs text-[#c9a962]/70">
            <span>{priceRange[0].toLocaleString('en-US')} $</span>
            <span>{priceRange[1].toLocaleString('en-US')} $</span>
          </div>
        </div>
      </div>
    </div>
  );
}
