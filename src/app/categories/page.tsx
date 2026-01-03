"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories, formatNumber, Category } from "@/lib/data";

export default function CategoriesPage() {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter categories and subcategories based on search
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;

        const query = searchQuery.toLowerCase();
        return categories.map(cat => {
            const matchesCategory = cat.name.toLowerCase().includes(query);
            const matchingSubcategories = cat.subcategories?.filter(sub =>
                sub.name.toLowerCase().includes(query)
            );

            if (matchesCategory) return cat;
            if (matchingSubcategories && matchingSubcategories.length > 0) {
                return { ...cat, subcategories: matchingSubcategories };
            }
            return null;
        }).filter((cat): cat is Category => cat !== null);
    }, [searchQuery]);

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-8">
                <div className="container">
                    {/* Header with animated gradient */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 px-4 py-2 rounded-full mb-4">
                            <span className="text-lg">📂</span>
                            <span className="text-sm font-medium text-[var(--primary)]">اكتشف جميع الأقسام</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                            تصفح الأقسام
                        </h1>
                        <p className="text-[var(--foreground-muted)] text-lg max-w-md mx-auto mb-6">
                            اختر القسم المناسب لك من بين {categories.length} قسم رئيسي
                        </p>

                        {/* Search Box */}
                        <div className="max-w-xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="ابحث في الأقسام..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-5 py-4 pr-12 rounded-2xl bg-[var(--background)] border-2 border-[var(--border)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all text-lg placeholder:text-[var(--foreground-muted)]"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-[var(--foreground-muted)]"
                                    >
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.3-4.3" />
                                    </svg>
                                </div>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            {searchQuery && (
                                <p className="text-sm text-[var(--foreground-muted)] mt-2">
                                    تم العثور على {filteredCategories.length} قسم
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Main Categories Grid - Modern Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCategories.map((category) => {
                            const isExpanded = expandedCategory === category.id;
                            const subcategoriesToShow = isExpanded
                                ? category.subcategories
                                : category.subcategories?.slice(0, 8);

                            return (
                                <div
                                    key={category.id}
                                    className="group bg-[var(--background)] rounded-3xl border border-[var(--border)] overflow-hidden hover:shadow-2xl hover:shadow-[var(--primary)]/10 transition-all duration-500 hover:-translate-y-1"
                                >
                                    {/* Category Header with Gradient */}
                                    <div
                                        className="relative p-6 overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, ${category.color}08 0%, ${category.color}15 100%)`
                                        }}
                                    >
                                        {/* Background Pattern */}
                                        <div
                                            className="absolute inset-0 opacity-5"
                                            style={{
                                                backgroundImage: `radial-gradient(circle at 20% 50%, ${category.color} 1px, transparent 1px)`,
                                                backgroundSize: '20px 20px'
                                            }}
                                        />

                                        <Link
                                            href={`/categories/${category.slug}`}
                                            className="relative flex items-center gap-4"
                                        >
                                            {/* Animated Icon Container */}
                                            <div
                                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                                                style={{
                                                    backgroundColor: category.color,
                                                    boxShadow: `0 8px 24px ${category.color}40`
                                                }}
                                            >
                                                <span className="filter drop-shadow-lg">{category.icon}</span>
                                            </div>

                                            <div className="flex-1">
                                                <h2 className="text-xl font-bold mb-1 group-hover:text-[var(--primary)] transition-colors">
                                                    {category.name}
                                                </h2>
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className="text-sm font-semibold px-2 py-0.5 rounded-full"
                                                        style={{
                                                            backgroundColor: `${category.color}20`,
                                                            color: category.color
                                                        }}
                                                    >
                                                        {formatNumber(category.count)} إعلان
                                                    </span>
                                                    <span className="text-xs text-[var(--foreground-muted)]">
                                                        {category.subcategories?.length || 0} قسم فرعي
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Arrow Icon */}
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
                                                style={{ backgroundColor: `${category.color}15` }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke={category.color}
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="m15 18-6-6 6-6" />
                                                </svg>
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Subcategories Grid */}
                                    {category.subcategories && category.subcategories.length > 0 && (
                                        <div className="p-5 pt-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wide">
                                                    الأقسام الفرعية
                                                </span>
                                                {(category.subcategories?.length || 0) > 8 && (
                                                    <button
                                                        onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                                                        className="text-xs font-medium text-[var(--primary)] hover:underline"
                                                    >
                                                        {isExpanded ? 'عرض أقل' : `عرض الكل (${category.subcategories?.length})`}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                {subcategoriesToShow?.map((sub) => (
                                                    <Link
                                                        key={sub.id}
                                                        href={`/categories/${category.slug}?subcategory=${sub.slug}`}
                                                        className="group/sub relative flex items-center gap-3 p-3 rounded-xl bg-[var(--background-secondary)] hover:bg-gradient-to-r hover:from-[var(--primary)]/5 hover:to-[var(--primary)]/10 border border-transparent hover:border-[var(--primary)]/20 transition-all duration-300 hover:-translate-y-0.5"
                                                        onMouseEnter={() => setHoveredSubcategory(sub.id)}
                                                        onMouseLeave={() => setHoveredSubcategory(null)}
                                                    >
                                                        {/* Subcategory Icon */}
                                                        <div
                                                            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg group-hover/sub:scale-110 transition-all duration-300"
                                                            style={{
                                                                backgroundColor: `${category.color}15`,
                                                            }}
                                                        >
                                                            {sub.icon || '📁'}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-sm font-medium truncate block group-hover/sub:text-[var(--primary)] transition-colors">
                                                                {sub.name}
                                                            </span>
                                                        </div>

                                                        {/* Count badge */}
                                                        <span
                                                            className={`text-xs font-medium px-2 py-0.5 rounded-full transition-all ${hoveredSubcategory === sub.id
                                                                ? 'bg-[var(--primary)] text-white scale-110'
                                                                : 'bg-[var(--border)] text-[var(--foreground-muted)]'
                                                                }`}
                                                        >
                                                            {formatNumber(sub.count)}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* View All Link */}
                                            <Link
                                                href={`/categories/${category.slug}`}
                                                className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-all group/all"
                                            >
                                                <span className="text-sm font-medium">تصفح جميع إعلانات {category.name}</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="group-hover/all:translate-x-1 transition-transform"
                                                >
                                                    <path d="m15 18-6-6 6-6" />
                                                </svg>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Stats Section with Glassmorphism */}
                    <div className="mt-16 relative">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 via-[var(--secondary)]/5 to-[var(--accent)]/5 rounded-3xl" />

                        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
                            <div className="bg-[var(--background)]/80 backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 text-center hover:scale-105 transition-transform cursor-default">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white text-xl">
                                    📁
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                                    {categories.length}
                                </div>
                                <div className="text-[var(--foreground-muted)] text-sm mt-1">قسم رئيسي</div>
                            </div>

                            <div className="bg-[var(--background)]/80 backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 text-center hover:scale-105 transition-transform cursor-default">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-dark)] flex items-center justify-center text-white text-xl">
                                    📂
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] bg-clip-text text-transparent">
                                    {categories.reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0)}
                                </div>
                                <div className="text-[var(--foreground-muted)] text-sm mt-1">قسم فرعي</div>
                            </div>

                            <div className="bg-[var(--background)]/80 backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 text-center hover:scale-105 transition-transform cursor-default">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center text-white text-xl">
                                    📢
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] bg-clip-text text-transparent">
                                    {formatNumber(categories.reduce((acc, cat) => acc + cat.count, 0))}
                                </div>
                                <div className="text-[var(--foreground-muted)] text-sm mt-1">إعلان نشط</div>
                            </div>

                            <div className="bg-[var(--background)]/80 backdrop-blur-xl rounded-2xl border border-[var(--border)] p-6 text-center hover:scale-105 transition-transform cursor-default">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl">
                                    👥
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    +50K
                                </div>
                                <div className="text-[var(--foreground-muted)] text-sm mt-1">مستخدم نشط</div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-12 text-center">
                        <div className="inline-flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/ads/new"
                                className="btn bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-2">
                                    <path d="M5 12h14" />
                                    <path d="M12 5v14" />
                                </svg>
                                أضف إعلانك الآن
                            </Link>
                            <Link
                                href="/"
                                className="btn bg-[var(--background)] border-2 border-[var(--border)] px-8 py-4 rounded-xl font-bold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                            >
                                العودة للرئيسية
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
