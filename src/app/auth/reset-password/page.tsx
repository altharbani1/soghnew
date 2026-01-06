"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("كلمات المرور غير متطابقة");
            return;
        }

        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "حدث خطأ ما");
            }

            setMessage("تم تغيير كلمة المرور بنجاح. جاري تحويلك لصفحة الدخول...");
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center border border-red-200 font-bold">
                رابط غير صالح. يرجى التأكد من الرابط أو طلب رابط جديد.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden animate-slideUp">
            <div className="h-2 w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />

            <div className="p-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-200">
                        <span className="text-sm font-bold">{error}</span>
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-200">
                        <span className="text-sm font-bold">{message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">كلمة المرور الجديدة</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-400 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] block p-4 transition-all outline-none shadow-sm placeholder:text-gray-500 font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-800">تأكيد كلمة المرور</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-400 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] block p-4 transition-all outline-none shadow-sm placeholder:text-gray-500 font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full text-white bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-[var(--primary)]/30 font-bold rounded-xl text-md px-5 py-3.5 text-center transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl hover:shadow-[var(--primary)]/30 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isLoading ? "جاري التحديث..." : "تغيير كلمة المرور"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 flex items-center justify-center p-4 py-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

                <div className="w-full max-w-md">
                    <div className="text-center mb-8 animate-fadeIn">
                        <h1 className="text-3xl font-bold mb-2 text-gray-900">
                            استعادة كلمة المرور
                        </h1>
                        <p className="text-gray-600 font-medium">
                            أدخل كلمة المرور الجديدة
                        </p>
                    </div>

                    <Suspense fallback={<div className="text-center">جاري التحميل...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </div>
    );
}
