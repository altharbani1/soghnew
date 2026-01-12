"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ResetPasswordSchema } from "@/lib/validations/auth";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { useRouter, useSearchParams } from "next/navigation";


function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

        } catch (err) {
            setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="bg-red-500/10 text-red-200 p-4 rounded-xl text-center border border-red-500/20 font-bold">
                رابط غير صالح. يرجى التأكد من الرابط أو طلب رابط جديد.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
            {/* Password Input */}
            <div className="space-y-1">
                <div className="relative group">
                    <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        className="w-full h-14 bg-slate-950/50 border border-slate-800 rounded-2xl px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] text-sm font-sans tracking-widest"
                        placeholder="كلمة المرور الجديدة"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-0 bottom-0 left-4 flex items-center text-xs text-slate-500 hover:text-blue-400 transition-colors">{showPassword ? "إخفاء" : "إظهار"}</button>
                </div>
                {errors.password && <p className="text-red-400 text-xs px-2">{errors.password.message}</p>}

                <div className="mt-2 bg-slate-950/30 p-2 rounded-xl border border-white/5">
                    <PasswordStrength password={password} />
                </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
                <div className="relative group">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        className="w-full h-14 bg-slate-950/50 border border-slate-800 rounded-2xl px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] text-sm font-sans tracking-widest"
                        placeholder="تأكيد كلمة المرور"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-0 bottom-0 left-4 flex items-center text-xs text-slate-500 hover:text-blue-400 transition-colors">{showConfirmPassword ? "إخفاء" : "إظهار"}</button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs px-2">{errors.confirmPassword.message}</p>}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    {error}
                </div>
            )}

            {/* Success Message */}
            {message && (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-200 text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || !isValid}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    "تغيير كلمة المرور"
                )}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div dir="rtl" className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#0f172a] font-sans">
            {/* Background Bokeh Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '5s' }} />
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-emerald-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[1px]" />
            </div>

            {/* Glass Card */}
            <div className="relative z-10 w-full max-w-[480px] p-8 md:p-12 mx-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl" />

                <div className="relative z-20 flex flex-col items-center">
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                        <span className="text-white text-2xl font-bold tracking-wider">FP</span>
                    </div>

                    {/* Headers */}
                    <h1 className="text-3xl font-bold text-white mb-2">استعادة كلمة المرور</h1>
                    <p className="text-slate-400 text-sm mb-6">أدخل كلمة المرور الجديدة لحسابك</p>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8" />

                    <Suspense fallback={<div className="text-center p-8 text-slate-500">جاري التحميل...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
