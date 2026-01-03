"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { name: "الرئيسية", href: "/", icon: "home" },
    { name: "الأقسام", href: "/categories", icon: "grid" },
    { name: "أضف", href: "/ads/new", icon: "plus", primary: true },
    { name: "الرسائل", href: "/messages", icon: "message" },
    { name: "حسابي", href: "/profile", icon: "user" },
];

const icons: Record<string, React.ReactNode> = {
    home: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    ),
    grid: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
    ),
    plus: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    ),
    message: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    ),
    user: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
    ),
};

export default function MobileNav() {
    const pathname = usePathname();

    // Don't show on admin pages
    if (pathname.startsWith("/admin")) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--background)] border-t border-[var(--border)] md:hidden safe-area-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                    if (item.primary) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center justify-center w-14 h-14 -mt-6 rounded-full gradient-primary text-white shadow-lg shadow-[var(--primary)]/30 transition-transform active:scale-95"
                            >
                                {icons[item.icon]}
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${isActive ? "text-[var(--primary)]" : "text-[var(--foreground-muted)]"
                                }`}
                        >
                            <span className="relative">
                                {icons[item.icon]}
                                {item.icon === "message" && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--error)]"></span>
                                )}
                            </span>
                            <span className="text-xs mt-1 font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
