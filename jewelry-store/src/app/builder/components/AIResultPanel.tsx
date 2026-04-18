'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AIResultPanelProps {
  imageUrl: string;
  designId: number;
  selectedOptions: Record<string, string | number | boolean | null | undefined>;
  onRegenerate: () => void;
  isRegenerating: boolean;
  onSendToJeweler: (designId: number) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function AIResultPanel({
  imageUrl, designId, selectedOptions, onRegenerate, isRegenerating, onSendToJeweler,
}: AIResultPanelProps) {
  const [saved, setSaved] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `jewelry-design-${designId}.jpg`;
    link.target = '_blank';
    link.click();
  };

  const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${API_URL.replace('/api', '')}${imageUrl}`;

  return (
    <div className="space-y-4" dir="rtl">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-lg">
        <Image
          src={fullUrl}
          alt="AI Generated Design"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
        <div className="absolute top-3 left-3 bg-[#c9a962] text-white text-xs px-3 py-1 rounded-full font-medium">
          AI Design #{designId}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="flex-1 min-w-[140px] py-3 bg-[#c9a962] text-white rounded-lg font-medium hover:bg-[#b8944f] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isRegenerating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              جاري إعادة التوليد...
            </>
          ) : (
            <> إعادة التوليد</>
          )}
        </button>

        <button
          onClick={handleDownload}
          className="flex-1 min-w-[140px] py-3 border-2 border-[#c9a962] text-[#c9a962] rounded-lg font-medium hover:bg-[#c9a962]/5 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          تحميل الصورة
        </button>

        <button
          onClick={() => onSendToJeweler(designId)}
          className="flex-1 min-w-[140px] py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          إرسال لصائغ
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-semibold text-gray-800 mb-2">ملخص التصميم</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(selectedOptions).map(([key, val]) => (
            val && val !== 'None' && val !== 'none' && (
              <div key={key} className="flex justify-between">
                <span className="text-gray-500">{key === 'type' ? 'النوع' : key === 'material' ? 'المادة' : key === 'color' ? 'اللون' : key === 'karat' ? 'العيار' : key === 'weight' ? 'الوزن' : key === 'gemstone_type' ? 'الحجر' : key === 'gemstone_color' ? 'لون الحجر' : key === 'gemstone_cut' ? 'القطع' : key === 'gemstone_size' ? 'الحجم' : key === 'shape' ? 'الشكل' : key}</span>
                <span className="font-medium">{String(val)}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
