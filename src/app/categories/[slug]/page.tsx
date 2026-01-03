"use client";

import { useState } from "react";
import Link from "next/link";
import { use } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdListItem from "@/components/AdListItem";
import { categories, sampleAds, saudiCities, formatNumber, getCategoryBySlug } from "@/lib/data";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const category = getCategoryBySlug(resolvedParams.slug);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedCity, setSelectedCity] = useState("");
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });

    // Filter ads by category
    let filteredAds = sampleAds.filter((ad) => ad.categorySlug === resolvedParams.slug);

    // If no ads for this category, show all (for demo)
    if (filteredAds.length === 0) {
        filteredAds = sampleAds;
    }

    // Apply subcategory filter
    if (selectedSubcategory) {
        filteredAds = filteredAds.filter((ad) => ad.subcategorySlug === selectedSubcategory);
    }

    // Apply city filter
    if (selectedCity) {
        filteredAds = filteredAds.filter((ad) => ad.city === selectedCity);
    }

    // Apply price filter
    if (priceRange.min) {
        filteredAds = filteredAds.filter((ad) => ad.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
        filteredAds = filteredAds.filter((ad) => ad.price <= Number(priceRange.max));
    }

    // Apply sorting
    if (sortBy === "price-low") {
        filteredAds = [...filteredAds].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
        filteredAds = [...filteredAds].sort((a, b) => b.price - a.price);
    } else if (sortBy === "views") {
        filteredAds = [...filteredAds].sort((a, b) => b.views - a.views);
    }

    const clearFilters = () => {
        setSelectedSubcategory("");
        setSelectedCity("");
        setPriceRange({ min: "", max: "" });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-6">
                <div className="container">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-6">
                        <Link href="/" className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
                            الرئيسية
                        </Link>
                        <span className="text-[var(--foreground-muted)]">←</span>
                        <Link href="/categories" className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
                            الأقسام
                        </Link>
                        <span className="text-[var(--foreground-muted)]">←</span>
                        <span className="font-medium">{category?.name || "جميع الإعلانات"}</span>
                    </nav>

                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                            style={{ backgroundColor: category ? `${category.color}15` : "#e2e8f0" }}
                        >
                            {category?.icon || "📦"}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">{category?.name || "جميع الإعلانات"}</h1>
                            <p className="text-[var(--foreground-muted)]">
                                {formatNumber(category?.count || filteredAds.length)} إعلان متاح
                            </p>
                        </div>
                        <Link href="/ads/new" className="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                            أضف إعلان
                        </Link>
                    </div>

                    {/* Subcategories - Modern Design */}
                    {category?.subcategories && category.subcategories.length > 0 && (
                        <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-4 mb-6 shadow-sm">
                            {/* Section Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                                        style={{ backgroundColor: category ? `${category.color}20` : 'var(--background-secondary)' }}
                                    >
                                        📂
                                    </div>
                                    <span className="text-sm font-medium text-[var(--foreground-muted)]">
                                        الأقسام الفرعية ({category.subcategories.length})
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedSubcategory("")}
                                    className="text-xs text-[var(--primary)] hover:underline"
                                >
                                    إعادة تعيين
                                </button>
                            </div>

                            {/* Subcategories Scrollable Container */}
                            <div className="overflow-x-auto pb-2 -mb-2 scrollbar-thin">
                                <div className="flex gap-2 min-w-max">
                                    {/* All Button */}
                                    <button
                                        onClick={() => setSelectedSubcategory("")}
                                        className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-300 ${!selectedSubcategory
                                            ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg shadow-[var(--primary)]/25"
                                            : "bg-[var(--background-secondary)] hover:bg-[var(--border)] text-[var(--foreground)]"
                                            }`}
                                    >
                                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${!selectedSubcategory
                                            ? "bg-white/20"
                                            : "bg-[var(--border)]"
                                            }`}>
                                            ✨
                                        </span>
                                        <span>جميع الإعلانات</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${!selectedSubcategory
                                            ? "bg-white/20 text-white"
                                            : "bg-[var(--primary)]/10 text-[var(--primary)]"
                                            }`}>
                                            {formatNumber(category.count)}
                                        </span>
                                    </button>

                                    {/* Divider */}
                                    <div className="w-px bg-[var(--border)] mx-1" />

                                    {/* Subcategory Buttons */}
                                    {category.subcategories.map((sub, index) => (
                                        <button
                                            key={sub.id}
                                            onClick={() => setSelectedSubcategory(sub.slug)}
                                            className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-300 ${selectedSubcategory === sub.slug
                                                ? "text-white shadow-lg"
                                                : "bg-[var(--background-secondary)] hover:bg-[var(--border)] text-[var(--foreground)] hover:-translate-y-0.5"
                                                }`}
                                            style={selectedSubcategory === sub.slug ? {
                                                background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`,
                                                boxShadow: `0 4px 14px ${category.color}40`
                                            } : {}}
                                        >
                                            {/* Subcategory Icon */}
                                            <span
                                                className={`text-base transition-all group-hover:scale-110 ${selectedSubcategory === sub.slug ? "drop-shadow-md" : ""
                                                    }`}
                                            >
                                                {sub.icon || '📁'}
                                            </span>

                                            <span>{sub.name}</span>

                                            {/* Count badge */}
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all ${selectedSubcategory === sub.slug
                                                ? "bg-white/25 text-white"
                                                : "bg-[var(--border)] text-[var(--foreground-muted)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)]"
                                                }`}>
                                                {formatNumber(sub.count)}
                                            </span>

                                            {/* Active indicator line */}
                                            {selectedSubcategory === sub.slug && (
                                                <span
                                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-white/50"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Selected subcategory info */}
                            {selectedSubcategory && (
                                <div
                                    className="mt-4 p-3 rounded-xl flex items-center justify-between"
                                    style={{ backgroundColor: `${category.color}10` }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: category.color }}
                                        />
                                        <span className="text-sm font-medium">
                                            عرض إعلانات: {category.subcategories.find(s => s.slug === selectedSubcategory)?.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedSubcategory("")}
                                        className="text-xs px-3 py-1 rounded-lg bg-white/80 hover:bg-white transition-colors"
                                        style={{ color: category.color }}
                                    >
                                        ✕ إلغاء الفلتر
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar Filters */}
                        <div className="lg:col-span-1">
                            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-5 sticky top-24">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold">الفلترة</h2>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-[var(--primary)] hover:underline"
                                    >
                                        مسح الكل
                                    </button>
                                </div>

                                {/* City Filter */}
                                <div className="mb-5">
                                    <label className="block text-sm font-medium mb-2">المدينة</label>
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="input cursor-pointer"
                                    >
                                        <option value="">كل المدن</option>
                                        {saudiCities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div className="mb-5">
                                    <label className="block text-sm font-medium mb-2">نطاق السعر</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="من"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
                                            className="input flex-1"
                                        />
                                        <input
                                            type="number"
                                            placeholder="إلى"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange((p) => ({ ...p, max: e.target.value }))}
                                            className="input flex-1"
                                        />
                                    </div>
                                </div>

                                {/* Quick Filters */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">فلترة سريعة</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded" />
                                            <span className="text-sm">إعلانات مميزة فقط</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded" />
                                            <span className="text-sm">مع صور فقط</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded" />
                                            <span className="text-sm">قابل للتفاوض</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ads List */}
                        <div className="lg:col-span-3">
                            {/* Sort Bar */}
                            <div className="flex items-center justify-between mb-4 bg-[var(--background)] rounded-xl border border-[var(--border)] p-3">
                                <span className="text-sm text-[var(--foreground-muted)]">
                                    {filteredAds.length} نتيجة
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-[var(--foreground-muted)]">ترتيب حسب:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="input py-2 px-3 w-auto cursor-pointer"
                                    >
                                        <option value="newest">الأحدث</option>
                                        <option value="price-low">السعر: من الأقل</option>
                                        <option value="price-high">السعر: من الأعلى</option>
                                        <option value="views">الأكثر مشاهدة</option>
                                    </select>
                                </div>
                            </div>

                            {/* Ads */}
                            {filteredAds.length > 0 ? (
                                <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
                                    {filteredAds.map((ad) => (
                                        <AdListItem
                                            key={ad.id}
                                            id={ad.id}
                                            title={ad.title}
                                            price={ad.price}
                                            location={ad.location}
                                            date={ad.date}
                                            category={ad.category}
                                            featured={ad.featured}
                                            views={ad.views}
                                            commentsCount={Math.floor(Math.random() * 10)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-12 text-center">
                                    <div className="text-5xl mb-4">🔍</div>
                                    <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
                                    <p className="text-[var(--foreground-muted)]">
                                        حاول تغيير معايير البحث أو الفلترة
                                    </p>
                                </div>
                            )}

                            {/* Pagination */}
                            {filteredAds.length > 0 && (
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <button className="btn btn-secondary px-4 py-2" disabled>
                                        السابق
                                    </button>
                                    <button className="w-10 h-10 rounded-lg bg-[var(--primary)] text-white font-medium">1</button>
                                    <button className="w-10 h-10 rounded-lg hover:bg-[var(--background-secondary)]">2</button>
                                    <button className="w-10 h-10 rounded-lg hover:bg-[var(--background-secondary)]">3</button>
                                    <span className="px-2">...</span>
                                    <button className="w-10 h-10 rounded-lg hover:bg-[var(--background-secondary)]">10</button>
                                    <button className="btn btn-secondary px-4 py-2">
                                        التالي
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
