"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/data";
import { RatingModal, RatingDisplay } from "@/components/RatingModal";

interface Ad {
    id: string;
    title: string;
    slug: string | null;
    description: string;
    price: number;
    priceType: string;
    city: string;
    district?: string | null;
    contactPhone: string;
    contactWhatsapp?: string | null;
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
    } | null;
    user: {
        id: string;
        name: string;
        phone: string;
        avatar?: string | null;
        rating: number;
        totalReviews: number;
    };
    images: {
        id: string;
        imageUrl: string;
        isPrimary: boolean;
    }[];
}

interface Props {
    ad: Ad;
}

export function AdDetailClient({ ad }: Props) {
    const { data: session } = useSession();
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);

    const handleDelete = async () => {
        if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/ads/${ad.id}`, { method: "DELETE" });
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
        try {
            const res = await fetch(`/api/ads/${ad.id}`, {
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
                                            📍 {ad.district ? `${ad.district}، ${ad.city}` : ad.city}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            🕐 {formatDate(ad.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            👁️ {ad.viewsCount} مشاهدة
                                        </span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/5 to-transparent">
                                    <div className="text-3xl font-bold text-[var(--primary)]">
                                        {formatPrice(ad.price)}
                                        {ad.priceType === "negotiable" && (
                                            <span className="text-sm font-normal text-[var(--foreground-muted)] mr-2">(قابل للتفاوض)</span>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="p-6">
                                    <h2 className="font-bold text-lg mb-4">تفاصيل الإعلان</h2>
                                    <p className="whitespace-pre-wrap text-[var(--foreground-muted)] leading-relaxed">
                                        {ad.description}
                                    </p>
                                </div>
                            </div>

                            {/* Images Gallery */}
                            {images.length > 0 && (
                                <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                                    <div className="p-4 border-b border-[var(--border)]">
                                        <h2 className="font-bold">صور الإعلان</h2>
                                    </div>
                                    <div className="p-4">
                                        {/* Main Image */}
                                        <div className="aspect-video rounded-xl overflow-hidden bg-[var(--background-secondary)] mb-4 relative">
                                            <img
                                                src={images[selectedImage]}
                                                alt={ad.title}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        {/* Thumbnails */}
                                        {images.length > 1 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {images.map((image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSelectedImage(index)}
                                                        className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${index === selectedImage ? "border-[var(--primary)]" : "border-transparent"
                                                            }`}
                                                    >
                                                        <img src={image} alt="" className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Contact Card */}
                            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 sticky top-6">
                                <h3 className="font-bold text-lg mb-4">معلومات الاتصال</h3>

                                <div className="space-y-3">
                                    <a
                                        href={`tel:${ad.contactPhone}`}
                                        className="btn btn-primary w-full flex items-center justify-center gap-2"
                                    >
                                        📞 اتصال
                                    </a>
                                    {ad.contactWhatsapp && (
                                        <a
                                            href={`https://wa.me/966${ad.contactWhatsapp.replace(/^0/, "")}`}
                                            target="_blank"
                                            className="btn btn-secondary w-full flex items-center justify-center gap-2 !bg-[#25D366] !text-white !border-[#25D366]"
                                        >
                                            واتساب
                                        </a>
                                    )}
                                </div>

                                {/* Owner Actions */}
                                {isOwner && (
                                    <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
                                        <Link
                                            href={`/ads/${ad.slug || ad.id}/edit`} // Use slug if available
                                            className="btn btn-primary w-full text-sm flex items-center justify-center gap-2"
                                        >
                                            ✏️ تعديل الإعلان
                                        </Link>
                                        <button onClick={handleRefresh} className="btn btn-secondary w-full text-sm">
                                            🔄 تحديث الإعلان
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="btn w-full text-sm bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30"
                                        >
                                            {isDeleting ? "جاري الحذف..." : "🗑️ حذف الإعلان"}
                                        </button>
                                    </div>
                                )}

                                {/* Seller Info */}
                                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                                    <Link href={`/users/${ad.userId}`} className="flex items-center gap-3 mb-3 hover:bg-[var(--background-secondary)] p-2 -m-2 rounded-xl transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-lg">
                                            {ad.user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold hover:text-[var(--primary)] transition-colors">{ad.user.name}</div>
                                            <div className="text-sm text-[var(--foreground-muted)]">عرض الملف الشخصي</div>
                                        </div>
                                        <span className="text-[var(--foreground-muted)]">←</span>
                                    </Link>

                                    {/* Rating Display */}
                                    {ad.user.totalReviews > 0 && (
                                        <div className="mb-3">
                                            <RatingDisplay
                                                rating={ad.user.rating}
                                                totalReviews={ad.user.totalReviews}
                                                size="sm"
                                            />
                                        </div>
                                    )}

                                    {/* Rate Seller Button */}
                                    {!isOwner && session && (
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
                    onSuccess={() => {
                        setShowRatingModal(false);
                        alert("شكراً لتقييمك!");
                    }}
                />
            )}
        </div>
    );
}
