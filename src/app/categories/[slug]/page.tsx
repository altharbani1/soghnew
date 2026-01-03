"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { use } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdListItem from "@/components/AdListItem";
import { saudiCities, formatPrice, formatNumber, categories as localCategories, getCategoryBySlug } from "@/lib/data";

interface Ad {
    id: string;
    title: string;
    price: number;
    city: string;
    district?: string;
    createdAt: string;
    viewsCount: number;
    isFeatured: boolean;
    category: {
        name: string;
        slug: string;
    };
    images: { imageUrl: string }[];
}

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
    adCount: number;
    subcategories: {
        id: string;
        name: string;
        slug: string;
        icon?: string;
        adCount: number;
    }[];
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const searchParams = useSearchParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>(searchParams.get('subcategory') || "");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedCity, setSelectedCity] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Fetch category and ads
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Try to fetch category from API
                let categoryData = null;
                try {
                    const catRes = await fetch(`/api/categories/${resolvedParams.slug}`);
                    if (catRes.ok) {
                        const catJson = await catRes.json();
                        categoryData = catJson.category;
                    }
                } catch {
                    // API failed, will use fallback
                }

                // Fallback to local categories if API failed
                if (!categoryData) {
                    const localCat = getCategoryBySlug(resolvedParams.slug);
                    if (localCat) {
                        categoryData = {
                            id: localCat.id,
                            name: localCat.name,
                            slug: localCat.slug,
                            icon: localCat.icon,
                            color: localCat.color,
                            adCount: localCat.count,
                            subcategories: localCat.subcategories?.map(sub => ({
                                id: sub.id,
                                name: sub.name,
                                slug: sub.slug,
                                icon: sub.icon,
                                adCount: sub.count
                            })) || []
                        };
                    }
                }

                setCategory(categoryData);

                // Fetch ads for this category
                let url = `/api/ads?category=${resolvedParams.slug}`;
                if (selectedSubcategory) url += `&subcategory=${selectedSubcategory}`;
                if (selectedCity) url += `&city=${selectedCity}`;
                if (sortBy === "price-low") url += `&sort=price&order=asc`;
                if (sortBy === "price-high") url += `&sort=price&order=desc`;
                if (sortBy === "views") url += `&sort=views`;

                const adsRes = await fetch(url);
                if (adsRes.ok) {
                    const adsData = await adsRes.json();
                    setAds(adsData.ads || []);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [resolvedParams.slug, selectedSubcategory, selectedCity, sortBy]);

    // Drag to scroll for subcategories
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => setIsDragging(false);

    const clearFilters = () => {
        setSelectedSubcategory("");
        setSelectedCity("");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[var(--foreground-muted)]">جاري التحميل...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

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
                            style={{ backgroundColor: category?.color ? `${category.color}15` : "#e2e8f0" }}
                        >
                            {category?.icon || "📦"}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">{category?.name || "جميع الإعلانات"}</h1>
                            <p className="text-[var(--foreground-muted)]">
                                {ads.length} إعلان متاح
                            </p>
                        </div>
                        <Link href="/ads/new" className="btn btn-primary">
                            + أضف إعلان
                        </Link>
                    </div>

                    {/* Subcategories - Swipeable */}
                    {category?.subcategories && category.subcategories.length > 0 && (
                        <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-4 mb-6 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-[var(--foreground-muted)]">
                                    📂 الأقسام الفرعية ({category.subcategories.length})
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-[var(--foreground-muted)]">↔️ اسحب للتصفح</span>
                                    {selectedSubcategory && (
                                        <button
                                            onClick={() => setSelectedSubcategory("")}
                                            className="text-xs text-[var(--primary)] hover:underline"
                                        >
                                            إعادة تعيين
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Scrollable Container */}
                            <div
                                ref={scrollRef}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                className="flex gap-3 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none scrollbar-hide"
                                style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
                            >
                                {/* All Button */}
                                <button
                                    onClick={() => setSelectedSubcategory("")}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-300 flex-shrink-0 ${!selectedSubcategory
                                        ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg"
                                        : "bg-[var(--background-secondary)] hover:bg-[var(--border)]"
                                        }`}
                                >
                                    <span>✨</span>
                                    <span>الكل</span>
                                </button>

                                {/* Subcategory Buttons */}
                                {category.subcategories.map((sub) => (
                                    <button
                                        key={sub.id}
                                        onClick={() => setSelectedSubcategory(sub.slug)}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-300 flex-shrink-0 ${selectedSubcategory === sub.slug
                                            ? "text-white shadow-lg"
                                            : "bg-[var(--background-secondary)] hover:bg-[var(--border)] hover:-translate-y-0.5"
                                            }`}
                                        style={selectedSubcategory === sub.slug ? {
                                            background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`,
                                            boxShadow: `0 4px 14px ${category.color}40`
                                        } : {}}
                                    >
                                        <span>{sub.icon || '📁'}</span>
                                        <span>{sub.name}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${selectedSubcategory === sub.slug
                                            ? "bg-white/25"
                                            : "bg-[var(--border)]"
                                            }`}>
                                            {sub.adCount || 0}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar Filters */}
                        <div className="lg:col-span-1">
                            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-5 sticky top-24">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold">الفلترة</h2>
                                    <button onClick={clearFilters} className="text-sm text-[var(--primary)] hover:underline">
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
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">الترتيب</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="input cursor-pointer"
                                    >
                                        <option value="newest">الأحدث</option>
                                        <option value="price-low">السعر: من الأقل</option>
                                        <option value="price-high">السعر: من الأعلى</option>
                                        <option value="views">الأكثر مشاهدة</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Ads List */}
                        <div className="lg:col-span-3">
                            {/* Results count */}
                            <div className="flex items-center justify-between mb-4 bg-[var(--background)] rounded-xl border border-[var(--border)] p-3">
                                <span className="text-sm text-[var(--foreground-muted)]">
                                    {ads.length} نتيجة
                                </span>
                            </div>

                            {/* Ads List */}
                            {ads.length > 0 ? (
                                <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
                                    {ads.map((ad) => (
                                        <AdListItem
                                            key={ad.id}
                                            id={ad.id}
                                            title={ad.title}
                                            price={ad.price}
                                            location={ad.district ? `${ad.district}, ${ad.city}` : ad.city}
                                            date={new Date(ad.createdAt).toLocaleDateString('ar-SA')}
                                            category={ad.category?.name || category?.name || ""}
                                            featured={ad.isFeatured}
                                            views={ad.viewsCount}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-12 text-center">
                                    <div className="text-5xl mb-4">🔍</div>
                                    <h3 className="text-lg font-semibold mb-2">لا توجد إعلانات</h3>
                                    <p className="text-[var(--foreground-muted)] mb-4">
                                        لا توجد إعلانات في هذا القسم حالياً
                                    </p>
                                    <Link href="/ads/new" className="btn btn-primary">أضف أول إعلان</Link>
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
