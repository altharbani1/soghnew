"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ForgotPasswordSchema } from "@/lib/validations/auth";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const { register, handleSubmit, formState: { errors, isValid } } = form;

    const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: values.email }),
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
        <AuthLayout
            title="نسيت كلمة المرور؟"
            subtitle="أدخل بريدك الإلكتروني لاستعادة حسابك"
            backButton={true}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <AuthInput
                    label="البريد الإلكتروني"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    placeholder="name@example.com"
                    dir="ltr"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>}
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
                    {isLoading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    تذكرت كلمة المرور؟{" "}
                    <Link href="/auth/login" className="text-indigo-600 font-bold hover:underline">
                        سجل دخولك
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
