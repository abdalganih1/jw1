'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

/* ───────────── Types ───────────── */
interface Stats {
  total_users: number;
  total_orders: number;
  total_designs: number;
  total_revenue: number;
  pending_orders: number;
  recent_orders: Array<{ id: number; user_id: number; status: string; total_amount: number; order_date: string }>;
}

interface DetailedOrder {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  shipping_address: string | null;
  order_date: string;
  user: { id: number; username: string; email: string; first_name: string | null; last_name: string | null; phone: string | null } | null;
  payment_method: { id: number; method_name: string } | null;
  items: Array<{ id: number; product_id: number; quantity: number; unit_price: number; subtotal: number; product: { id: number; name: string; price: number; image_path: string | null } | null }>;
}

interface ProductItem {
  id: number;
  name: string;
  material: string | null;
  karat: string | null;
  weight: number | null;
  price: number;
  stock_quantity: number;
  description: string | null;
  image_path: string | null;
  jeweler_id: number;
  categories: Array<{ id: number; name: string }>;
  images: Array<{ id: number; image_path: string }>;
}

interface JewelerItem {
  id: number;
  name: string;
  shop_name: string;
  bio: string | null;
  address: string | null;
  phone: string | null;
  email: string;
  rating: number;
  created_at: string;
}

interface DesignItem {
  id: number;
  user_id: number;
  username: string | null;
  generated_image_url: string;
  selected_options: Record<string, unknown>;
  prompt_used: string | null;
  model_used: string | null;
  is_favorite: boolean;
  created_at: string;
}

interface CategoryItem { id: number; name: string; }

/* ───────────── Constants ───────────── */
const tabs = [
  { id: 'stats', label: 'الإحصائيات', icon: '📊' },
  { id: 'orders', label: 'الطلبيات', icon: '📦' },
  { id: 'products', label: 'المنتجات', icon: '🛍️' },
  { id: 'jewelers', label: 'الصائغين', icon: '🔨' },
  { id: 'designs', label: 'التصاميم', icon: '✨' },
  { id: 'users', label: 'المستخدمين', icon: '👥' },
];

const statusLabels: Record<string, string> = {
  PENDING: 'معلق', PROCESSING: 'قيد المعالجة', SHIPPED: 'تم الشحن', DELIVERED: 'تم التسليم', CANCELLED: 'ملغي',
};
const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700', PROCESSING: 'bg-blue-100 text-blue-700', SHIPPED: 'bg-purple-100 text-purple-700', DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
};

const emptyProduct = { name: '', material: 'Gold', karat: '18K', weight: 0, price: 0, stock_quantity: 1, description: '', image_path: '', jeweler_id: 0, category_ids: [] as number[] };

export default function AdminPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);

  // Data states
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<DetailedOrder[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [jewelers, setJewelers] = useState<JewelerItem[]>([]);
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [users, setUsers] = useState<Array<{ id: number; username: string; email: string; role: string; created_at: string }>>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  // UI states
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [showJewelerForm, setShowJewelerForm] = useState(false);
  const [jewelerForm, setJewelerForm] = useState({ name: '', shop_name: '', email: '', phone: '', bio: '', address: '' });
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) router.push('/login');
  }, [isLoading, isAuthenticated, user, router]);

  const headers = useCallback(() => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }), [token]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const fetchData = useCallback(async (tab: string) => {
    if (!token) return;
    setLoading(true);
    try {
      const h = { Authorization: `Bearer ${token}` };
      if (tab === 'stats') {
        const r = await fetch(`${API_URL}/admin/dashboard-stats`, { headers: h }); if (r.ok) setStats(await r.json());
      } else if (tab === 'orders') {
        const r = await fetch(`${API_URL}/admin/orders-detailed`, { headers: h }); if (r.ok) setOrders(await r.json());
      } else if (tab === 'products') {
        const [pRes, cRes, jRes] = await Promise.all([
          fetch(`${API_URL}/admin/products`, { headers: h }),
          fetch(`${API_URL}/products/categories/`, { headers: h }),
          fetch(`${API_URL}/admin/jewelers`, { headers: h }),
        ]);
        if (pRes.ok) setProducts(await pRes.json());
        if (cRes.ok) setCategories(await cRes.json());
        if (jRes.ok) setJewelers(await jRes.json());
      } else if (tab === 'jewelers') {
        const r = await fetch(`${API_URL}/admin/jewelers`, { headers: h }); if (r.ok) setJewelers(await r.json());
      } else if (tab === 'designs') {
        const r = await fetch(`${API_URL}/admin/designs`, { headers: h }); if (r.ok) setDesigns(await r.json());
      } else if (tab === 'users') {
        const r = await fetch(`${API_URL}/admin/users`, { headers: h }); if (r.ok) setUsers(await r.json());
      }
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN' || !token) return;
    fetchData(activeTab);
  }, [activeTab, isAuthenticated, user, token, fetchData]);

  /* ── Product CRUD ── */
  const handleSaveProduct = async () => {
    const url = editingProduct ? `${API_URL}/admin/products/${editingProduct.id}` : `${API_URL}/admin/products`;
    const method = editingProduct ? 'PUT' : 'POST';
    const body = editingProduct
      ? { ...productForm }
      : { ...productForm, jeweler_id: productForm.jeweler_id || jewelers[0]?.id || 1 };
    try {
      const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(body) });
      if (res.ok) {
        showSuccess(editingProduct ? 'تم تعديل المنتج ✅' : 'تم إضافة المنتج ✅');
        setShowProductForm(false); setEditingProduct(null); setProductForm(emptyProduct);
        fetchData('products');
      } else {
        const e = await res.json(); alert(e.detail || 'خطأ');
      }
    } catch { alert('خطأ بالاتصال'); }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, { method: 'DELETE', headers: headers() });
      if (res.ok) { showSuccess('تم حذف المنتج ✅'); fetchData('products'); }
    } catch {}
  };

  const handleEditProduct = (p: ProductItem) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name, material: p.material || '', karat: p.karat || '', weight: p.weight || 0,
      price: p.price, stock_quantity: p.stock_quantity, description: p.description || '',
      image_path: p.image_path || '', jeweler_id: p.jeweler_id, category_ids: p.categories.map(c => c.id),
    });
    setShowProductForm(true);
  };

  const handleImageUpload = async (productId: number, file: File) => {
    setUploadingImage(productId);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await fetch(`${API_URL}/products/${productId}/upload-image`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
      });
      showSuccess('تم رفع الصورة ✅');
      fetchData('products');
    } catch {} finally { setUploadingImage(null); }
  };

  /* ── Jeweler CRUD ── */
  const handleSaveJeweler = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/jewelers`, { method: 'POST', headers: headers(), body: JSON.stringify(jewelerForm) });
      if (res.ok) {
        showSuccess('تم إضافة الصائغ ✅');
        setShowJewelerForm(false); setJewelerForm({ name: '', shop_name: '', email: '', phone: '', bio: '', address: '' });
        fetchData('jewelers');
      } else {
        const e = await res.json(); alert(e.detail || 'خطأ');
      }
    } catch { alert('خطأ بالاتصال'); }
  };

  /* ── Order Status ── */
  const handleOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT', headers: headers(), body: JSON.stringify({ new_status: newStatus }),
      });
      fetchData('orders');
    } catch {}
  };

  /* ── Rendering ── */
  if (isLoading) return <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" /></div>;
  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  const getImg = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL.replace('/api', '')}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]" dir="rtl">
      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-pulse text-sm font-medium">
          {successMsg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#c9a962] rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900">لوحة التحكم</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-right px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'bg-[#c9a962] text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                    <span>{tab.icon}</span><span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {loading && <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" /></div>}

            {/* ━━━ STATS TAB ━━━ */}
            {!loading && activeTab === 'stats' && stats && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'المستخدمين', value: stats.total_users, color: 'text-blue-700' },
                    { label: 'الطلبيات', value: stats.total_orders, color: 'text-green-700' },
                    { label: 'التصاميم', value: stats.total_designs, color: 'text-purple-700' },
                    { label: 'الإيرادات', value: `$${stats.total_revenue.toLocaleString()}`, color: 'text-[#c9a962]' },
                  ].map((card) => (
                    <div key={card.label} className="bg-white rounded-lg p-5 shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                      <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                  ))}
                </div>
                {stats.pending_orders > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-700 font-medium">⚠️ {stats.pending_orders} طلبات معلقة بانتظار المراجعة</p>
                  </div>
                )}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold mb-4">آخر الطلبيات</h3>
                  <div className="space-y-3">
                    {stats.recent_orders.map((o) => (
                      <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">#{o.id}</span>
                        <span className="text-sm">${o.total_amount.toLocaleString()}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}>{statusLabels[o.status] || o.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ━━━ ORDERS TAB (Enhanced) ━━━ */}
            {!loading && activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-2">جميع الطلبيات ({orders.length})</h2>
                {orders.length === 0 ? (
                  <div className="bg-white rounded-lg p-12 text-center text-gray-500 shadow-sm">لا توجد طلبيات</div>
                ) : orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-[#c9a962]">#{order.id}</span>
                          <div>
                            <p className="font-medium text-sm">{order.user?.first_name ? `${order.user.first_name} ${order.user.last_name || ''}` : order.user?.username || `مستخدم #${order.user_id}`}</p>
                            <p className="text-xs text-gray-400">{order.user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold">${order.total_amount.toLocaleString()}</span>
                          <select value={order.status} onChange={(e) => { e.stopPropagation(); handleOrderStatus(order.id, e.target.value); }}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-xs px-3 py-1.5 rounded-full border-0 font-medium cursor-pointer ${statusColors[order.status] || 'bg-gray-100'}`}>
                            {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                          </select>
                          <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>📅 {order.order_date ? new Date(order.order_date).toLocaleDateString('ar-SA') : '—'}</span>
                        <span>💳 {order.payment_method?.method_name || '—'}</span>
                        <span>📦 {order.items.length} منتجات</span>
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="border-t px-4 py-4 bg-[#faf9f7] space-y-3">
                        {order.shipping_address && (
                          <div><p className="text-xs font-medium text-gray-500 mb-1">📍 عنوان الشحن</p><p className="text-sm">{order.shipping_address}</p></div>
                        )}
                        {order.user?.phone && (
                          <div><p className="text-xs font-medium text-gray-500 mb-1">📞 هاتف الزبون</p><p className="text-sm" dir="ltr">{order.user.phone}</p></div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">🛒 المنتجات المطلوبة</p>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 bg-white rounded-lg p-2">
                                {item.product?.image_path && (
                                  <img src={getImg(item.product.image_path)} alt="" className="w-10 h-10 rounded object-cover" />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{item.product?.name || `منتج #${item.product_id}`}</p>
                                  <p className="text-xs text-gray-400">الكمية: {item.quantity} × ${item.unit_price}</p>
                                </div>
                                <span className="text-sm font-bold text-[#c9a962]">${item.subtotal}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ━━━ PRODUCTS TAB ━━━ */}
            {!loading && activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">المنتجات ({products.length})</h2>
                  <button onClick={() => { setEditingProduct(null); setProductForm({ ...emptyProduct, jeweler_id: jewelers[0]?.id || 1 }); setShowProductForm(true); }}
                    className="px-4 py-2 bg-[#c9a962] text-white rounded-lg text-sm hover:bg-[#b8944f] transition-colors">
                    + إضافة منتج
                  </button>
                </div>

                {/* Product Form Modal */}
                {showProductForm && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowProductForm(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      <h3 className="text-lg font-semibold mb-4">{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">اسم المنتج *</label>
                          <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" placeholder="خاتم ذهبي كلاسيكي" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">المادة</label>
                            <select value={productForm.material} onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]">
                              <option value="Gold">ذهب</option><option value="Silver">فضة</option><option value="Platinum">بلاتين</option><option value="Rose Gold">ذهب وردي</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">العيار</label>
                            <select value={productForm.karat} onChange={(e) => setProductForm({ ...productForm, karat: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]">
                              <option value="24K">24K</option><option value="22K">22K</option><option value="21K">21K</option><option value="18K">18K</option><option value="14K">14K</option><option value="925">925 فضة</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">الوزن (غ)</label>
                            <input type="number" step="0.1" value={productForm.weight} onChange={(e) => setProductForm({ ...productForm, weight: parseFloat(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">السعر ($) *</label>
                            <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">المخزون</label>
                            <input type="number" value={productForm.stock_quantity} onChange={(e) => setProductForm({ ...productForm, stock_quantity: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">الوصف</label>
                          <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962] h-20 resize-none" placeholder="وصف المنتج..." />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">الصائغ</label>
                          <select value={productForm.jeweler_id} onChange={(e) => setProductForm({ ...productForm, jeweler_id: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]">
                            {jewelers.map((j) => <option key={j.id} value={j.id}>{j.name} — {j.shop_name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">الفئات</label>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                              <label key={cat.id} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors ${productForm.category_ids.includes(cat.id) ? 'bg-[#c9a962] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                <input type="checkbox" className="hidden" checked={productForm.category_ids.includes(cat.id)}
                                  onChange={() => setProductForm({ ...productForm, category_ids: productForm.category_ids.includes(cat.id) ? productForm.category_ids.filter(id => id !== cat.id) : [...productForm.category_ids, cat.id] })} />
                                {cat.name}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">رابط الصورة (اختياري)</label>
                          <input value={productForm.image_path} onChange={(e) => setProductForm({ ...productForm, image_path: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" dir="ltr" placeholder="https://..." />
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button onClick={handleSaveProduct} disabled={!productForm.name || !productForm.price}
                          className="flex-1 py-2.5 bg-[#c9a962] text-white rounded-lg text-sm font-medium hover:bg-[#b8944f] transition-colors disabled:opacity-40">
                          {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
                        </button>
                        <button onClick={() => { setShowProductForm(false); setEditingProduct(null); }} className="px-4 py-2.5 border rounded-lg text-sm text-gray-500 hover:bg-gray-50">إلغاء</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Grid */}
                {products.length === 0 ? (
                  <div className="bg-white rounded-lg p-12 text-center text-gray-500 shadow-sm">
                    <p className="mb-2">لا توجد منتجات بعد</p>
                    <p className="text-sm">ابدأ بإضافة أول منتج من الزر أعلاه</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="relative aspect-square bg-gray-100">
                          {p.image_path ? (
                            <img src={getImg(p.image_path)} alt={p.name} className="w-full h-full object-cover" />
                          ) : p.images.length > 0 ? (
                            <img src={getImg(p.images[0].image_path)} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">💎</div>
                          )}
                          {/* Upload overlay */}
                          <label className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-3 py-1.5 rounded-full text-xs font-medium shadow">
                              {uploadingImage === p.id ? '⏳ جاري الرفع...' : '📷 رفع صورة'}
                            </span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(p.id, e.target.files[0]); }} />
                          </label>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-sm leading-tight">{p.name}</h3>
                            <span className="text-[#c9a962] font-bold text-sm whitespace-nowrap mr-2">${p.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                            <span>{p.material || '—'}</span>
                            <span>•</span>
                            <span>{p.karat || '—'}</span>
                            <span>•</span>
                            <span>{p.weight ? `${p.weight}غ` : '—'}</span>
                            <span>•</span>
                            <span>المخزون: {p.stock_quantity}</span>
                          </div>
                          {p.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {p.categories.map((c) => <span key={c.id} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{c.name}</span>)}
                            </div>
                          )}
                          <div className="flex gap-2 pt-2 border-t">
                            <button onClick={() => handleEditProduct(p)} className="flex-1 text-xs text-[#c9a962] hover:underline font-medium">✏️ تعديل</button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 text-xs text-red-500 hover:underline">🗑️ حذف</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ━━━ JEWELERS TAB ━━━ */}
            {!loading && activeTab === 'jewelers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">الصائغين ({jewelers.length})</h2>
                  <button onClick={() => setShowJewelerForm(!showJewelerForm)}
                    className="px-4 py-2 bg-[#c9a962] text-white rounded-lg text-sm hover:bg-[#b8944f] transition-colors">
                    + إضافة صائغ
                  </button>
                </div>

                {showJewelerForm && (
                  <div className="bg-white rounded-lg p-6 shadow-sm space-y-3">
                    <h3 className="font-medium mb-2">صائغ جديد</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input placeholder="الاسم *" value={jewelerForm.name} onChange={(e) => setJewelerForm({ ...jewelerForm, name: e.target.value })}
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" />
                      <input placeholder="اسم المتجر *" value={jewelerForm.shop_name} onChange={(e) => setJewelerForm({ ...jewelerForm, shop_name: e.target.value })}
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" />
                      <input placeholder="البريد الإلكتروني *" type="email" value={jewelerForm.email} onChange={(e) => setJewelerForm({ ...jewelerForm, email: e.target.value })}
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" dir="ltr" />
                      <input placeholder="الهاتف" value={jewelerForm.phone} onChange={(e) => setJewelerForm({ ...jewelerForm, phone: e.target.value })}
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" dir="ltr" />
                    </div>
                    <input placeholder="العنوان" value={jewelerForm.address} onChange={(e) => setJewelerForm({ ...jewelerForm, address: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#c9a962]" />
                    <div className="flex gap-2">
                      <button onClick={handleSaveJeweler} disabled={!jewelerForm.name || !jewelerForm.shop_name || !jewelerForm.email}
                        className="px-4 py-2 bg-[#c9a962] text-white rounded-lg text-sm hover:bg-[#b8944f] disabled:opacity-40">حفظ</button>
                      <button onClick={() => setShowJewelerForm(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-500 hover:bg-gray-50">إلغاء</button>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-right py-3 px-4 font-medium text-gray-500">#</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">الاسم</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">المتجر</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">البريد</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">الهاتف</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">التقييم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jewelers.map((j) => (
                        <tr key={j.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-400">{j.id}</td>
                          <td className="py-3 px-4 font-medium">{j.name}</td>
                          <td className="py-3 px-4">{j.shop_name}</td>
                          <td className="py-3 px-4 text-gray-500" dir="ltr">{j.email}</td>
                          <td className="py-3 px-4 text-gray-500" dir="ltr">{j.phone || '—'}</td>
                          <td className="py-3 px-4"><span className="text-yellow-500">⭐</span> {j.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ━━━ DESIGNS TAB ━━━ */}
            {!loading && activeTab === 'designs' && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-6">جميع التصاميم المُولّدة بالذكاء الاصطناعي ({designs.length})</h2>
                {designs.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">لا توجد تصاميم</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {designs.map((d) => (
                      <div key={d.id} className="border rounded-xl overflow-hidden">
                        <div className="relative aspect-square bg-gray-100">
                          <img src={getImg(d.generated_image_url)} alt="Design" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-400">تصميم #{d.id} — بواسطة: {d.username || `مستخدم #${d.user_id}`}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(d.created_at).toLocaleDateString('ar-SA')}</p>
                          {d.prompt_used && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{d.prompt_used}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ━━━ USERS TAB ━━━ */}
            {!loading && activeTab === 'users' && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-6">جميع المستخدمين ({users.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-2 font-medium text-gray-500">#</th>
                        <th className="text-right py-3 px-2 font-medium text-gray-500">اسم المستخدم</th>
                        <th className="text-right py-3 px-2 font-medium text-gray-500">البريد</th>
                        <th className="text-right py-3 px-2 font-medium text-gray-500">الدور</th>
                        <th className="text-right py-3 px-2 font-medium text-gray-500">تاريخ التسجيل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-3 px-2">{u.id}</td>
                          <td className="py-3 px-2 font-medium">{u.username}</td>
                          <td className="py-3 px-2 text-gray-500">{u.email}</td>
                          <td className="py-3 px-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-[#c9a962]/10 text-[#c9a962]' : 'bg-gray-100 text-gray-600'}`}>
                              {u.role === 'ADMIN' ? 'مدير' : 'زبون'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-gray-400">{new Date(u.created_at).toLocaleDateString('ar-SA')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
