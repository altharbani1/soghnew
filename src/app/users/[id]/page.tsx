"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdListItem from "@/components/AdListItem";
import { RatingDisplay } from "@/components/RatingModal";

interface User {
    id: string;
    name: string;
    avatar?: string;
    city?: string;
    bio?: string;
    rating: number;
    totalReviews: number;
    totalAds: number;
    badges: string[];
    createdAt: string;
}

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

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [user, setUser] = useState<User | null>(null);
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch user details
                const userRes = await fetch(`/api/users/${resolvedParams.id}`);
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData.user);
                }

                // Fetch user's ads
                const adsRes = await fetch(`/api/ads?userId=${resolvedParams.id}`);
                if (adsRes.ok) {
                    const adsData = await adsRes.json();
                    setAds(adsData.ads || []);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [resolvedParams.id]);

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

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
                <Header />
                <main className="flex-1 flex items-center justify-center py-12">
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-8 max-w-md mx-4 text-center">
                        <div className="text-6xl mb-4">👤</div>
                        <h1 className="text-2xl font-bold mb-2">المستخدم غير موجود</h1>
                        <p className="text-[var(--foreground-muted)] mb-6">
                            لا يمكن العثور على هذا المستخدم
                        </p>
                        <Link href="/" className="btn btn-primary">
                            العودة للرئيسية
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const memberSince = new Date(user.createdAt).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long'
    });

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-6">
                <div className="container max-w-4xl">
                    {/* User Profile Card */}
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Avatar */}
                                <div className="w-24 h-24 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-4xl font-bold">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        user.name.charAt(0)
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-center md:text-right">
                                    <h1 className="text-2xl font-bold mb-2">{user.name}</h1>

                                    {/* Rating */}
                                    <div className="mb-3">
                                        <RatingDisplay
                                            rating={user.rating}
                                            totalReviews={user.totalReviews}
                                            size="md"
                                        />
                                    </div>

                                    {/* Badges */}
                                    {user.badges.length > 0 && (
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                                            {user.badges.map((badge, i) => (
                                                <span key={i} className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-lg">
                                                    {badge === 'verified' && '✓ موثق'}
                                                    {badge === 'premium' && '⭐ مميز'}
                                                    {badge === 'trusted' && '🛡️ موثوق'}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--foreground-muted)] justify-center md:justify-start">
                                        {user.city && (
                                            <span className="flex items-center gap-1">
                                                📍 {user.city}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            📅 عضو منذ {memberSince}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            📢 {user.totalAds} إعلان
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {user.bio && (
                                <p className="mt-4 text-[var(--foreground-muted)] text-center md:text-right">
                                    {user.bio}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* User's Ads */}
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                        <div className="p-4 border-b border-[var(--border)]">
                            <h2 className="font-bold text-lg">إعلانات {user.name}</h2>
                            <p className="text-sm text-[var(--foreground-muted)]">{ads.length} إعلان</p>
                        </div>

                        {ads.length > 0 ? (
                            <div>
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
                        ) : (
                            <div className="p-12 text-center">
                                <div className="text-5xl mb-4">📭</div>
                                <h3 className="text-lg font-semibold mb-2">لا توجد إعلانات</h3>
                                <p className="text-[var(--foreground-muted)]">
                                    لم يقم هذا المستخدم بنشر أي إعلانات بعد
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
