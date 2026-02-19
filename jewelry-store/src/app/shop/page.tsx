'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { ProductCardSkeleton } from '@/components/Skeleton';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const sortParam = searchParams.get('sort');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedMetals, setSelectedMetals] = useState<string[]>([]);
  const [selectedStones, setSelectedStones] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [sortBy, setSortBy] = useState(sortParam || 'popular');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedMetals.length > 0) {
      result = result.filter(p => selectedMetals.includes(p.metal));
    }

    if (selectedStones.length > 0) {
      result = result.filter(p => p.stone && selectedStones.includes(p.stone));
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return result;
  }, [selectedCategory, selectedMetals, selectedStones, priceRange, sortBy]);

  const handleMetalChange = (metal: string) => {
    setSelectedMetals(prev => 
      prev.includes(metal) ? prev.filter(m => m !== metal) : [...prev, metal]
    );
  };

  const handleStoneChange = (stone: string) => {
    setSelectedStones(prev => 
      prev.includes(stone) ? prev.filter(s => s !== stone) : [...prev, stone]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedMetals([]);
    setSelectedStones([]);
    setPriceRange([0, 15000]);
    setSortBy('popular');
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8" dir="rtl">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">المتجر</h1>
            <p className="text-gray-600 mt-1">{filteredProducts.length} منتج</p>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            تصفية
          </button>
        </div>

        <div className="flex gap-8">
          <div className={`
            fixed lg:relative inset-0 z-40 lg:z-auto bg-black/50 lg:bg-transparent
            ${isFilterOpen ? 'block' : 'hidden'} lg:block
          `}>
            <div className={`
              fixed lg:relative right-0 top-0 lg:top-auto h-full lg:h-auto w-80 lg:w-64
              bg-white lg:bg-transparent p-6 lg:p-0 overflow-y-auto lg:overflow-visible
              transform transition-transform lg:transform-none
              ${isFilterOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="lg:hidden absolute top-4 left-4 w-8 h-8 flex items-center justify-center"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <FilterSidebar
                selectedCategory={selectedCategory}
                selectedMetals={selectedMetals}
                selectedStones={selectedStones}
                priceRange={priceRange}
                sortBy={sortBy}
                onCategoryChange={setSelectedCategory}
                onMetalChange={handleMetalChange}
                onStoneChange={handleStoneChange}
                onPriceChange={setPriceRange}
                onSortChange={setSortBy}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">لم يتم العثور على منتجات</h3>
                <p className="text-gray-600 mb-4">جرب تغيير معايير التصفية</p>
                <button
                  onClick={handleClearFilters}
                  className="text-[#c9a962] font-medium hover:underline"
                >
                  مسح الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
