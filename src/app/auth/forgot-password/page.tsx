"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ForgotPasswordSchema } from "@/lib/validations/auth";
import Link from "next/link";


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
        } catch (err) {
            setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        } finally {
            setIsLoading(false);
        }
    };

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
                    <h1 className="text-3xl font-bold text-white mb-2">نسيت كلمة المرور؟</h1>
                    <p className="text-slate-400 text-sm mb-6">أدخل بريدك الإلكتروني لاستعادة حسابك</p>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8" />

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
                        {/* Email Input */}
                        <div className="space-y-1">
                            <div className="relative group">
                                <div className="absolute top-0 bottom-0 right-4 flex items-center justify-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                </div>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className="w-full h-14 bg-slate-950/50 border border-slate-800 rounded-2xl px-12 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] text-left"
                                    placeholder="name@example.com"
                                    dir="ltr"
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs px-2">{errors.email.message}</p>}
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !isValid}
                            className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "إرسال رابط إعادة التعيين"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-sm">
                            تذكرت كلمة المرور؟{" "}
                            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors">
                                سجل دخولك
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
