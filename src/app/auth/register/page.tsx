"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RegisterSchema } from "@/lib/validations/auth";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
        mode: "onChange",
    });

    const { register, handleSubmit, formState: { errors, isValid }, watch } = form;
    const password = watch("password");

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    password: values.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "حدث خطأ أثناء التسجيل");
                setIsLoading(false);
                return;
            }

            setSuccess(true);

            // Auto login after registration
            const loginResult = await signIn("credentials", {
                phone: values.phone,
                password: values.password,
                redirect: false,
            });

            if (loginResult?.ok) {
                router.push("/");
                router.refresh();
            } else {
                router.push("/auth/login");
            }
        } catch (err) {
            setError("حدث خطأ غير متوقع");
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="حساب جديد"
            subtitle="أنشئ حسابك وابدأ رحلتك في سوقه"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <AuthInput
                    label="الاسم الكامل"
                    {...register("name")}
                    error={errors.name?.message}
                    placeholder="الاسم الثلاثي"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                />

                <AuthInput
                    label="البريد الإلكتروني"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    placeholder="name@example.com"
                    dir="ltr"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>}
                />

                <AuthInput
                    label="رقم الجوال"
                    type="tel"
                    {...register("phone")}
                    error={errors.phone?.message}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                    maxLength={10}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <AuthInput
                            label="كلمة المرور"
                            type="password"
                            {...register("password")}
                            error={errors.password?.message}
                            placeholder="••••••••"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
                        />
                        <PasswordStrength password={password} />
                    </div>
                    <AuthInput
                        label="تأكيد كلمة المرور"
                        type="password"
                        {...register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                        placeholder="••••••••"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>}
                    />
                </div>

                <div className="flex items-start gap-2 mt-2">
                    <input
                        id="terms"
                        type="checkbox"
                        {...register("terms")}
                        className="w-4 h-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-500 leading-tight">
                        أوافق على <Link href="/terms" className="text-indigo-600 hover:underline">الشروط والأحكام</Link> و <Link href="/privacy" className="text-indigo-600 hover:underline">سياسة الخصوصية</Link>
                        {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>}
                    </label>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 border border-red-100 animate-shake">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || success || !isValid}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                    {isLoading ? "جاري الإنشاء..." : "إنشاء حساب"}
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">أو سجل عبر</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className="w-full bg-white border border-gray-200 text-gray-700 font-medium py-3.5 px-4 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    لديك حساب بالفعل؟{" "}
                    <Link href="/auth/login" className="text-indigo-600 font-bold hover:underline">
                        سجل دخولك
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
