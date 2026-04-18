'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface Stats {
  total_users: number;
  total_orders: number;
  total_designs: number;
  total_revenue: number;
  pending_orders: number;
  recent_orders: Array<{
    id: number;
    user_id: number;
    status: string;
    total_amount: number;
    order_date: string;
  }>;
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

interface OrderItem {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  order_date: string;
  items: Array<{ id: number; product_id: number; quantity: number; unit_price: number; subtotal: number }>;
}

const tabs = [
  { id: 'stats', label: 'الإحصائيات', icon: '📊' },
  { id: 'orders', label: 'الطلبيات', icon: '📦' },
  { id: 'designs', label: 'التصاميم', icon: '✨' },
  { id: 'users', label: 'المستخدمين', icon: '👥' },
];

const statusLabels: Record<string, string> = {
  PENDING: 'معلق',
  PROCESSING: 'قيد المعالجة',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التسليم',
  CANCELLED: 'ملغي',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function AdminPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [users, setUsers] = useState<Array<{ id: number; username: string; email: string; role: string; created_at: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  const fetchData = async (tab: string) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (tab === 'stats') {
        const res = await fetch(`${API_URL}/admin/dashboard-stats`, { headers });
        if (res.ok) setStats(await res.json());
      } else if (tab === 'orders') {
        const res = await fetch(`${API_URL}/admin/orders`, { headers });
        if (res.ok) setOrders(await res.json());
      } else if (tab === 'designs') {
        const res = await fetch(`${API_URL}/admin/designs`, { headers });
        if (res.ok) setDesigns(await res.json());
      } else if (tab === 'users') {
        const res = await fetch(`${API_URL}/admin/users`, { headers });
        if (res.ok) setUsers(await res.json());
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN' || !token) return;
    fetchData(activeTab);
  }, [activeTab, isAuthenticated, user, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-[#faf9f7]" dir="rtl">
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
          <div className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-lg p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-right px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-[#c9a962] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && activeTab === 'stats' && stats && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'المستخدمين', value: stats.total_users, color: 'bg-blue-50 text-blue-700' },
                    { label: 'الطلبيات', value: stats.total_orders, color: 'bg-green-50 text-green-700' },
                    { label: 'التصاميم', value: stats.total_designs, color: 'bg-purple-50 text-purple-700' },
                    { label: 'الإيرادات', value: `$${stats.total_revenue.toLocaleString()}`, color: 'bg-[#c9a962]/10 text-[#c9a962]' },
                  ].map((card) => (
                    <div key={card.label} className="bg-white rounded-lg p-5">
                      <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                      <p className={`text-2xl font-bold ${card.color.split(' ')[1]}`}>{card.value}</p>
                    </div>
                  ))}
                </div>
                {stats.pending_orders > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-700 font-medium">⚠️ {stats.pending_orders} طلبات معلقة بانتظار المراجعة</p>
                  </div>
                )}
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold mb-4">آخر الطلبيات</h3>
                  <div className="space-y-3">
                    {stats.recent_orders.map((o) => (
                      <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">#{o.id}</span>
                        <span className="text-sm">${o.total_amount.toLocaleString()}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}>
                          {statusLabels[o.status] || o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!loading && activeTab === 'orders' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-6">جميع الطلبيات</h2>
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">لا توجد طلبيات</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="font-medium">طلب #{order.id}</span>
                            <span className="text-sm text-gray-400 mr-2">— مستخدم #{order.user_id}</span>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#c9a962]">${order.total_amount.toLocaleString()}</span>
                          <select
                            defaultValue={order.status}
                            onChange={async (e) => {
                              try {
                                await fetch(`${API_URL}/admin/orders/${order.id}/status`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({ new_status: e.target.value }),
                                });
                                fetchData('orders');
                              } catch {}
                            }}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#c9a962]"
                          >
                            {Object.entries(statusLabels).map(([key, label]) => (
                              <option key={key} value={key}>{label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === 'designs' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-6">جميع التصاميم المُولّدة بالذكاء الاصطناعي</h2>
                {designs.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">لا توجد تصاميم</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {designs.map((d) => {
                      const imgFull = d.generated_image_url.startsWith('http')
                        ? d.generated_image_url
                        : `${API_URL.replace('/api', '')}${d.generated_image_url}`;
                      return (
                        <div key={d.id} className="border rounded-xl overflow-hidden">
                          <div className="relative aspect-square bg-gray-100">
                            <img src={imgFull} alt="Design" className="w-full h-full object-cover" />
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-gray-400">تصميم #{d.id} — بواسطة: {d.username || `مستخدم #${d.user_id}`}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(d.created_at).toLocaleDateString('ar-SA')}</p>
                            {d.prompt_used && (
                              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{d.prompt_used}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === 'users' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-6">جميع المستخدمين</h2>
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
