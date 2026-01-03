"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/data";
import { RatingModal, RatingDisplay } from "@/components/RatingModal";
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
    userId: string;
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
    const { data: session } = useSession();
    const router = useRouter();
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);

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

    const handleDelete = async () => {
        if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/ads/${ad?.id}`, { method: "DELETE" });
            if (res.ok) {
                alert("تم حذف الإعلان بنجاح");
                router.push("/profile");
            } else {
                alert("حدث خطأ أثناء حذف الإعلان");
            }
        } catch (error) {
            alert("حدث خطأ أثناء حذف الإعلان");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRefresh = async () => {
        // Refresh ad (bump to top)
        try {
            const res = await fetch(`/api/ads/${ad?.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...ad })
            });
            if (res.ok) {
                alert("تم تحديث الإعلان بنجاح");
                window.location.reload();
            }
        } catch (error) {
            alert("حدث خطأ أثناء تحديث الإعلان");
        }
    };

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

    const isOwner = session?.user?.id === ad.userId;

    const images = ad.images?.length > 0
        ? ad.images.map(img => img.imageUrl)
        : [];

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
                            {/* Ad Info Card - Details First */}
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
                                            📍 {ad.district ? `${ad.district}، ${ad.city}` : ad.city}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            🕐 {formatDate(ad.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            👁️ {ad.viewsCount} مشاهدة
                                        </span>
                                        <span className="flex items-center gap-1 bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 rounded-lg">
                                            🔢 رقم الإعلان: {ad.id.slice(-8).toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Description - Before Images */}
                                <div className="p-6 border-b border-[var(--border)]">
                                    <h2 className="font-bold text-lg mb-3">تفاصيل الإعلان</h2>
                                    <p className="text-[var(--foreground-muted)] leading-relaxed whitespace-pre-line">
                                        {ad.description || "لا يوجد وصف لهذا الإعلان"}
                                    </p>
                                </div>

                                {/* Image Gallery - After Description */}
                                {images.length > 0 && (
                                    <div className="p-6">
                                        <h2 className="font-bold text-lg mb-3">صور الإعلان</h2>
                                        {/* Main Image */}
                                        <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--background-secondary)] mb-4">
                                            <img
                                                src={images[selectedImage]}
                                                alt={ad.title}
                                                className="w-full h-full object-cover"
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
                                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* No Images Message */}
                                {images.length === 0 && (
                                    <div className="p-6 text-center">
                                        <div className="text-4xl mb-2">📷</div>
                                        <p className="text-[var(--foreground-muted)]">لا توجد صور لهذا الإعلان</p>
                                    </div>
                                )}
                            </div>

                            {/* Owner Actions - At the End */}
                            {isOwner && (
                                <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6">
                                    <h2 className="font-bold text-lg mb-4">إدارة الإعلان</h2>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={handleRefresh}
                                            className="btn btn-secondary flex-1"
                                        >
                                            🔄 تحديث الإعلان
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="btn bg-[var(--error)] text-white hover:opacity-80 flex-1 disabled:opacity-50"
                                        >
                                            {isDeleting ? "جاري الحذف..." : "🗑️ حذف الإعلان"}
                                        </button>
                                    </div>
                                    <p className="text-sm text-[var(--foreground-muted)] mt-3">
                                        هذه الخيارات متاحة لك فقط كصاحب الإعلان
                                    </p>
                                </div>
                            )}
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
                                        📞 اتصال ({ad.contactPhone})
                                    </a>
                                    <a
                                        href={`https://wa.me/966${ad.contactPhone.slice(1)}`}
                                        target="_blank"
                                        className="btn btn-secondary w-full bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/20"
                                    >
                                        💬 واتساب
                                    </a>
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`btn w-full ${isFavorite ? 'btn-primary' : 'btn-secondary'}`}
                                    >
                                        {isFavorite ? "❤️ تم الحفظ" : "🤍 حفظ في المفضلة"}
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
                                    {/* Rate Seller Button */}
                                    {!isOwner && (
                                        <button
                                            onClick={() => setShowRatingModal(true)}
                                            className="btn btn-secondary w-full mt-3"
                                        >
                                            ⭐ تقييم البائع
                                        </button>
                                    )}
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

            {/* Rating Modal */}
            {showRatingModal && (
                <RatingModal
                    userId={ad.userId}
                    userName={ad.user.name}
                    onClose={() => setShowRatingModal(false)}
                    onSuccess={() => alert("تم إضافة تقييمك بنجاح!")}
                />
            )}
        </div>
    );
}

