"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import AdvancedSearch from "./AdvancedSearch";
import NotificationBell from "./NotificationBell";

export default function Header() {
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const categories = [
        { name: "سيارات", href: "/categories/cars", icon: "🚗" },
        { name: "عقارات", href: "/categories/realestate", icon: "🏠" },
        { name: "الكترونيات", href: "/categories/electronics", icon: "📱" },
        { name: "أثاث", href: "/categories/furniture", icon: "🛋️" },
        { name: "أزياء", href: "/categories/fashion", icon: "👔" },
        { name: "وظائف", href: "/categories/jobs", icon: "💼" },
        { name: "خدمات", href: "/categories/services", icon: "🔧" },
    ];

    const isLoggedIn = status === "authenticated";
    const isLoading = status === "loading";

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsProfileOpen(false);
        await signOut({ callbackUrl: "/" });
    };

    const getUserInitial = () => {
        if (session?.user?.name) {
            return session.user.name.charAt(0);
        }
        return "م";
    };

    return (
        <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
            <div className="container">
                {/* Top Bar */}
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-xl">
                            س
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-l from-[var(--primary)] to-[var(--primary-dark)] bg-clip-text text-transparent">
                            سوقه
                        </span>
                    </Link>

                    {/* Desktop Search with Autocomplete */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <AdvancedSearch />
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {isLoading ? (
                            <div className="w-24 h-8 bg-[var(--background-secondary)] rounded-lg animate-pulse"></div>
                        ) : isLoggedIn ? (
                            <>
                                {/* Messages */}
                                <Link href="/messages" className="relative p-2 hover:bg-[var(--background-secondary)] rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--error)]"></span>
                                </Link>

                                {/* Notifications */}
                                <NotificationBell />

                                {/* Profile Dropdown */}
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 p-1 pr-3 rounded-lg hover:bg-[var(--background-secondary)]"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-sm">
                                            {getUserInitial()}
                                        </div>
                                        <span className="text-sm font-medium">{session?.user?.name || "حسابي"}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}>
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileOpen && (
                                        <div className="absolute left-0 top-full mt-2 w-48 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden animate-fadeIn z-50">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--background-secondary)] transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="8" r="5" />
                                                    <path d="M20 21a8 8 0 0 0-16 0" />
                                                </svg>
                                                الملف الشخصي
                                            </Link>
                                            <Link
                                                href="/profile?tab=ads"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--background-secondary)] transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                                </svg>
                                                إعلاناتي
                                            </Link>
                                            <Link
                                                href="/profile?tab=favorites"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--background-secondary)] transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                                </svg>
                                                المفضلة
                                            </Link>
                                            <div className="border-t border-[var(--border)]">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-3 w-full text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                        <polyline points="16 17 21 12 16 7" />
                                                        <line x1="21" x2="9" y1="12" y2="12" />
                                                    </svg>
                                                    تسجيل الخروج
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link href="/auth/login" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] font-medium">
                                تسجيل الدخول
                            </Link>
                        )}

                        <Link href="/ads/new" className="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                            أضف إعلانك
                        </Link>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle />
                        {isLoggedIn && (
                            <Link href="/messages" className="relative p-2 hover:bg-[var(--background-secondary)] rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--error)]"></span>
                            </Link>
                        )}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 hover:bg-[var(--background-secondary)] rounded-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 hover:bg-[var(--background-secondary)] rounded-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {isMenuOpen ? (
                                    <>
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </>
                                ) : (
                                    <>
                                        <line x1="4" x2="20" y1="12" y2="12" />
                                        <line x1="4" x2="20" y1="6" y2="6" />
                                        <line x1="4" x2="20" y1="18" y2="18" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                {isSearchOpen && (
                    <div className="md:hidden pb-4 animate-fadeIn">
                        <AdvancedSearch />
                    </div>
                )}

                {/* Categories Bar - Desktop */}
                <nav className="hidden md:flex items-center gap-1 pb-3 overflow-x-auto">
                    {categories.map((cat) => (
                        <Link
                            key={cat.href}
                            href={cat.href}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] whitespace-nowrap transition-colors"
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                        </Link>
                    ))}
                    <Link
                        href="/categories"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--primary)] whitespace-nowrap font-medium"
                    >
                        المزيد ←
                    </Link>
                </nav>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)] animate-fadeIn">
                    <div className="container py-4">
                        {/* Mobile Categories */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.href}
                                    href={cat.href}
                                    className="flex items-center gap-2 p-3 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--border)]"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span className="text-xl">{cat.icon}</span>
                                    <span className="font-medium">{cat.name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Auth */}
                        <div className="flex flex-col gap-2 pt-4 border-t border-[var(--border)]">
                            {isLoggedIn ? (
                                <>
                                    <Link href="/profile" className="btn btn-secondary w-full" onClick={() => setIsMenuOpen(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="8" r="5" />
                                            <path d="M20 21a8 8 0 0 0-16 0" />
                                        </svg>
                                        حسابي
                                    </Link>
                                    <button
                                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                        className="btn w-full bg-[var(--error)]/10 text-[var(--error)] border border-[var(--error)]/30 hover:bg-[var(--error)]/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16 17 21 12 16 7" />
                                            <line x1="21" x2="9" y1="12" y2="12" />
                                        </svg>
                                        تسجيل الخروج
                                    </button>
                                </>
                            ) : (
                                <Link href="/auth/login" className="btn btn-secondary w-full" onClick={() => setIsMenuOpen(false)}>
                                    تسجيل الدخول
                                </Link>
                            )}
                            <Link href="/ads/new" className="btn btn-primary w-full" onClick={() => setIsMenuOpen(false)}>
                                أضف إعلانك
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
