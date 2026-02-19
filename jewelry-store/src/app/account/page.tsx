'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const tabs = [
  { id: 'orders', label: 'طلباتي' },
  { id: 'addresses', label: 'العناوين' },
  { id: 'favorites', label: 'المفضلة' },
  { id: 'profile', label: 'الملف الشخصي' },
];

const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 4500,
    items: [
      { name: 'خاتم الماس الأبدي', quantity: 1, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100' },
    ],
  },
  {
    id: 'ORD-002',
    date: '2024-01-20',
    status: 'shipped',
    total: 3200,
    items: [
      { name: 'قلادة اللؤلؤ المتدلي', quantity: 1, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100' },
    ],
  },
];

function AccountContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'orders');
  const [favorites] = useState(['1', '3', '9']);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'تم التسليم';
      case 'shipped': return 'تم الشحن';
      case 'processing': return 'قيد التجهيز';
      default: return status;
    }
  };

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8" dir="rtl">حسابي</h1>

        <div className="flex flex-col lg:flex-row gap-8" dir="rtl">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="w-12 h-12 bg-[#c9a962] rounded-full flex items-center justify-center text-white font-bold">
                  س
                </div>
                <div>
                  <p className="font-semibold">سارة أحمد</p>
                  <p className="text-sm text-gray-500">sara@email.com</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-right px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-[#c9a962] text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <button className="w-full text-right px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                  تسجيل الخروج
                </button>
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-6">طلباتي</h2>
                
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-right">
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded overflow-hidden">
                              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="font-bold text-[#c9a962]">{formatPrice(order.total)}</span>
                        <Link href={`/account/orders/${order.id}`} className="text-sm text-[#c9a962] hover:underline">
                          عرض التفاصيل
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">العناوين</h2>
                  <button className="text-[#c9a962] text-sm hover:underline">+ إضافة عنوان</button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 relative">
                    <span className="absolute top-2 left-2 text-xs bg-[#c9a962] text-white px-2 py-1 rounded">الافتراضي</span>
                    <h3 className="font-medium mb-2">المنزل</h3>
                    <p className="text-sm text-gray-600">
                      سارة أحمد<br />
                      حي النخيل، شارع الأمير سلطان<br />
                      الرياض، 12345<br />
                      السعودية<br />
                      0501234567
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button className="text-sm text-[#c9a962] hover:underline">تعديل</button>
                      <button className="text-sm text-red-500 hover:underline">حذف</button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 border-dashed flex items-center justify-center min-h-[200px] cursor-pointer hover:border-[#c9a962] transition-colors">
                    <div className="text-center">
                      <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-gray-500">إضافة عنوان جديد</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-6">المفضلة</h2>
                
                {favoriteProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-gray-500">لا توجد منتجات مفضلة</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-6">الملف الشخصي</h2>
                
                <form className="space-y-6 max-w-md">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">الاسم الأول</label>
                      <input
                        type="text"
                        defaultValue="سارة"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">الاسم الأخير</label>
                      <input
                        type="text"
                        defaultValue="أحمد"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      defaultValue="sara@email.com"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                    <input
                      type="tel"
                      defaultValue="0501234567"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">تاريخ الميلاد</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#c9a962] text-white rounded-lg hover:bg-[#b8944f] transition-colors"
                  >
                    حفظ التغييرات
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-medium mb-4">تغيير كلمة المرور</h3>
                  <form className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium mb-1">كلمة المرور الحالية</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">تأكيد كلمة المرور</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2 border border-[#c9a962] text-[#c9a962] rounded-lg hover:bg-[#c9a962]/10 transition-colors"
                    >
                      تغيير كلمة المرور
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <AccountContent />
  );
}
