'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Create x-www-form-urlencoded body for OAuth2 Password Bearer
            const urlEncodedData = new URLSearchParams();
            urlEncodedData.append('username', formData.username);
            urlEncodedData.append('password', formData.password);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlEncodedData.toString()
            });

            if (!res.ok) {
                throw new Error('بيانات الدخول غير صحيحة');
            }

            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            router.push('/');
            router.refresh();

        } catch (err: any) {
            setError(err.message || 'حدث خطأ، حاول مرة أخرى');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f7] flex flex-col justify-center py-12 sm:px-6 lg:px-8" dir="rtl">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    تسجيل الدخول
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 p-4 rounded-md">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                اسم المستخدم
                            </label>
                            <div className="mt-1">
                                <input
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#c9a962] focus:border-[#c9a962] sm:text-sm"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                كلمة المرور
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#c9a962] focus:border-[#c9a962] sm:text-sm"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <Link href="/register" className="font-medium text-[#c9a962] hover:text-[#b8944f]">
                                    ليس لديك حساب؟
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#c9a962] hover:bg-[#b8944f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c9a962] disabled:opacity-50"
                            >
                                {loading ? 'الرجاء الانتظار...' : 'دخول'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
