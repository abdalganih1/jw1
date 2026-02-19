'use client';

import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div 
        className="relative bg-white rounded-lg max-w-md w-full p-6 text-right animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EngravingModal({ 
  isOpen, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (text: string) => void;
}) {
  const [text, setText] = useState('');
  const [font, setFont] = useState('default');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة نقش">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">النص</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={20}
            placeholder="أدخل النص المراد نقشه..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
          />
          <p className="text-xs text-gray-400 mt-1">الحد الأقصى 20 حرف</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">الخط</label>
          <div className="grid grid-cols-3 gap-2">
            {['default', 'script', 'bold'].map((f) => (
              <button
                key={f}
                onClick={() => setFont(f)}
                className={`py-2 px-3 border rounded-lg text-sm transition-colors ${
                  font === f ? 'border-[#c9a962] bg-[#c9a962]/10' : 'border-gray-200'
                }`}
              >
                {f === 'default' ? 'عادي' : f === 'script' ? 'خط يد' : 'عريض'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-400 mb-1">معاينة</p>
          <p className={`text-lg ${font === 'script' ? 'italic' : font === 'bold' ? 'font-bold' : ''}`}>
            {text || 'نص النقش'}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={() => {
              onSave(text);
              onClose();
            }}
            disabled={!text}
            className="flex-1 py-2 bg-[#c9a962] text-white rounded-lg hover:bg-[#b8944f] transition-colors disabled:opacity-50"
          >
            حفظ
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          تكلفة النقش: 150 ر.س
        </p>
      </div>
    </Modal>
  );
}
