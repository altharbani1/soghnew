"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        identifier: "", // Can be phone or email
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                phone: formData.identifier, // Our auth logic checks both phone/email
                email: formData.identifier, // Pass to both to be safe
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError("رقم الجوال/البريد أو كلمة المرور غير صحيحة");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            setError("حدث خطأ غير متوقع");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 flex items-center justify-center p-4 py-12 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

                <div className="w-full max-w-md">
                    {/* Header Text */}
                    <div className="text-center mb-8 animate-fadeIn">
                        <Link href="/" className="inline-block mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-[var(--primary)]/20">
                                س
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold mb-2 text-gray-900">
                            أهلاً بك مجدداً
                        </h1>
                        <p className="text-gray-600 font-medium">
                            سجل دخولك للمتابعة في سوقه
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden animate-slideUp">
                        <div className="h-2 w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />

                        <div className="p-8">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-200 animate-shake">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    <span className="text-sm font-bold">{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Identifier Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800">البريد الإلكتروني أو الجوال</label>
                                    <div className="relative group">
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--primary)] transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        </div>
                                        <input
                                            type="text"
                                            name="identifier"
                                            value={formData.identifier}
                                            onChange={handleChange}
                                            required
                                            dir="ltr"
                                            className="w-full bg-white border border-gray-300 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent block pr-11 p-3.5 transition-all outline-none text-left shadow-sm hover:border-gray-400 placeholder:text-gray-400"
                                            placeholder="user@example.com / 05xxxxxxxx"
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-800">كلمة المرور</label>
                                        <Link href="/auth/forgot-password" className="text-xs font-semibold text-[var(--primary)] hover:underline">
                                            نسيت كلمة المرور؟
                                        </Link>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--primary)] transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white border border-gray-300 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent block pr-11 p-3.5 transition-all outline-none shadow-sm hover:border-gray-400"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full text-white bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-[var(--primary)]/30 font-bold rounded-xl text-md px-5 py-3.5 text-center transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl hover:shadow-[var(--primary)]/30 transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            جاري تسجيل الدخول...
                                        </div>
                                    ) : (
                                        "تسجيل الدخول"
                                    )}
                                </button>
                            </form>

                            {/* Social Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500 font-medium">أو تابع باستخدام</span>
                                </div>
                            </div>

                            {/* Google Button */}
                            <button
                                type="button"
                                onClick={() => signIn("google", { callbackUrl: "/" })}
                                className="w-full text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-xl text-sm px-5 py-3 text-center inline-flex items-center justify-center gap-3 transition-colors shadow-sm hover:shadow"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                        </div>

                        {/* Footer Link */}
                        <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-600">
                                ليس لديك حساب؟{" "}
                                <Link href="/auth/register" className="text-[var(--primary)] font-bold hover:underline transition-colors">
                                    أنشئ حساباً جديداً
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
