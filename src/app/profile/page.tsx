"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdListItem from "@/components/AdListItem";
import VerifiedBadge, { BadgeGroup, VerificationRequestCard } from "@/components/VerifiedBadge";
import { sampleAds } from "@/lib/data";

// Mock user data
const mockUser = {
    id: "u1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "0500000000",
    avatar: "أ",
    joinDate: "يناير 2023",
    adsCount: 12,
    rating: 4.8,
    reviewsCount: 45,
    verified: true,
    phoneVerified: true,
    badges: ["verified", "trusted"] as ("verified" | "business" | "trusted" | "premium")[],
};

// Mock user's ads
const myAds = sampleAds.slice(0, 4);
const favoriteAds = sampleAds.slice(2, 5);

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"ads" | "favorites" | "verification" | "settings">("ads");
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    const tabs = [
        { id: "ads", label: "إعلاناتي", count: myAds.length },
        { id: "favorites", label: "المفضلة", count: favoriteAds.length },
        { id: "verification", label: "التوثيق", count: null, icon: "🛡️" },
        { id: "settings", label: "الإعدادات", count: null },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-6">
                <div className="container">
                    {/* Profile Header */}
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 mb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-white text-4xl font-bold">
                                    {mockUser.avatar}
                                </div>
                                {mockUser.verified && (
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--secondary)] flex items-center justify-center text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-2xl font-bold">{mockUser.name}</h1>
                                    <BadgeGroup badges={mockUser.badges} size="md" />
                                </div>
                                <p className="text-[var(--foreground-muted)] mb-3">
                                    عضو منذ {mockUser.joinDate}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1 text-[var(--accent)]">
                                        <span>⭐</span>
                                        <span className="font-semibold">{mockUser.rating}</span>
                                        <span className="text-[var(--foreground-muted)]">({mockUser.reviewsCount} تقييم)</span>
                                    </div>
                                    <div className="text-[var(--foreground-muted)]">
                                        {mockUser.adsCount} إعلان نشط
                                    </div>
                                    {mockUser.phoneVerified && (
                                        <div className="flex items-center gap-1 text-[var(--secondary)]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                            <span className="text-xs">جوال موثق</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Link href="/ads/new" className="btn btn-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14" />
                                        <path d="M12 5v14" />
                                    </svg>
                                    إعلان جديد
                                </Link>
                                <button className="btn btn-secondary">
                                    تعديل الملف
                                </button>
                            </div>
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
                                {tab.icon && <span className="ml-1">{tab.icon}</span>}
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
                        <div className="space-y-4">
                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 text-center">
                                    <div className="text-2xl font-bold text-[var(--primary)]">4</div>
                                    <div className="text-sm text-[var(--foreground-muted)]">إعلانات نشطة</div>
                                </div>
                                <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 text-center">
                                    <div className="text-2xl font-bold text-[var(--secondary)]">1,234</div>
                                    <div className="text-sm text-[var(--foreground-muted)]">إجمالي المشاهدات</div>
                                </div>
                                <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 text-center">
                                    <div className="text-2xl font-bold text-[var(--accent)]">56</div>
                                    <div className="text-sm text-[var(--foreground-muted)]">التعليقات</div>
                                </div>
                                <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 text-center">
                                    <div className="text-2xl font-bold">8</div>
                                    <div className="text-sm text-[var(--foreground-muted)]">إعلانات مباعة</div>
                                </div>
                            </div>

                            {/* My Ads List */}
                            <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
                                <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                                    <h2 className="font-bold">إعلاناتي النشطة</h2>
                                    <select className="input py-2 px-3 w-auto text-sm">
                                        <option>الأحدث</option>
                                        <option>الأقدم</option>
                                        <option>الأكثر مشاهدة</option>
                                    </select>
                                </div>
                                {myAds.map((ad) => (
                                    <div key={ad.id} className="relative group">
                                        <AdListItem
                                            id={ad.id}
                                            title={ad.title}
                                            price={ad.price}
                                            location={ad.location}
                                            date={ad.date}
                                            category={ad.category}
                                            featured={ad.featured}
                                            views={ad.views}
                                            commentsCount={3}
                                        />
                                        {/* Actions Overlay */}
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]" title="تعديل">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>
                                            <button className="p-2 rounded-lg bg-[var(--error)] text-white hover:opacity-80" title="حذف">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                </svg>
                                            </button>
                                            <button className="p-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-80" title="رفع (تجديد)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="m18 15-6-6-6 6" />
                                                    <path d="M12 9v12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "favorites" && (
                        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
                            <div className="p-4 border-b border-[var(--border)]">
                                <h2 className="font-bold">الإعلانات المفضلة</h2>
                            </div>
                            {favoriteAds.length > 0 ? (
                                favoriteAds.map((ad) => (
                                    <div key={ad.id} className="relative group">
                                        <AdListItem
                                            id={ad.id}
                                            title={ad.title}
                                            price={ad.price}
                                            location={ad.location}
                                            date={ad.date}
                                            category={ad.category}
                                            featured={ad.featured}
                                            views={ad.views}
                                            commentsCount={3}
                                        />
                                        <button
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[var(--error)] hover:bg-[var(--error)]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="إزالة من المفضلة"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                ))
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

                    {activeTab === "verification" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Current Badges */}
                            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6">
                                <h2 className="font-bold text-lg mb-4">شاراتي الحالية</h2>

                                {mockUser.badges.length > 0 ? (
                                    <div className="space-y-3">
                                        {mockUser.badges.map((badge, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-[var(--background-secondary)]">
                                                <VerifiedBadge type={badge} size="lg" showLabel tooltip={false} />
                                                <div className="flex-1 text-sm text-[var(--foreground-muted)]">
                                                    تم التوثيق في يناير 2024
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-[var(--foreground-muted)]">
                                        <div className="text-4xl mb-3">🛡️</div>
                                        <p>لا توجد شارات بعد</p>
                                    </div>
                                )}

                                {/* Available Badges */}
                                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                                    <h3 className="font-semibold mb-3">الشارات المتاحة</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl border border-[var(--border)] text-center">
                                            <VerifiedBadge type="verified" size="lg" tooltip={false} />
                                            <div className="text-xs mt-2 text-[var(--foreground-muted)]">موثق الهوية</div>
                                        </div>
                                        <div className="p-3 rounded-xl border border-[var(--border)] text-center">
                                            <VerifiedBadge type="business" size="lg" tooltip={false} />
                                            <div className="text-xs mt-2 text-[var(--foreground-muted)]">تاجر معتمد</div>
                                        </div>
                                        <div className="p-3 rounded-xl border border-[var(--border)] text-center">
                                            <VerifiedBadge type="trusted" size="lg" tooltip={false} />
                                            <div className="text-xs mt-2 text-[var(--foreground-muted)]">بائع موثوق</div>
                                        </div>
                                        <div className="p-3 rounded-xl border border-[var(--border)] text-center">
                                            <VerifiedBadge type="premium" size="lg" tooltip={false} />
                                            <div className="text-xs mt-2 text-[var(--foreground-muted)]">عضو مميز</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Request Verification */}
                            <VerificationRequestCard />
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
                            {/* Personal Info */}
                            <div className="p-6">
                                <h2 className="font-bold mb-4">المعلومات الشخصية</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">الاسم</label>
                                        <input type="text" defaultValue={mockUser.name} className="input" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">رقم الجوال</label>
                                        <div className="flex gap-2">
                                            <input type="tel" defaultValue={mockUser.phone} className="input flex-1" />
                                            {mockUser.phoneVerified ? (
                                                <span className="btn bg-[var(--secondary)]/10 text-[var(--secondary)] cursor-default">
                                                    ✓ موثق
                                                </span>
                                            ) : (
                                                <button className="btn btn-primary">توثيق</button>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                                        <input type="email" defaultValue={mockUser.email} className="input" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">المدينة</label>
                                        <select className="input">
                                            <option>الرياض</option>
                                            <option>جدة</option>
                                            <option>مكة</option>
                                        </select>
                                    </div>
                                </div>
                                <button className="btn btn-primary mt-4">حفظ التغييرات</button>
                            </div>

                            {/* Password */}
                            <div className="p-6">
                                <h2 className="font-bold mb-4">تغيير كلمة المرور</h2>
                                <div className="max-w-md space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">كلمة المرور الحالية</label>
                                        <input type="password" className="input" placeholder="••••••••" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">كلمة المرور الجديدة</label>
                                        <input type="password" className="input" placeholder="••••••••" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">تأكيد كلمة المرور</label>
                                        <input type="password" className="input" placeholder="••••••••" />
                                    </div>
                                </div>
                                <button className="btn btn-secondary mt-4">تحديث كلمة المرور</button>
                            </div>

                            {/* Notifications */}
                            <div className="p-6">
                                <h2 className="font-bold mb-4">الإشعارات</h2>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span>إشعارات التعليقات الجديدة</span>
                                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span>إشعارات الرسائل</span>
                                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span>تنبيهات البحث</span>
                                        <input type="checkbox" className="w-5 h-5" />
                                    </label>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="p-6">
                                <h2 className="font-bold text-[var(--error)] mb-4">منطقة الخطر</h2>
                                <p className="text-[var(--foreground-muted)] mb-4">
                                    حذف الحساب نهائياً مع جميع الإعلانات والبيانات
                                </p>
                                <button className="btn bg-[var(--error)] text-white hover:opacity-80">
                                    حذف الحساب
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
