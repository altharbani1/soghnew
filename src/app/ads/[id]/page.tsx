"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/data";
import { use } from "react";

interface Ad {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    priceType: string;
    city: string;
    district?: string;
    contactPhone: string;
    contactWhatsapp?: string;
    viewsCount: number;
    isFeatured: boolean;
    createdAt: string;
    category: {
        name: string;
        slug: string;
    };
    subcategory?: {
        name: string;
    };
    user: {
        id: string;
        name: string;
        phone: string;
        avatar?: string;
    };
    images: {
        id: string;
        imageUrl: string;
        isPrimary: boolean;
    }[];
}

export default function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        async function fetchAd() {
            try {
                const res = await fetch(`/api/ads/${resolvedParams.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setAd(data.ad);
                } else {
                    setError("الإعلان غير موجود");
                }
            } catch (err) {
                setError("حدث خطأ أثناء تحميل الإعلان");
            } finally {
                setLoading(false);
            }
        }

        fetchAd();
    }, [resolvedParams.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[var(--foreground-muted)]">جاري تحميل الإعلان...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !ad) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
                <Header />
                <main className="flex-1 flex items-center justify-center py-12">
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-8 max-w-md mx-4 text-center">
                        <div className="text-6xl mb-4">😕</div>
                        <h1 className="text-2xl font-bold mb-2">الإعلان غير موجود</h1>
                        <p className="text-[var(--foreground-muted)] mb-6">{error || "قد يكون الإعلان محذوفاً أو منتهي الصلاحية"}</p>
                        <Link href="/" className="btn btn-primary">
                            العودة للرئيسية
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const images = ad.images?.length > 0
        ? ad.images.map(img => img.imageUrl)
        : ["https://via.placeholder.com/800x600?text=لا+توجد+صورة"];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-6">
                <div className="container">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-6">
                        <Link href="/" className="hover:text-[var(--primary)]">الرئيسية</Link>
                        <span>←</span>
                        <Link href={`/categories/${ad.category.slug}`} className="hover:text-[var(--primary)]">{ad.category.name}</Link>
                        <span>←</span>
                        <span className="text-[var(--foreground)]">{ad.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Ad Info Card */}
                            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                                {/* Title & Meta */}
                                <div className="p-6 border-b border-[var(--border)]">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <h1 className="text-2xl font-bold">{ad.title}</h1>
                                        <div className="flex gap-2">
                                            {ad.isFeatured && (
                                                <span className="badge badge-warning">⭐ مميز</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--foreground-muted)]">
                                        <span className="badge badge-primary">{ad.category.name}</span>
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            {ad.district ? `${ad.district}، ${ad.city}` : ad.city}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            {formatDate(ad.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            {ad.viewsCount} مشاهدة
                                        </span>
                                    </div>
                                </div>

                                {/* Image Gallery */}
                                <div className="p-6 border-b border-[var(--border)]">
                                    {/* Main Image */}
                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--background-secondary)] mb-4">
                                        <Image
                                            src={images[selectedImage]}
                                            alt={ad.title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                    {/* Thumbnails */}
                                    {images.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedImage(idx)}
                                                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === idx
                                                        ? "border-[var(--primary)]"
                                                        : "border-transparent opacity-70 hover:opacity-100"
                                                        }`}
                                                >
                                                    <Image src={img} alt="" fill className="object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="p-6">
                                    <h2 className="font-bold text-lg mb-3">تفاصيل الإعلان</h2>
                                    <p className="text-[var(--foreground-muted)] leading-relaxed whitespace-pre-line">
                                        {ad.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Price Card */}
                            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 sticky top-24">
                                <div className="text-center mb-6">
                                    <div className="text-sm text-[var(--foreground-muted)] mb-1">السعر</div>
                                    <div className="text-3xl font-bold text-[var(--primary)]">
                                        {formatPrice(ad.price)}
                                    </div>
                                    {ad.priceType === "negotiable" && (
                                        <div className="text-sm text-[var(--foreground-muted)]">قابل للتفاوض</div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <a
                                        href={`tel:${ad.contactPhone}`}
                                        className="btn btn-primary w-full"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                        اتصال ({ad.contactPhone})
                                    </a>
                                    <a
                                        href={`https://wa.me/966${ad.contactPhone.slice(1)}`}
                                        target="_blank"
                                        className="btn btn-secondary w-full bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                                        </svg>
                                        واتساب
                                    </a>
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`btn w-full ${isFavorite ? 'btn-primary' : 'btn-secondary'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                        </svg>
                                        {isFavorite ? "تم الحفظ" : "حفظ في المفضلة"}
                                    </button>
                                </div>

                                {/* Seller Info */}
                                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-lg">
                                            {ad.user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold">{ad.user.name}</div>
                                            <div className="text-sm text-[var(--foreground-muted)]">صاحب الإعلان</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Warning */}
                                <div className="mt-6 p-4 rounded-xl bg-[var(--warning)]/10 text-[var(--warning)] text-sm">
                                    <div className="font-semibold mb-1">⚠️ نصائح الأمان</div>
                                    <ul className="text-xs space-y-1 opacity-90">
                                        <li>• لا تدفع مقدماً قبل المعاينة</li>
                                        <li>• قابل البائع في مكان عام</li>
                                        <li>• تأكد من صحة المنتج قبل الشراء</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
