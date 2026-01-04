"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError("بيانات الدخول غير صحيحة");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch (error) {
            setError("حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#111] text-white">
            <div className="w-full max-w-md p-8 bg-[#222] rounded-2xl shadow-2xl border border-gray-800">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-100">بوابة الإدارة</h1>
                    <p className="text-sm text-gray-500 mt-2">الوصول المصرح به فقط</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="admin@souqah.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">كلمة المرور</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? "جاري التحقق..." : "تسجيل الدخول"}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-gray-600">
                    <p>IP Address Logged & Monitored</p>
                </div>
            </div>
        </div>
    );
}
