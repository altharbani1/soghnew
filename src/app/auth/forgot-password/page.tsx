"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "حدث خطأ ما");
            }

            setMessage(data.message);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 flex items-center justify-center p-4 py-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

                <div className="w-full max-w-md">
                    <div className="text-center mb-8 animate-fadeIn">
                        <Link href="/auth/login" className="inline-block mb-4 text-[var(--primary)] font-bold hover:underline">
                            &larr; العودة لتسجيل الدخول
                        </Link>
                        <h1 className="text-3xl font-bold mb-2 text-gray-900">
                            نسيت كلمة المرور؟
                        </h1>
                        <p className="text-gray-600 font-medium">
                            أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيينها
                        </p>
                    </div>

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
                                    <label className="text-sm font-bold text-gray-800">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        dir="ltr"
                                        className="w-full bg-gray-50 border border-gray-400 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] block p-4 transition-all outline-none text-left shadow-sm placeholder:text-gray-500 font-medium"
                                        placeholder="name@example.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full text-white bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-[var(--primary)]/30 font-bold rounded-xl text-md px-5 py-3.5 text-center transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl hover:shadow-[var(--primary)]/30 transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {isLoading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
