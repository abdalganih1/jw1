'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from './components/AuthGuard';
import StepSelector from './components/StepSelector';
import GemstoneSelector from './components/GemstoneSelector';
import AIResultPanel from './components/AIResultPanel';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const builderSteps = [
  { id: 1, title: 'Type', titleAr: 'النوع', icon: '💍' },
  { id: 2, title: 'Metal & Karat', titleAr: 'المعدن والعيار', icon: '🥇' },
  { id: 3, title: 'Color', titleAr: 'اللون', icon: '🎨' },
  { id: 4, title: 'Gemstone', titleAr: 'الحجر الكريم', icon: '💎' },
  { id: 5, title: 'Shape', titleAr: 'الشكل', icon: '✨' },
  { id: 6, title: 'Weight & Notes', titleAr: 'الوزن والملاحظات', icon: '⚖️' },
  { id: 7, title: 'Preview & Generate', titleAr: 'المعاينة والتوليد', icon: '🖼️' },
];

const jewelryTypes = [
  { id: 'ring', nameAr: 'خاتم', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400' },
  { id: 'necklace', nameAr: 'قلادة', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400' },
  { id: 'bracelet', nameAr: 'سوار', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400' },
  { id: 'earrings', nameAr: 'أقراط', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400' },
];

const metalOptions = [
  { id: 'Gold', nameAr: 'ذهب', karats: ['18k', '21k', '24k'], gradient: 'linear-gradient(135deg, #f7e8a0 0%, #c9a962 50%, #9a7b3c 100%)' },
  { id: 'Silver', nameAr: 'فضة', karats: ['925'], gradient: 'linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 50%, #a8a8a8 100%)' },
  { id: 'Platinum', nameAr: 'بلاتين', karats: ['950'], gradient: 'linear-gradient(135deg, #e5e4e2 0%, #d1d0ce 50%, #b4b2b0 100%)' },
];

const colorOptions = [
  { id: 'Yellow', nameAr: 'أصفر', swatch: 'linear-gradient(135deg, #f7e8a0, #c9a962, #9a7b3c)' },
  { id: 'White', nameAr: 'أبيض', swatch: 'linear-gradient(135deg, #ffffff, #e0e0e0, #c0c0c0)' },
  { id: 'Rose', nameAr: 'وردي', swatch: 'linear-gradient(135deg, #f7d5c4, #e8b4a0, #d49a7a)' },
];

const shapeOptions = [
  { id: 'classic', nameAr: 'كلاسيكي', desc: 'تصميم تقليدي أنيق', icon: '♛' },
  { id: 'modern', nameAr: 'عصري', desc: 'خطوط حديثة وجريئة', icon: '◆' },
  { id: 'vintage', nameAr: 'عتيق', desc: 'فخامة القديم بلمسة عصرية', icon: '❋' },
  { id: 'minimalist', nameAr: 'بسيط', desc: 'بساطة راقية وجذابة', icon: '○' },
  { id: 'bohemian', nameAr: 'بوهيمي', desc: 'روح فنية حرة', icon: '✿' },
];

function LoadingAnimation({ progress, message }: { progress: number; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6" dir="rtl">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div
          className="absolute inset-0 rounded-full border-4 border-[#c9a962] border-t-transparent animate-spin"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800 mb-2">الذكاء الاصطناعي يبدع تصميمك...</p>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#c9a962] to-[#e0c68a] rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function BuilderPage() {
  const { isAuthenticated, isLoading: authLoading, token } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
  const [selectedKarat, setSelectedKarat] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [gemstoneType, setGemstoneType] = useState<string | null>(null);
  const [gemstoneColor, setGemstoneColor] = useState<string | null>(null);
  const [gemstoneCut, setGemstoneCut] = useState('Round');
  const [gemstoneSize, setGemstoneSize] = useState(1.0);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [weight, setWeight] = useState<number>(5);
  const [styleNotes, setStyleNotes] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedDesignId, setGeneratedDesignId] = useState<number | null>(null);
  const [generatedOptions, setGeneratedOptions] = useState<Record<string, string | number | boolean | null | undefined>>({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AuthGuard />
        </div>
      </div>
    );
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedType !== null;
      case 2: return selectedMetal !== null && selectedKarat !== null;
      case 3: return selectedColor !== null;
      case 4: return true;
      case 5: return selectedShape !== null;
      case 6: return true;
      case 7: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 7) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getPreviewImage = () => {
    if (generatedImageUrl) {
      return generatedImageUrl.startsWith('http') ? generatedImageUrl : `${API_URL.replace('/api', '')}${generatedImageUrl}`;
    }
    return jewelryTypes.find(t => t.id === selectedType)?.image || jewelryTypes[0].image;
  };

  const buildPayload = () => ({
    type: selectedType || 'ring',
    material: selectedMetal || 'Gold',
    color: selectedColor || 'Yellow',
    karat: selectedKarat || '18k',
    weight,
    shape: selectedShape || 'classic',
    gemstone_type: gemstoneType || 'None',
    gemstone_color: gemstoneColor || 'None',
    gemstone_cut: gemstoneCut,
    gemstone_size: gemstoneSize,
    style_notes: styleNotes || undefined,
  });

  const simulateProgress = () => {
    const messages = [
      'جاري تحليل خيارات التصميم...',
      'يتم رسم النموذج الأولي...',
      'إضافة التفاصيل الدقيقة...',
      'تطبيق الإضاءة والظلال...',
      'اللمسات الأخيرة...',
    ];
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const p = Math.min(step * 15, 90);
      setLoadingProgress(p);
      setLoadingMessage(messages[Math.min(step - 1, messages.length - 1)]);
      if (step >= 7) clearInterval(interval);
    }, 3000);
    return interval;
  };

  const handleGenerateDesign = async () => {
    setIsGenerating(true);
    setGeneratedImageUrl(null);
    setError(null);
    setLoadingProgress(0);
    const interval = simulateProgress();

    try {
      const payload = buildPayload();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const res = await fetch(`${API_URL}/ai/generate-design`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      clearInterval(interval);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to generate design');
      }

      const data = await res.json();
      const imageUrl = data.generated_image_url.startsWith('http')
        ? data.generated_image_url
        : `${API_URL.replace('/api', '')}${data.generated_image_url}`;

      setLoadingProgress(100);
      setLoadingMessage('تم الانتهاء من التصميم!');
      setTimeout(() => {
        setGeneratedImageUrl(imageUrl);
        setGeneratedDesignId(data.id);
        setGeneratedOptions(data.selected_options || payload);
      }, 500);
    } catch (e: unknown) {
      clearInterval(interval);
      setError(e instanceof Error ? e.message : 'حدث خطأ أثناء التوليد');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!generatedDesignId) return handleGenerateDesign();

    setIsGenerating(true);
    setError(null);
    setLoadingProgress(0);
    const interval = simulateProgress();

    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };
      const res = await fetch(`${API_URL}/ai/designs/${generatedDesignId}/regenerate`, {
        method: 'POST',
        headers,
      });
      clearInterval(interval);
      if (!res.ok) throw new Error('Failed to regenerate');
      const data = await res.json();
      const imageUrl = data.generated_image_url.startsWith('http')
        ? data.generated_image_url
        : `${API_URL.replace('/api', '')}${data.generated_image_url}`;
      setLoadingProgress(100);
      setTimeout(() => {
        setGeneratedImageUrl(imageUrl);
        setGeneratedDesignId(data.id);
        setGeneratedOptions(data.selected_options || generatedOptions);
      }, 500);
    } catch {
      clearInterval(interval);
      handleGenerateDesign();
    } finally {
      setIsGenerating(false);
    }
  };

  const typeLabel = jewelryTypes.find(t => t.id === selectedType)?.nameAr || '';
  const metalLabel = metalOptions.find(m => m.id === selectedMetal)?.nameAr || '';
  const colorLabel = colorOptions.find(c => c.id === selectedColor)?.nameAr || '';

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10" dir="rtl">
          <div className="inline-flex items-center gap-2 bg-[#c9a962]/10 text-[#c9a962] px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            مدعوم بالذكاء الاصطناعي
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-3">
            استوديو تصميم المجوهرات
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            صمّم قطعتك الفريدة في 7 خطوات بسيطة ودع الذكاء الاصطناعي يحوّل رؤيتك إلى واقع
          </p>
        </div>

        <div className="mb-10 px-2 lg:px-12">
          <StepSelector
            steps={builderSteps}
            currentStep={currentStep}
            onStepClick={(step) => setCurrentStep(step)}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-10" dir="rtl">
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
              {/* Step 1: Type */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">اختر نوع المجوهرات</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {jewelryTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          selectedType === type.id
                            ? 'border-[#c9a962] ring-4 ring-[#c9a962]/20 shadow-lg'
                            : 'border-gray-200 hover:border-[#c9a962]/50 hover:shadow-md'
                        }`}
                      >
                        <Image src={type.image} alt={type.nameAr} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className="absolute bottom-4 right-4 text-white font-semibold text-lg">{type.nameAr}</span>
                        {selectedType === type.id && (
                          <div className="absolute top-3 left-3 w-8 h-8 bg-[#c9a962] rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Metal & Karat */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-6">اختر المعدن والعيار</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {metalOptions.map((metal) => (
                      <button
                        key={metal.id}
                        onClick={() => {
                          setSelectedMetal(metal.id);
                          if (!selectedKarat || !metal.karats.includes(selectedKarat)) {
                            setSelectedKarat(metal.karats[0]);
                          }
                        }}
                        className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                          selectedMetal === metal.id
                            ? 'border-[#c9a962] ring-4 ring-[#c9a962]/20 shadow-lg'
                            : 'border-gray-200 hover:border-[#c9a962]/50'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-full mx-auto mb-3 ring-2 ring-white shadow-md" style={{ background: metal.gradient }} />
                        <p className="font-semibold text-center">{metal.nameAr}</p>
                        <p className="text-xs text-gray-500 text-center mt-1">{metal.karats.join(' / ')}</p>
                        {selectedMetal === metal.id && (
                          <div className="absolute top-2 left-2 w-6 h-6 bg-[#c9a962] rounded-full flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {selectedMetal && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">العيار</label>
                      <div className="flex gap-3">
                        {metalOptions.find(m => m.id === selectedMetal)?.karats.map((k) => (
                          <button
                            key={k}
                            onClick={() => setSelectedKarat(k)}
                            className={`px-6 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                              selectedKarat === k
                                ? 'border-[#c9a962] bg-[#c9a962] text-white shadow-md'
                                : 'border-gray-200 hover:border-[#c9a962]'
                            }`}
                          >
                            {k}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Color */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">اختر لون المعدن</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {colorOptions.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`relative p-8 rounded-xl border-2 transition-all duration-300 ${
                          selectedColor === color.id
                            ? 'border-[#c9a962] ring-4 ring-[#c9a962]/20 shadow-lg'
                            : 'border-gray-200 hover:border-[#c9a962]/50'
                        }`}
                      >
                        <div className="w-20 h-20 rounded-full mx-auto mb-4 ring-4 ring-white shadow-xl" style={{ background: color.swatch }} />
                        <p className="font-semibold text-center">{color.nameAr}</p>
                        {selectedColor === color.id && (
                          <div className="absolute top-3 left-3 w-7 h-7 bg-[#c9a962] rounded-full flex items-center justify-center shadow">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Gemstone */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">اختر الحجر الكريم</h2>
                  <GemstoneSelector
                    gemstoneType={gemstoneType}
                    gemstoneColor={gemstoneColor}
                    gemstoneCut={gemstoneCut}
                    gemstoneSize={gemstoneSize}
                    onTypeChange={setGemstoneType}
                    onColorChange={setGemstoneColor}
                    onCutChange={setGemstoneCut}
                    onSizeChange={setGemstoneSize}
                  />
                </div>
              )}

              {/* Step 5: Shape */}
              {currentStep === 5 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">اختر شكل التصميم</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {shapeOptions.map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => setSelectedShape(shape.id)}
                        className={`p-5 rounded-xl border-2 transition-all duration-300 text-center ${
                          selectedShape === shape.id
                            ? 'border-[#c9a962] bg-[#c9a962]/10 shadow-lg'
                            : 'border-gray-200 hover:border-[#c9a962]/50'
                        }`}
                      >
                        <span className="text-3xl block mb-2">{shape.icon}</span>
                        <p className="font-semibold">{shape.nameAr}</p>
                        <p className="text-xs text-gray-500 mt-1">{shape.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Weight & Notes */}
              {currentStep === 6 && (
                <div className="space-y-8">
                  <h2 className="text-xl font-semibold mb-6">الوزن والملاحظات</h2>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      الوزن التقريبي: <span className="text-[#c9a962] text-lg">{weight} غرام</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="0.5"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#c9a962]"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1 غرام</span>
                      <span>50 غرام</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ملاحظات إضافية (اختياري)</label>
                    <textarea
                      value={styleNotes}
                      onChange={(e) => setStyleNotes(e.target.value)}
                      maxLength={200}
                      rows={3}
                      placeholder="أضف أي تفاصيل أو ملاحظات تريد إضافتها للتصميم..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962] resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-left">{styleNotes.length}/200</p>
                  </div>
                </div>
              )}

              {/* Step 7: Preview & Generate */}
              {currentStep === 7 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">ملخص التصميم</h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { label: 'النوع', value: typeLabel },
                      { label: 'المعدن', value: `${metalLabel} - ${selectedKarat}` },
                      { label: 'اللون', value: colorLabel },
                      { label: 'الحجر', value: gemstoneType && gemstoneType !== 'None' ? `${gemstoneType} - ${gemstoneColor} - ${gemstoneCut}` : 'بدون حجر' },
                      { label: 'الشكل', value: shapeOptions.find(s => s.id === selectedShape)?.nameAr },
                      { label: 'الوزن', value: `${weight} غرام` },
                      ...(styleNotes ? [{ label: 'ملاحظات', value: styleNotes }] : []),
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">{row.label}</span>
                        <span className="font-medium">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  {isGenerating ? (
                    <LoadingAnimation progress={loadingProgress} message={loadingMessage} />
                  ) : generatedImageUrl && generatedDesignId ? (
                    <AIResultPanel
                      imageUrl={generatedImageUrl}
                      designId={generatedDesignId}
                      selectedOptions={generatedOptions}
                      onRegenerate={handleRegenerate}
                      isRegenerating={isGenerating}
                      onSendToJeweler={(id) => {
                        alert(`سيتم إرسال التصميم #${id} للصائغ قريباً!`);
                      }}
                    />
                  ) : (
                    <button
                      onClick={handleGenerateDesign}
                      className="w-full py-4 bg-gradient-to-l from-[#c9a962] to-[#e0c68a] text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-[#c9a962]/30 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                      توليد تصميم بالذكاء الاصطناعي
                    </button>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              {!(currentStep === 7 && (isGenerating || generatedImageUrl)) && (
                <div className="flex gap-4 mt-8">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrev}
                      className="flex-1 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      السابق
                    </button>
                  )}
                  {currentStep < 7 && (
                    <button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="flex-1 py-3 bg-[#c9a962] text-white rounded-lg font-medium hover:bg-[#b8944f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview Panel */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-28">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="relative aspect-square">
                  <Image
                    src={getPreviewImage()}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    {...(generatedImageUrl ? { unoptimized: true } : {})}
                  />
                  {!generatedImageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <p className="text-white/80 text-sm bg-black/30 px-4 py-2 rounded-full">
                        اختر خياراتك ثم ولّد التصميم
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex flex-wrap gap-2 text-xs" dir="rtl">
                    {selectedType && <span className="bg-[#c9a962]/10 text-[#c9a962] px-3 py-1 rounded-full">{typeLabel}</span>}
                    {selectedMetal && <span className="bg-[#c9a962]/10 text-[#c9a962] px-3 py-1 rounded-full">{metalLabel} {selectedKarat}</span>}
                    {selectedColor && <span className="bg-[#c9a962]/10 text-[#c9a962] px-3 py-1 rounded-full">{colorLabel}</span>}
                    {gemstoneType && gemstoneType !== 'None' && <span className="bg-[#c9a962]/10 text-[#c9a962] px-3 py-1 rounded-full">{gemstoneType}</span>}
                    {selectedShape && <span className="bg-[#c9a962]/10 text-[#c9a962] px-3 py-1 rounded-full">{shapeOptions.find(s => s.id === selectedShape)?.nameAr}</span>}
                  </div>
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
