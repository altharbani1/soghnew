"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ResetPasswordSchema } from "@/lib/validations/auth";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const { register, handleSubmit, formState: { errors, isValid }, watch } = form;
    const password = watch("password");

    const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: values.password }),
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <AuthInput
                    label="كلمة المرور الجديدة"
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

            {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 border border-red-100 animate-shake">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    {error}
                </div>
            )}

            {message && (
                <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl flex items-center gap-2 border border-green-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || !isValid}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? "جاري التحديث..." : "تغيير كلمة المرور"}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <AuthLayout
            title="استعادة كلمة المرور"
            subtitle="أدخل كلمة المرور الجديدة لحسابك"
        >
            <Suspense fallback={<div className="text-center p-8 text-gray-500">جاري التحميل...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </AuthLayout>
    );
}
