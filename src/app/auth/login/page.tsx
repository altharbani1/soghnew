"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginSchema } from "@/lib/validations/auth";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const { register, handleSubmit, formState: { errors, isValid } } = form;

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                phone: values.identifier,
                email: values.identifier,
                password: values.password,
                redirect: false,
            });

            if (result?.error) {
                setError("بيانات الدخول غير صحيحة");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch {
            setError("حدث خطأ غير متوقع");
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
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">تسجيل الدخول</h1>
                    <p className="text-slate-400 text-sm mb-6">أدخل بياناتك للمتابعة</p>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8" />

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
                        {/* Identifier Input */}
                        <div className="space-y-1">
                            <div className="relative group">
                                <input
                                    type="text"
                                    {...register("identifier")}
                                    className="w-full h-14 bg-slate-950/50 border border-slate-800 rounded-2xl px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                                    placeholder="البريد الإلكتروني أو اسم المستخدم"
                                />
                            </div>
                            {errors.identifier && <p className="text-red-400 text-xs px-2">{errors.identifier.message}</p>}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    className="w-full h-14 bg-slate-950/50 border border-slate-800 rounded-2xl px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] tracking-widest font-sans"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-0 bottom-0 left-4 flex items-center text-xs font-medium text-slate-500 hover:text-blue-400 transition-colors"
                                >
                                    {showPassword ? "إخفاء" : "إظهار"}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs px-2">{errors.password.message}</p>}
                        </div>

                        {/* Options Row */}
                        <div className="flex items-center justify-between pb-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-4 h-4 rounded border border-slate-600 bg-slate-900/50 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all" />
                                    <svg className="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">تذكرني</span>
                            </label>

                            <Link
                                href="/auth/forgot-password"
                                className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
                            >
                                نسيت كلمة المرور؟
                            </Link>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                {error}
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
                                "تسجيل الدخول"
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-800"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-transparent px-4 text-xs text-slate-500 bg-[#121c36]">أو</span>
                            </div>
                        </div>

                        {/* Google Button */}
                        <button
                            type="button"
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="w-full h-14 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            تسجيل الدخول عبر Google
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-sm">
                            ليس لديك حساب؟{" "}
                            <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors">
                                إنشاء حساب
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
