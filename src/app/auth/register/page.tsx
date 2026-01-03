"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError("كلمة المرور غير متطابقة!");
            return;
        }

        // Validate phone format
        const phoneRegex = /^05[0-9]{8}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError("رقم الجوال غير صحيح (يجب أن يبدأ بـ 05)");
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "حدث خطأ أثناء التسجيل");
                return;
            }

            setSuccess(true);

            // Auto login after registration
            const loginResult = await signIn("credentials", {
                phone: formData.phone,
                password: formData.password,
                redirect: false,
            });

            if (loginResult?.ok) {
                router.push("/");
                router.refresh();
            } else {
                // If auto-login fails, redirect to login page
                router.push("/auth/login");
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
                        <h1 className="text-xl font-semibold mt-4">إنشاء حساب جديد</h1>
                        <p className="text-[var(--foreground-muted)] mt-1">
                            انضم إلى سوقه وابدأ البيع والشراء
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                                تم إنشاء حسابك بنجاح! جاري تسجيل الدخول...
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="أدخل اسمك"
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                    className="input"
                                    required
                                    dir="ltr"
                                />
                            </div>

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
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">تأكيد كلمة المرور</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input"
                                    required
                                />
                            </div>

                            <label className="flex items-start gap-2 cursor-pointer text-sm">
                                <input type="checkbox" className="w-4 h-4 rounded mt-0.5" required />
                                <span className="text-[var(--foreground-muted)]">
                                    أوافق على{" "}
                                    <Link href="/terms" className="text-[var(--primary)] hover:underline">
                                        الشروط والأحكام
                                    </Link>{" "}
                                    و{" "}
                                    <Link href="/privacy" className="text-[var(--primary)] hover:underline">
                                        سياسة الخصوصية
                                    </Link>
                                </span>
                            </label>

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
                                        جاري التسجيل...
                                    </>
                                ) : (
                                    "إنشاء الحساب"
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
                            التسجيل عبر Google
                        </button>
                    </div>

                    {/* Login Link */}
                    <p className="text-center mt-6 text-[var(--foreground-muted)]">
                        لديك حساب بالفعل؟{" "}
                        <Link href="/auth/login" className="text-[var(--primary)] font-medium hover:underline">
                            سجل دخولك
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
