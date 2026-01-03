"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface AdminLayoutProps {
    children: ReactNode;
}

const sidebarItems = [
    { name: "نظرة عامة", href: "/admin", icon: "📊" },
    { name: "الإعلانات", href: "/admin/ads", icon: "📝" },
    { name: "المستخدمين", href: "/admin/users", icon: "👥" },
    { name: "البلاغات", href: "/admin/reports", icon: "🚨" },
    { name: "الأقسام", href: "/admin/categories", icon: "📁" },
    { name: "الإعدادات", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex bg-[var(--background-secondary)]">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--background)] border-l border-[var(--border)] flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-[var(--border)]">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white font-bold text-xl">
                            س
                        </div>
                        <div>
                            <span className="text-xl font-bold">سوقه</span>
                            <span className="text-xs text-[var(--foreground-muted)] block">لوحة التحكم</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                                ? "bg-[var(--primary)] text-white"
                                                : "hover:bg-[var(--background-secondary)]"
                                            }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Back to Site */}
                <div className="p-4 border-t border-[var(--border)]">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m12 19-7-7 7-7" />
                            <path d="M19 12H5" />
                        </svg>
                        العودة للموقع
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="h-16 bg-[var(--background)] border-b border-[var(--border)] flex items-center justify-between px-6">
                    <h1 className="text-lg font-bold">لوحة تحكم الإدارة</h1>
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="relative p-2 hover:bg-[var(--background-secondary)] rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--error)]"></span>
                        </button>

                        {/* Admin Profile */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-sm">
                                م
                            </div>
                            <span className="text-sm font-medium">مدير النظام</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
