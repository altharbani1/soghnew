import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const sections = [
        {
            title: "الأقسام الرئيسية",
            links: [
                { name: "سيارات", href: "/categories/cars" },
                { name: "عقارات", href: "/categories/realestate" },
                { name: "الكترونيات", href: "/categories/electronics" },
                { name: "أثاث", href: "/categories/furniture" },
                { name: "أزياء", href: "/categories/fashion" },
            ],
        },
        {
            title: "روابط مفيدة",
            links: [
                { name: "كيف تبيع؟", href: "/help/sell" },
                { name: "كيف تشتري؟", href: "/help/buy" },
                { name: "نصائح الأمان", href: "/help/safety" },
                { name: "الأسئلة الشائعة", href: "/help/faq" },
            ],
        },
        {
            title: "عن سوقه",
            links: [
                { name: "من نحن", href: "/about" },
                { name: "تواصل معنا", href: "/contact" },
                { name: "الشروط والأحكام", href: "/terms" },
                { name: "سياسة الخصوصية", href: "/privacy" },
            ],
        },
    ];

    return (
        <footer className="bg-[var(--background-secondary)] border-t border-[var(--border)] mt-auto">
            <div className="container py-12">
                {/* Main Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-xl">
                                س
                            </div>
                            <span className="text-2xl font-bold">سوقه</span>
                        </Link>
                        <p className="text-[var(--foreground-muted)] mb-4 leading-relaxed">
                            منصة سوقه للإعلانات المبوبة - وجهتك الأولى للبيع والشراء في المملكة العربية السعودية
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h4 className="font-bold mb-4">{section.title}</h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* App Download */}
                <div className="mt-10 pt-8 border-t border-[var(--border)]">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-[var(--foreground-muted)]">
                            حمّل تطبيق سوقه الآن
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <div className="text-right">
                                    <div className="text-xs opacity-75">حمّل من</div>
                                    <div className="text-sm font-semibold">App Store</div>
                                </div>
                            </a>
                            <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.609 1.814a1 1 0 0 0-.474.251c-.198.207-.135-.046.009-.029l-.01.009v19.91l.01.008c-.144.017-.207-.236-.01-.029a1 1 0 0 0 .475.252l9.07-10.186L3.608 1.814zm11.31 8.093l-2.06-2.06 7.568-4.349a1 1 0 0 0-.09-.05l-.072-.035a1 1 0 0 0-.895.002l-7.568 4.349 3.117 2.143zm-2.06 4.186l2.06-2.06 3.118 2.143 7.568 4.349a1 1 0 0 0 .895.002l.072-.035a1 1 0 0 0 .09-.05l-7.568-4.349-6.235 0zm2.06-2.06l-3.117-2.142 3.117-2.143 6.235 4.285-6.235 4.285-3.117-2.143 3.117-2.142z" />
                                </svg>
                                <div className="text-right">
                                    <div className="text-xs opacity-75">حمّل من</div>
                                    <div className="text-sm font-semibold">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-[var(--border)] text-center text-[var(--foreground-muted)]">
                    <p>© {currentYear} سوقه. جميع الحقوق محفوظة</p>
                </div>
            </div>
        </footer>
    );
}
