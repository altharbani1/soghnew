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
        phone: "",
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
                phone: formData.phone,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError("حدث خطأ غير متوقع");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 flex items-center justify-center py-12">
                <div className="w-full max-w-md mx-4">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-2xl">
                                س
                            </div>
                            <span className="text-3xl font-bold">سوقه</span>
                        </Link>
                        <h1 className="text-xl font-semibold mt-4">تسجيل الدخول</h1>
                        <p className="text-[var(--foreground-muted)] mt-1">
                            أدخل بياناتك للوصول إلى حسابك
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2">رقم الجوال</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="05xxxxxxxx"
                                    className="input"
                                    required
                                    maxLength={10}
                                    dir="ltr"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">كلمة المرور</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded" />
                                    <span>تذكرني</span>
                                </label>
                                <Link href="/auth/forgot" className="text-[var(--primary)] hover:underline">
                                    نسيت كلمة المرور؟
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary w-full py-3 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                        </svg>
                                        جاري الدخول...
                                    </>
                                ) : (
                                    "تسجيل الدخول"
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-[var(--border)]"></div>
                            <span className="text-sm text-[var(--foreground-muted)]">أو</span>
                            <div className="flex-1 h-px bg-[var(--border)]"></div>
                        </div>

                        {/* Social Login */}
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => signIn("google", { callbackUrl: "/" })}
                                className="btn btn-secondary w-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                الدخول عبر Google
                            </button>
                        </div>
                    </div>

                    {/* Register Link */}
                    <p className="text-center mt-6 text-[var(--foreground-muted)]">
                        ليس لديك حساب؟{" "}
                        <Link href="/auth/register" className="text-[var(--primary)] font-medium hover:underline">
                            سجل الآن
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
