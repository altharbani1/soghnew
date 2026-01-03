"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdListItem from "@/components/AdListItem";
import { saudiCities } from "@/lib/data";

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
    };
}

export default function AllAdsPage() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("newest");
    const [selectedCity, setSelectedCity] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        async function fetchAds() {
            setLoading(true);
            try {
                let url = `/api/ads?limit=30&page=${page}`;
                if (selectedCity) url += `&city=${selectedCity}`;
                if (sortBy === "price-low") url += `&sortBy=price&sortOrder=asc`;
                if (sortBy === "price-high") url += `&sortBy=price&sortOrder=desc`;
                if (sortBy === "views") url += `&sortBy=viewsCount&sortOrder=desc`;

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    if (page === 1) {
                        setAds(data.ads || []);
                    } else {
                        setAds(prev => [...prev, ...(data.ads || [])]);
                    }
                    setHasMore((data.ads || []).length === 30);
                }
            } catch (error) {
                console.error("Error fetching ads:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAds();
    }, [sortBy, selectedCity, page]);

    const handleFilterChange = () => {
        setPage(1);
        setAds([]);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-6">
                <div className="container">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">جميع الإعلانات</h1>
                            <p className="text-sm text-[var(--foreground-muted)]">
                                تصفح أحدث الإعلانات المنشورة
                            </p>
                        </div>
                        <Link href="/ads/new" className="btn btn-primary text-center">
                            ➕ أضف إعلان
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">المدينة</label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => { setSelectedCity(e.target.value); handleFilterChange(); }}
                                    className="input cursor-pointer"
                                >
                                    <option value="">كل المدن</option>
                                    {saudiCities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">الترتيب</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => { setSortBy(e.target.value); handleFilterChange(); }}
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
                    {loading && page === 1 ? (
                        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-12 text-center">
                            <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-[var(--foreground-muted)]">جاري تحميل الإعلانات...</p>
                        </div>
                    ) : ads.length > 0 ? (
                        <>
                            <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden mb-4">
                                <div className="p-3 border-b border-[var(--border)] text-sm text-[var(--foreground-muted)]">
                                    عدد النتائج: {ads.length} إعلان
                                </div>
                                {ads.map((ad) => (
                                    <AdListItem
                                        key={ad.id}
                                        id={ad.id}
                                        title={ad.title}
                                        price={ad.price}
                                        location={ad.district ? `${ad.district}, ${ad.city}` : ad.city}
                                        date={new Date(ad.createdAt).toLocaleDateString('ar-SA')}
                                        category={ad.category?.name || ""}
                                        featured={ad.isFeatured}
                                        views={ad.viewsCount}
                                    />
                                ))}
                            </div>

                            {/* Load More */}
                            {hasMore && (
                                <div className="text-center">
                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={loading}
                                        className="btn btn-secondary disabled:opacity-50"
                                    >
                                        {loading ? "جاري التحميل..." : "تحميل المزيد"}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-12 text-center">
                            <div className="text-5xl mb-4">📭</div>
                            <h3 className="text-lg font-semibold mb-2">لا توجد إعلانات</h3>
                            <p className="text-[var(--foreground-muted)] mb-4">
                                لم يتم العثور على أي إعلانات
                            </p>
                            <Link href="/ads/new" className="btn btn-primary">أضف أول إعلان</Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
