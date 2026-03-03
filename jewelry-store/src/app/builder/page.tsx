'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Stepper from '@/components/Stepper';
import { metals, stones } from '@/data/products';

const builderSteps = [
  { id: 1, title: 'Type', titleAr: 'النوع' },
  { id: 2, title: 'Metal', titleAr: 'المعدن' },
  { id: 3, title: 'Stone', titleAr: 'الحجر' },
  { id: 4, title: 'Size', titleAr: 'المقاس' },
  { id: 5, title: 'Extras', titleAr: 'الإضافات' },
  { id: 6, title: 'Preview', titleAr: 'المعاينة' },
];

const jewelryTypes = [
  { id: 'ring', name: 'خاتم', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400' },
  { id: 'necklace', name: 'قلادة', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400' },
  { id: 'bracelet', name: 'سوار', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400' },
  { id: 'earrings', name: 'أقراط', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400' },
];

const metalImages: Record<string, string> = {
  gold: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
  silver: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400',
  platinum: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400',
  'rose-gold': 'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=400',
};

const stoneImages: Record<string, string> = {
  diamond: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
  ruby: 'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=400',
  emerald: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
  sapphire: 'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=400',
  pearl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
};

const sizes = {
  ring: ['5', '6', '7', '8', '9', '10', '11', '12'],
  necklace: ['40cm', '45cm', '50cm', '55cm', '60cm'],
  bracelet: ['16cm', '18cm', '20cm', '22cm'],
  earrings: ['صغير', 'متوسط', 'كبير'],
};

const basePrices: Record<string, number> = {
  ring: 1500,
  necklace: 2500,
  bracelet: 2000,
  earrings: 1200,
};

const metalMultipliers: Record<string, number> = {
  gold: 1,
  silver: 0.6,
  platinum: 1.8,
  'rose-gold': 1.1,
};

const stonePrices: Record<string, number> = {
  diamond: 2000,
  ruby: 1500,
  emerald: 1800,
  sapphire: 1600,
  pearl: 500,
  none: 0,
};

export default function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
  const [selectedStone, setSelectedStone] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [engraving, setEngraving] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const calculatePrice = () => {
    if (!selectedType || !selectedMetal) return 0;

    let price = basePrices[selectedType] || 0;
    price *= metalMultipliers[selectedMetal] || 1;
    price += stonePrices[selectedStone || 'none'] || 0;
    if (engraving) price += 150;
    if (giftWrap) price += 50;

    return price;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getPreviewImage = () => {
    if (generatedImage) return generatedImage;
    if (!selectedType) return jewelryTypes[0].image;
    if (selectedMetal && metalImages[selectedMetal]) {
      return metalImages[selectedMetal];
    }
    return jewelryTypes.find(t => t.id === selectedType)?.image || jewelryTypes[0].image;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedType !== null;
      case 2: return selectedMetal !== null;
      case 3: return true;
      case 4: return selectedSize !== null;
      case 5: return true;
      case 6: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateDesign = async () => {
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const metalProps = {
        'gold': { material: 'Gold', color: 'Yellow', karat: '18k' },
        'silver': { material: 'Silver', color: 'Silver', karat: '925' },
        'platinum': { material: 'Platinum', color: 'White', karat: '950' },
        'rose-gold': { material: 'Gold', color: 'Rose', karat: '18k' }
      }[selectedMetal || 'gold'];

      const stoneProps = {
        'diamond': { gemstone_type: 'Diamond', gemstone_color: 'Clear' },
        'ruby': { gemstone_type: 'Ruby', gemstone_color: 'Red' },
        'emerald': { gemstone_type: 'Emerald', gemstone_color: 'Green' },
        'sapphire': { gemstone_type: 'Sapphire', gemstone_color: 'Blue' },
        'pearl': { gemstone_type: 'Pearl', gemstone_color: 'White' },
        'none': { gemstone_type: 'None', gemstone_color: 'None' },
      }[selectedStone || 'none'];

      const payload = {
        type: selectedType || 'ring',
        ...metalProps,
        ...stoneProps,
        shape: 'classic'
      };

      const token = localStorage.getItem('token'); // Assuming JWT token is stored here if user is logged in
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/ai/generate-design`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to generate pattern");
      const data = await res.json();
      // Ensure backend serves the image properly or provides a full URL
      const imageUrl = data.generated_image_url.startsWith('http')
        ? data.generated_image_url
        : `http://127.0.0.1:8000/${data.generated_image_url}`;
      setGeneratedImage(imageUrl);
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء التوليد. تأكد من تسجيل الدخول والمحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12" dir="rtl">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
            صمّم قطعتك الخاصة
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            أنشئ مجوهراتك الفريدة في 6 خطوات بسيطة
          </p>
        </div>

        <div className="mb-12 px-4 lg:px-16" dir="rtl">
          <Stepper
            steps={builderSteps}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step <= currentStep) setCurrentStep(step);
            }}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12" dir="rtl">
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-lg p-6 lg:p-8">
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">اختر نوع المجوهرات</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {jewelryTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedType === type.id
                            ? 'border-[#c9a962] ring-4 ring-[#c9a962]/20'
                            : 'border-gray-200 hover:border-[#c9a962]'
                          }`}
                      >
                        <Image
                          src={type.image}
                          alt={type.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute bottom-4 right-4 text-white font-semibold">
                          {type.name}
                        </span>
                        {selectedType === type.id && (
                          <div className="absolute top-4 left-4 w-8 h-8 bg-[#c9a962] rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">اختر المعدن</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {metals.map((metal) => (
                      <button
                        key={metal.id}
                        onClick={() => setSelectedMetal(metal.id)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedMetal === metal.id
                            ? 'border-[#c9a962] ring-4 ring-[#c9a962]/20'
                            : 'border-gray-200 hover:border-[#c9a962]'
                          }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                          <div
                            className="absolute inset-4 rounded-full"
                            style={{
                              background: metal.id === 'gold'
                                ? 'linear-gradient(135deg, #f7e8a0 0%, #c9a962 50%, #9a7b3c 100%)'
                                : metal.id === 'silver'
                                  ? 'linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 50%, #a8a8a8 100%)'
                                  : metal.id === 'platinum'
                                    ? 'linear-gradient(135deg, #e5e4e2 0%, #d1d0ce 50%, #b4b2b0 100%)'
                                    : 'linear-gradient(135deg, #f7d5c4 0%, #e8b4a0 50%, #d49a7a 100%)'
                            }}
                          />
                        </div>
                        <span className="absolute bottom-4 right-4 font-semibold">
                          {metal.nameAr}
                        </span>
                        {selectedMetal === metal.id && (
                          <div className="absolute top-4 left-4 w-8 h-8 bg-[#c9a962] rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">اختر الحجر الكريم</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {stones.map((stone) => (
                      <button
                        key={stone.id}
                        onClick={() => setSelectedStone(stone.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${selectedStone === stone.id
                            ? 'border-[#c9a962] bg-[#c9a962]/10'
                            : 'border-gray-200 hover:border-[#c9a962]'
                          }`}
                      >
                        <div
                          className="w-12 h-12 rounded-full mx-auto mb-2"
                          style={{
                            background: stone.id === 'diamond'
                              ? 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%)'
                              : stone.id === 'ruby'
                                ? 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 50%, #8b0000 100%)'
                                : stone.id === 'emerald'
                                  ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 50%, #1e8449 100%)'
                                  : stone.id === 'sapphire'
                                    ? 'linear-gradient(135deg, #5dade2 0%, #2e86de 50%, #1a5276 100%)'
                                    : stone.id === 'pearl'
                                      ? 'linear-gradient(135deg, #fefefe 0%, #f5f5dc 50%, #e8e8d0 100%)'
                                      : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 50%, #9e9e9e 100%)'
                          }}
                        />
                        <span className="font-medium">{stone.nameAr}</span>
                        {stone.id !== 'none' && (
                          <p className="text-xs text-gray-500 mt-1">+{formatPrice(stonePrices[stone.id])}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 4 && selectedType && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">اختر المقاس</h2>
                  <div className="flex flex-wrap gap-3">
                    {sizes[selectedType as keyof typeof sizes]?.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${selectedSize === size
                            ? 'border-[#c9a962] bg-[#c9a962] text-white'
                            : 'border-gray-200 hover:border-[#c9a962]'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    غير متأكد من مقاسك؟ <Link href="/contact?type=consultation" className="text-[#c9a962] hover:underline">احجز استشارة مجانية</Link>
                  </p>
                </div>
              )}

              {currentStep === 5 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">الإضافات</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">نقش شخصي</label>
                      <input
                        type="text"
                        value={engraving}
                        onChange={(e) => setEngraving(e.target.value)}
                        maxLength={20}
                        placeholder="أدخل النص المراد نقشه..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      />
                      <p className="text-xs text-gray-400 mt-1">الحد الأقصى 20 حرف (+150 ر.س)</p>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-[#c9a962] transition-colors">
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={(e) => setGiftWrap(e.target.checked)}
                        className="w-5 h-5 text-[#c9a962] border-gray-300 rounded focus:ring-[#c9a962]"
                      />
                      <div>
                        <span className="font-medium">تغليف هدية فاخر</span>
                        <p className="text-sm text-gray-500">تغليف خاص مع بطاقة إهداء (+50 ر.س)</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">ملخص التصميم</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-500">النوع</span>
                      <span className="font-medium">{jewelryTypes.find(t => t.id === selectedType)?.name}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-500">المعدن</span>
                      <span className="font-medium">{metals.find(m => m.id === selectedMetal)?.nameAr}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-500">الحجر</span>
                      <span className="font-medium">{stones.find(s => s.id === selectedStone)?.nameAr}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-500">المقاس</span>
                      <span className="font-medium">{selectedSize}</span>
                    </div>
                    {engraving && (
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-500">النقش</span>
                        <span className="font-medium">"{engraving}"</span>
                      </div>
                    )}
                    {giftWrap && (
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-500">تغليف هدية</span>
                        <span className="font-medium text-green-600">نعم</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3">
                      <span className="text-gray-500">السعر الإجمالي</span>
                      <span className="text-xl font-bold text-[#c9a962]">{formatPrice(calculatePrice())}</span>
                    </div>
                    <div className="bg-[#faf9f7] p-4 rounded-lg text-sm text-gray-600">
                      <p>⏱️ مدة التسليم المتوقعة: 7-14 يوم عمل</p>
                      <p className="mt-1">📦 شحن مجاني للطلبات فوق 1000 ر.س</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrev}
                    className="flex-1 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    السابق
                  </button>
                )}
                {currentStep < 6 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex-1 py-3 bg-[#c9a962] text-white rounded-lg font-medium hover:bg-[#b8944f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleGenerateDesign}
                      disabled={isGenerating}
                      className="flex-1 py-3 bg-[#c9a962] text-white rounded-lg font-medium hover:bg-[#b8944f] transition-colors disabled:opacity-75 disabled:cursor-wait"
                    >
                      {isGenerating ? 'جاري التوليد (قد يستغرق بعض الوقت)...' : '✨ توليد تصميم بالذكاء الاصطناعي'}
                    </button>
                    {generatedImage && (
                      <button className="flex-1 py-3 border-2 border-[#c9a962] text-[#c9a962] rounded-lg font-medium hover:bg-[#c9a962]/5 transition-colors">
                        أضف للسلة
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={getPreviewImage()}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 text-center border-t">
                  <p className="text-sm text-gray-500 mb-1">السعر التقديري</p>
                  <p className="text-2xl font-bold text-[#c9a962]">
                    {formatPrice(calculatePrice())}
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-[#c9a962]/10 rounded-lg p-4 text-center" dir="rtl">
                <p className="text-sm text-gray-700">
                  💡 هل تحتاج مساعدة؟{' '}
                  <Link href="/contact?type=consultation" className="text-[#c9a962] font-medium hover:underline">
                    احجز استشارة مجانية
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
