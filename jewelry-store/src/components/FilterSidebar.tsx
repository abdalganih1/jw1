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
    <div className="bg-white rounded-lg p-6 text-right" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">التصفية</h2>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-[#c9a962] hover:underline"
          >
            مسح الكل
          </button>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-3">ترتيب حسب</h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
        >
          <option value="popular">الأكثر شيوعاً</option>
          <option value="price-asc">السعر: من الأقل للأعلى</option>
          <option value="price-desc">السعر: من الأعلى للأقل</option>
          <option value="newest">الأحدث</option>
        </select>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-3">النوع</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`block w-full text-right px-3 py-2 rounded-lg transition-colors ${!selectedCategory ? 'bg-[#c9a962] text-white' : 'hover:bg-gray-100'}`}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`block w-full text-right px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.id ? 'bg-[#c9a962] text-white' : 'hover:bg-gray-100'}`}
            >
              {category.icon} {category.nameAr}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-3">المعدن</h3>
        <div className="space-y-2">
          {metals.map((metal) => (
            <label key={metal.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMetals.includes(metal.id)}
                onChange={() => onMetalChange(metal.id)}
                className="w-4 h-4 text-[#c9a962] border-gray-300 rounded focus:ring-[#c9a962]"
              />
              <span className="text-sm">{metal.nameAr}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-3">الحجر</h3>
        <div className="space-y-2">
          {stones.map((stone) => (
            <label key={stone.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedStones.includes(stone.id)}
                onChange={() => onStoneChange(stone.id)}
                className="w-4 h-4 text-[#c9a962] border-gray-300 rounded focus:ring-[#c9a962]"
              />
              <span className="text-sm">{stone.nameAr}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">نطاق السعر</h3>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="15000"
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-[#c9a962]"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{priceRange[0]} ر.س</span>
            <span>{priceRange[1]} ر.س</span>
          </div>
        </div>
      </div>
    </div>
  );
}
