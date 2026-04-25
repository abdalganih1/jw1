'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const tabs = [
  { id: 'orders', label: 'طلباتي' },
  { id: 'designs', label: '✨ تصميماتي' },
  { id: 'addresses', label: 'العناوين' },
  { id: 'favorites', label: 'المفضلة' },
  { id: 'profile', label: 'الملف الشخصي' },
];

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'orders');
  const [favorites] = useState(['1', '3', '9']);
  const { user, token, isAuthenticated, isLoading, logout } = useAuth();
  const [designs, setDesigns] = useState<Array<{
    id: number;
    selected_options: Record<string, unknown>;
    generated_image_url: string;
    created_at: string;
    is_favorite: boolean;
  }>>([]);
  const [designsLoading, setDesignsLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [addresses, setAddresses] = useState<Array<{ id: string; label: string; name: string; street: string; city: string; country: string; phone: string; isDefault: boolean }>>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: '', name: '', street: '', city: '', country: 'سوريا', phone: '' });

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const saved = localStorage.getItem('addresses');
    if (saved) setAddresses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated && token) {
      setOrdersLoading(true);
      fetch(`${API_URL}/orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.ok ? r.json() : [])
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, isAuthenticated, token]);

  useEffect(() => {
    if (activeTab === 'designs' && isAuthenticated && token) {
      setDesignsLoading(true);
      fetch(`${API_URL}/ai/my-designs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.ok ? res.json() : { designs: [] })
        .then(data => setDesigns(data.designs || []))
        .catch(() => setDesigns([]))
        .finally(() => setDesignsLoading(false));
    }
  }, [activeTab, isAuthenticated, token]);

  const saveAddresses = (addrs: typeof addresses) => {
    setAddresses(addrs);
    localStorage.setItem('addresses', JSON.stringify(addrs));
  };

  const handleAddAddress = () => {
    if (!addressForm.name || !addressForm.street || !addressForm.city) return;
    const newAddr = { ...addressForm, id: Date.now().toString(), isDefault: addresses.length === 0 };
    saveAddresses([...addresses, newAddr]);
    setAddressForm({ label: '', name: '', street: '', city: '', country: 'سوريا', phone: '' });
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id: string) => {
    saveAddresses(addresses.filter(a => a.id !== id));
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" /></div>;
  if (!isAuthenticated) return null;

  const handleDeleteDesign = async (id: number) => {
    if (!token) return;
    try {
      await fetch(`${API_URL}/ai/designs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setDesigns(prev => prev.filter(d => d.id !== id));
    } catch {}
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
                  {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-semibold">{user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
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
                <button onClick={() => { logout(); router.push('/'); }} className="w-full text-right px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                  تسجيل الخروج
                </button>
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-6">طلباتي</h2>

                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-gray-500">لا توجد طلبات بعد</p>
                  </div>
                ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-right">
                          <p className="font-medium">#{order.id}</p>
                          <p className="text-sm text-gray-500">{order.order_date ? new Date(order.order_date).toLocaleDateString('ar-SA') : ''}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor((order.status || 'PENDING').toLowerCase())}`}>
                          {getStatusText((order.status || 'PENDING').toLowerCase())}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="font-bold text-[#c9a962]">{formatPrice(order.total_amount || 0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}

            {activeTab === 'designs' && (
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">تصميماتي</h2>
                  <Link href="/builder" className="text-sm text-[#c9a962] hover:underline font-medium">+ تصميم جديد</Link>
                </div>

                {designsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : designs.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <p className="text-gray-500 mb-4">لا توجد تصميمات بعد</p>
                    <Link href="/builder" className="text-[#c9a962] font-medium hover:underline">ابدأ بتصميم قطعتك الأولى</Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {designs.map((design) => {
                      const imgFull = design.generated_image_url.startsWith('http')
                        ? design.generated_image_url
                        : `${API_URL.replace('/api', '')}${design.generated_image_url}`;
                      return (
                        <div key={design.id} className="border rounded-xl overflow-hidden group hover:shadow-lg transition-shadow">
                          <div className="relative aspect-square">
                            <Image src={imgFull} alt="Design" fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" unoptimized />
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-gray-400 mb-2">{new Date(design.created_at).toLocaleDateString('ar-SA')}</p>
                            <div className="flex gap-2">
                              <Link href="/builder" className="text-xs text-[#c9a962] hover:underline">إعادة تصميم</Link>
                              <button onClick={() => handleDeleteDesign(design.id)} className="text-xs text-red-500 hover:underline">حذف</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">العناوين</h2>
                  <button onClick={() => setShowAddressForm(true)} className="text-[#c9a962] text-sm hover:underline">+ إضافة عنوان</button>
                </div>

                {showAddressForm && (
                  <div className="border rounded-lg p-4 mb-4 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input placeholder="تسمية العنوان (مثال: المنزل)" value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})} className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" />
                      <input placeholder="الاسم الكامل" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" />
                    </div>
                    <input placeholder="الشارع" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input placeholder="المدينة" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" />
                      <input placeholder="رقم الهاتف" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" dir="ltr" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAddAddress} className="px-4 py-2 bg-[#c9a962] text-white rounded-lg text-sm hover:bg-[#b8944f]">حفظ</button>
                      <button onClick={() => setShowAddressForm(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-500 hover:bg-gray-50">إلغاء</button>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border rounded-lg p-4 relative">
                      {addr.isDefault && <span className="absolute top-2 left-2 text-xs bg-[#c9a962] text-white px-2 py-1 rounded">الافتراضي</span>}
                      <h3 className="font-medium mb-2">{addr.label || 'عنوان'}</h3>
                      <p className="text-sm text-gray-600">
                        {addr.name}<br />
                        {addr.street}<br />
                        {addr.city}<br />
                        {addr.country}
                        {addr.phone && <><br />{addr.phone}</>}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <button className="text-sm text-[#c9a962] hover:underline">تعديل</button>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-sm text-red-500 hover:underline">حذف</button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border rounded-lg p-4 border-dashed flex items-center justify-center min-h-[200px] cursor-pointer hover:border-[#c9a962] transition-colors" onClick={() => setShowAddressForm(true)}>
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
                        defaultValue={user?.first_name || ''}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">الاسم الأخير</label>
                      <input
                        type="text"
                        defaultValue={user?.last_name || ''}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                        defaultValue={user?.email || ''}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a962]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                    <input
                      type="tel"
                        defaultValue={user?.phone || ''}
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" /></div>}>
      <AccountContent />
    </Suspense>
  );
}
