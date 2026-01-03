"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
    messagesCount: number;
    isFeatured: boolean;
    category: {
        name: string;
    };
    images?: { imageUrl: string }[];
}

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    createdAt: string;
    totalAds: number;
    activeAds: number;
    rating: number;
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"ads" | "favorites" | "settings">("ads");
    const [myAds, setMyAds] = useState<Ad[]>([]);
    const [favoriteAds, setFavoriteAds] = useState<Ad[]>([]);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchData = async () => {
        if (status === "authenticated" && session?.user?.id) {
            try {
                const userRes = await fetch("/api/users/me");
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUserData(userData.user);
                }

                const adsRes = await fetch(`/api/ads?userId=${session.user.id}`);
                if (adsRes.ok) {
                    const adsData = await adsRes.json();
                    setMyAds(adsData.ads || []);
                }

                const favRes = await fetch("/api/favorites");
                if (favRes.ok) {
                    const favData = await favRes.json();
                    setFavoriteAds(favData.favorites || []);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        if (status !== "loading") {
            fetchData();
        }
    }, [session, status]);

    const handleDeleteAd = async (adId: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;

        setDeletingId(adId);
        try {
            const res = await fetch(`/api/ads/${adId}`, { method: "DELETE" });
            if (res.ok) {
                setMyAds(prev => prev.filter(ad => ad.id !== adId));
            } else {
                alert("حدث خطأ أثناء حذف الإعلان");
            }
        } catch (error) {
            alert("حدث خطأ أثناء حذف الإعلان");
        } finally {
            setDeletingId(null);
        }
    };

    if (status === "loading" || loading) {
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

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
                <Header />
                <main className="flex-1 flex items-center justify-center py-12">
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-8 max-w-md mx-4 text-center">
                        <div className="text-6xl mb-4">🔒</div>
                        <h1 className="text-2xl font-bold mb-2">يجب تسجيل الدخول</h1>
                        <p className="text-[var(--foreground-muted)] mb-6">
                            للوصول إلى ملفك الشخصي، يرجى تسجيل الدخول
                        </p>
                        <Link href="/auth/login" className="btn btn-primary w-full">
                            تسجيل الدخول
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const user = userData || {
        id: session?.user?.id || "",
        name: session?.user?.name || "مستخدم",
        email: session?.user?.email || "",
        phone: (session?.user as any)?.phone || "",
        createdAt: new Date().toISOString(),
        totalAds: 0,
        activeAds: 0,
        rating: 0,
    };

    const tabs = [
        { id: "ads", label: "إعلاناتي", count: myAds.length },
        { id: "favorites", label: "المفضلة", count: favoriteAds.length },
        { id: "settings", label: "الإعدادات", count: null },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ar-SA", { year: "numeric", month: "long" });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-6">
                <div className="container">
                    {/* Profile Header */}
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 mb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white text-4xl font-bold">
                                    {user.name?.charAt(0) || "م"}
                                </div>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                                <p className="text-[var(--foreground-muted)] mb-3">
                                    عضو منذ {formatDate(user.createdAt)}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <div className="text-[var(--foreground-muted)]">
                                        {myAds.length} إعلان نشط
                                    </div>
                                    <div className="flex items-center gap-1 text-[var(--secondary)]">
                                        <span className="text-xs">{user.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/ads/new" className="btn btn-primary">
                                + إعلان جديد
                            </Link>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 bg-[var(--background)] rounded-xl p-1 border border-[var(--border)] overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`px-4 md:px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-[var(--primary)] text-white"
                                    : "hover:bg-[var(--background-secondary)]"
                                    }`}
                            >
                                {tab.label}
                                {tab.count !== null && (
                                    <span className={`mr-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-white/20" : "bg-[var(--background-secondary)]"
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === "ads" && (
                        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
                            <div className="p-4 border-b border-[var(--border)]">
                                <h2 className="font-bold">إعلاناتي</h2>
                            </div>
                            {myAds.length > 0 ? (
                                <div className="divide-y divide-[var(--border)]">
                                    {myAds.map((ad) => (
                                        <div key={ad.id} className="p-4 flex items-center gap-4 hover:bg-[var(--background-secondary)] transition-colors">
                                            {/* Image */}
                                            <div className="w-20 h-20 rounded-xl bg-[var(--background-secondary)] overflow-hidden flex-shrink-0">
                                                {ad.images && ad.images[0] ? (
                                                    <img src={ad.images[0].imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-3xl">📷</div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/ads/${ad.id}`} className="font-semibold hover:text-[var(--primary)] block truncate">
                                                    {ad.title}
                                                </Link>
                                                <div className="text-lg font-bold text-[var(--primary)]">
                                                    {formatPrice(ad.price)}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                                                    <span>📍 {ad.city}</span>
                                                    <span>👁️ {ad.viewsCount}</span>
                                                    <span>{new Date(ad.createdAt).toLocaleDateString('ar-SA')}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/ads/${ad.id}`}
                                                    className="p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20"
                                                    title="عرض"
                                                >
                                                    👁️
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteAd(ad.id)}
                                                    disabled={deletingId === ad.id}
                                                    className="p-2 rounded-lg bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20 disabled:opacity-50"
                                                    title="حذف"
                                                >
                                                    {deletingId === ad.id ? "..." : "🗑️"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="text-5xl mb-4">📝</div>
                                    <h3 className="text-lg font-semibold mb-2">لا توجد إعلانات</h3>
                                    <p className="text-[var(--foreground-muted)] mb-4">
                                        لم تقم بإضافة أي إعلانات بعد
                                    </p>
                                    <Link href="/ads/new" className="btn btn-primary">
                                        أضف إعلانك الأول
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "favorites" && (
                        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
                            <div className="p-4 border-b border-[var(--border)]">
                                <h2 className="font-bold">المفضلة</h2>
                            </div>
                            {favoriteAds.length > 0 ? (
                                <div className="divide-y divide-[var(--border)]">
                                    {favoriteAds.map((fav: any) => {
                                        const ad = fav.ad || fav;
                                        return (
                                            <div key={ad.id} className="p-4 flex items-center gap-4 hover:bg-[var(--background-secondary)]">
                                                <div className="w-20 h-20 rounded-xl bg-[var(--background-secondary)] overflow-hidden flex-shrink-0">
                                                    <div className="w-full h-full flex items-center justify-center text-3xl">📷</div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Link href={`/ads/${ad.id}`} className="font-semibold hover:text-[var(--primary)] block truncate">
                                                        {ad.title}
                                                    </Link>
                                                    <div className="text-lg font-bold text-[var(--primary)]">
                                                        {formatPrice(ad.price)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="text-5xl mb-4">💔</div>
                                    <h3 className="text-lg font-semibold mb-2">لا توجد مفضلات</h3>
                                    <p className="text-[var(--foreground-muted)]">
                                        اضغط على أيقونة القلب في أي إعلان لإضافته للمفضلة
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6">
                            <h2 className="font-bold mb-4">المعلومات الشخصية</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">الاسم</label>
                                    <input type="text" defaultValue={user.name} className="input" readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">رقم الجوال</label>
                                    <input type="tel" defaultValue={user.phone} className="input" readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                                    <input type="email" defaultValue={user.email} className="input" readOnly />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
