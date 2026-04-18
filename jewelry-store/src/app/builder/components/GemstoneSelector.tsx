'use client';

interface GemstoneSelectorProps {
  gemstoneType: string | null;
  gemstoneColor: string | null;
  gemstoneCut: string;
  gemstoneSize: number;
  onTypeChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onCutChange: (v: string) => void;
  onSizeChange: (v: number) => void;
}

const gemstoneTypes = [
  { id: 'Diamond', nameAr: 'ألماس', color: 'linear-gradient(135deg, #fff 0%, #f0f0f0 50%, #e0e0e0 100%)' },
  { id: 'Ruby', nameAr: 'ياقوت أحمر', color: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 50%, #8b0000 100%)' },
  { id: 'Emerald', nameAr: 'زمرد', color: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 50%, #1e8449 100%)' },
  { id: 'Sapphire', nameAr: 'ياقوت أزرق', color: 'linear-gradient(135deg, #5dade2 0%, #2e86de 50%, #1a5276 100%)' },
  { id: 'Pearl', nameAr: 'لؤلؤ', color: 'linear-gradient(135deg, #fefefe 0%, #f5f5dc 50%, #e8e8d0 100%)' },
  { id: 'None', nameAr: 'بدون حجر', color: 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 50%, #9e9e9e 100%)' },
];

const gemstoneColors: Record<string, { id: string; nameAr: string; swatch: string }[]> = {
  Diamond: [
    { id: 'Clear', nameAr: 'شفاف', swatch: '#f8f8f8' },
    { id: 'Champagne', nameAr: 'شمباني', swatch: '#f5e6c8' },
  ],
  Ruby: [
    { id: 'Red', nameAr: 'أحمر', swatch: '#c0392b' },
    { id: 'Pink', nameAr: 'وردي', swatch: '#e91e63' },
  ],
  Emerald: [
    { id: 'Green', nameAr: 'أخضر', swatch: '#27ae60' },
    { id: 'Deep Green', nameAr: 'أخضر غامق', swatch: '#1e8449' },
  ],
  Sapphire: [
    { id: 'Blue', nameAr: 'أزرق', swatch: '#2e86de' },
    { id: 'Royal Blue', nameAr: 'أزرق ملكي', swatch: '#1a5276' },
  ],
  Pearl: [
    { id: 'White', nameAr: 'أبيض', swatch: '#fafafa' },
    { id: 'Cream', nameAr: 'كريمي', swatch: '#f5f0e0' },
  ],
  None: [],
};

const gemstoneCuts = [
  { id: 'Round', nameAr: 'دائري' },
  { id: 'Princess', nameAr: 'أميرة' },
  { id: 'Oval', nameAr: 'بيضاوي' },
  { id: 'Cushion', nameAr: 'وسادة' },
  { id: 'Pear', nameAr: 'كمثرى' },
  { id: 'Marquise', nameAr: 'ماركيز' },
];

export default function GemstoneSelector({
  gemstoneType, gemstoneColor, gemstoneCut, gemstoneSize,
  onTypeChange, onColorChange, onCutChange, onSizeChange,
}: GemstoneSelectorProps) {
  const availableColors = gemstoneType ? (gemstoneColors[gemstoneType] || []) : [];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">نوع الحجر</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {gemstoneTypes.map((gt) => (
            <button
              key={gt.id}
              onClick={() => {
                onTypeChange(gt.id);
                if (gt.id === 'None') {
                  onColorChange('None');
                } else {
                  const colors = gemstoneColors[gt.id];
                  if (colors && colors.length > 0 && (!gemstoneColor || gemstoneColor === 'None')) {
                    onColorChange(colors[0].id);
                  }
                }
              }}
              className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                gemstoneType === gt.id ? 'border-[#c9a962] bg-[#c9a962]/10' : 'border-gray-200 hover:border-[#c9a962]/50'
              }`}
            >
              <div className="w-10 h-10 rounded-full mb-2 ring-2 ring-white shadow-md" style={{ background: gt.color }} />
              <span className="text-xs font-medium">{gt.nameAr}</span>
            </button>
          ))}
        </div>
      </div>

      {gemstoneType && gemstoneType !== 'None' && availableColors.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">لون الحجر</label>
          <div className="flex gap-3">
            {availableColors.map((c) => (
              <button
                key={c.id}
                onClick={() => onColorChange(c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  gemstoneColor === c.id ? 'border-[#c9a962] bg-[#c9a962]/10' : 'border-gray-200 hover:border-[#c9a962]/50'
                }`}
              >
                <div className="w-5 h-5 rounded-full ring-1 ring-gray-300" style={{ background: c.swatch }} />
                <span className="text-sm">{c.nameAr}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {gemstoneType && gemstoneType !== 'None' && (
        <>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">قطع الحجر</label>
            <div className="flex flex-wrap gap-2">
              {gemstoneCuts.map((cut) => (
                <button
                  key={cut.id}
                  onClick={() => onCutChange(cut.id)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    gemstoneCut === cut.id
                      ? 'border-[#c9a962] bg-[#c9a962] text-white'
                      : 'border-gray-200 hover:border-[#c9a962]'
                  }`}
                >
                  {cut.nameAr}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              حجم الحجر: <span className="text-[#c9a962]">{gemstoneSize} قيراط</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.25"
              value={gemstoneSize}
              onChange={(e) => onSizeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#c9a962]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0.5</span>
              <span>5.0</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
