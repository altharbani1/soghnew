"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/data";

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

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        async function fetchAds() {
            if (!query) {
                setAds([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/ads?search=${encodeURIComponent(query)}&limit=50`);
                if (res.ok) {
                    const data = await res.json();
                    setAds(data.ads || []);
                    setTotal(data.pagination?.total || 0);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAds();
    }, [query]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[var(--foreground-muted)]">جاري البحث...</p>
                </div>
            </div>
        );
    }

    if (!query) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-bold mb-2">أدخل كلمة للبحث</h2>
                <p className="text-[var(--foreground-muted)]">ابحث عن سيارات، عقارات، إلكترونيات والمزيد</p>
            </div>
        );
    }

    if (ads.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-xl font-bold mb-2">لا توجد نتائج لـ "{query}"</h2>
                <p className="text-[var(--foreground-muted)] mb-6">جرب كلمات بحث مختلفة</p>
                <Link href="/" className="btn btn-primary">
                    العودة للرئيسية
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">نتائج البحث: "{query}"</h1>
                <p className="text-[var(--foreground-muted)]">تم العثور على {total} إعلان</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ads.map((ad) => (
                    <Link
                        key={ad.id}
                        href={`/ads/${ad.id}`}
                        className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden hover:border-[var(--primary)] hover:shadow-lg transition-all"
                    >
                        {/* Image */}
                        <div className="aspect-video bg-[var(--background-secondary)] relative">
                            {ad.images?.[0] ? (
                                <img src={ad.images[0].imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">📷</div>
                            )}
                            {ad.isFeatured && (
                                <span className="absolute top-2 right-2 px-2 py-1 bg-[var(--warning)] text-white text-xs rounded-lg">
                                    ⭐ مميز
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <h3 className="font-semibold mb-2 truncate">{ad.title}</h3>
                            <div className="text-lg font-bold text-[var(--primary)] mb-2">
                                {formatPrice(ad.price)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                                <span>📍 {ad.city}</span>
                                <span>•</span>
                                <span>👁️ {ad.viewsCount}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-8">
                <div className="container">
                    <Suspense fallback={
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    }>
                        <SearchResults />
                    </Suspense>
                </div>
            </main>

            <Footer />
        </div>
    );
}
