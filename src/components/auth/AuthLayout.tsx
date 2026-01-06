"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    backButton?: boolean;
}

export default function AuthLayout({ children, title, subtitle, backButton = true }: AuthLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen w-full flex bg-white">
            {/* Left Side - Visual (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 text-white p-12 flex-col justify-between">
                {/* Background Overlay */}
                <div className="absolute inset-0 z-0">
                    {/* You can replace this with a real image using next/image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-900 opacity-90" />
                    <div className="absolute inset-0 bg-[url('/auth-pattern.svg')] opacity-20" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                            س
                        </div>
                        سوقه
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-bold mb-6 leading-tight">
                        منصتك الآمنة للتجارة الإلكترونية في المملكة
                    </h2>
                    <p className="text-lg text-indigo-100 leading-relaxed">
                        انضم إلى آلاف البائعين والمشترين في سوقه. بيع، اشتري، وتواصل بكل سهولة وأمان.
                    </p>
                </div>

                <div className="relative z-10 flex gap-6 text-sm text-indigo-200">
                    <span>© 2024 سوقه</span>
                    <Link href="/privacy" className="hover:text-white transition-colors">الخصوصية</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">الشروط</Link>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                {backButton && (
                    <Link href="/" className="absolute top-6 right-6 lg:top-12 lg:right-12 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        العودة للرئيسية
                    </Link>
                )}

                <div className="w-full max-w-sm space-y-8 animate-fadeIn">
                    <div className="text-center lg:text-right">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                                س
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
                        <p className="mt-2 text-slate-500">{subtitle}</p>
                    </div>

                    <div className="mt-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
