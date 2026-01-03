"use client";

import { useState } from "react";
import Link from "next/link";
import { formatNumber, formatPrice } from "@/lib/data";

// Mock ads data
const mockAds = [
    { id: "1", title: "كامري 2023 فل كامل", category: "سيارات", price: 125000, user: "أحمد محمد", status: "approved", views: 234, date: "2024-01-15", featured: true },
    { id: "2", title: "شقة للإيجار - حي النرجس", category: "عقارات", price: 35000, user: "عقارات الخليج", status: "approved", views: 567, date: "2024-01-14", featured: true },
    { id: "3", title: "ايفون 15 برو ماكس", category: "الكترونيات", price: 4800, user: "متجر التقنية", status: "pending", views: 189, date: "2024-01-13", featured: false },
    { id: "4", title: "طقم كنب مودرن", category: "أثاث", price: 8500, user: "أثاث المنزل", status: "rejected", views: 98, date: "2024-01-12", featured: false },
    { id: "5", title: "لاند كروزر 2022 VXR", category: "سيارات", price: 320000, user: "معرض السيارات", status: "approved", views: 445, date: "2024-01-11", featured: true },
    { id: "6", title: "فيلا دوبلكس للبيع", category: "عقارات", price: 2500000, user: "مكتب الفخامة", status: "pending", views: 789, date: "2024-01-10", featured: false },
    { id: "7", title: "ماك بوك برو M3", category: "الكترونيات", price: 9500, user: "تقنيات المستقبل", status: "approved", views: 156, date: "2024-01-09", featured: false },
    { id: "8", title: "مطلوب مهندس برمجيات", category: "وظائف", price: 25000, user: "شركة التقنية", status: "pending", views: 320, date: "2024-01-08", featured: false },
];

const statusColors: Record<string, string> = {
    pending: "bg-[var(--warning)]/10 text-[var(--warning)]",
    approved: "bg-[var(--secondary)]/10 text-[var(--secondary)]",
    rejected: "bg-[var(--error)]/10 text-[var(--error)]",
};

const statusLabels: Record<string, string> = {
    pending: "قيد المراجعة",
    approved: "موافق عليه",
    rejected: "مرفوض",
};

export default function AdminAdsPage() {
    const [ads, setAds] = useState(mockAds);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filteredAds = ads.filter((ad) => {
        const matchesFilter = filter === "all" || ad.status === filter;
        const matchesSearch = ad.title.includes(search) || ad.user.includes(search);
        return matchesFilter && matchesSearch;
    });

    const handleApprove = (id: string) => {
        setAds(ads.map((ad) => (ad.id === id ? { ...ad, status: "approved" } : ad)));
    };

    const handleReject = (id: string) => {
        setAds(ads.map((ad) => (ad.id === id ? { ...ad, status: "rejected" } : ad)));
    };

    const handleDelete = (id: string) => {
        if (confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
            setAds(ads.filter((ad) => ad.id !== id));
        }
    };

    const handleToggleFeatured = (id: string) => {
        setAds(ads.map((ad) => (ad.id === id ? { ...ad, featured: !ad.featured } : ad)));
    };

    const pendingCount = ads.filter((ad) => ad.status === "pending").length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">إدارة الإعلانات</h1>
                    <p className="text-[var(--foreground-muted)]">
                        {formatNumber(ads.length)} إعلان • {pendingCount} قيد المراجعة
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="بحث في الإعلانات..."
                        className="input w-full"
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { value: "all", label: "الكل" },
                        { value: "pending", label: "قيد المراجعة" },
                        { value: "approved", label: "موافق عليه" },
                        { value: "rejected", label: "مرفوض" },
                    ].map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f.value
                                    ? "bg-[var(--primary)] text-white"
                                    : "bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--background-secondary)]"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ads Table */}
            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
                            <tr>
                                <th className="text-right p-4 font-medium">الإعلان</th>
                                <th className="text-right p-4 font-medium">القسم</th>
                                <th className="text-right p-4 font-medium">السعر</th>
                                <th className="text-right p-4 font-medium">المُعلن</th>
                                <th className="text-right p-4 font-medium">الحالة</th>
                                <th className="text-right p-4 font-medium">المشاهدات</th>
                                <th className="text-right p-4 font-medium">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {filteredAds.map((ad) => (
                                <tr key={ad.id} className="hover:bg-[var(--background-secondary)]">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {ad.featured && <span className="text-yellow-500">⭐</span>}
                                            <Link href={`/ads/${ad.id}`} className="font-medium hover:text-[var(--primary)]">
                                                {ad.title}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="p-4 text-[var(--foreground-muted)]">{ad.category}</td>
                                    <td className="p-4 font-medium">{formatPrice(ad.price)}</td>
                                    <td className="p-4 text-[var(--foreground-muted)]">{ad.user}</td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded-lg ${statusColors[ad.status]}`}>
                                            {statusLabels[ad.status]}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[var(--foreground-muted)]">{formatNumber(ad.views)}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            {ad.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(ad.id)}
                                                        className="p-2 rounded-lg bg-[var(--secondary)]/10 text-[var(--secondary)] hover:bg-[var(--secondary)]/20"
                                                        title="قبول"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(ad.id)}
                                                        className="p-2 rounded-lg bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20"
                                                        title="رفض"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleToggleFeatured(ad.id)}
                                                className={`p-2 rounded-lg ${ad.featured ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-[var(--background-secondary)]'} hover:bg-[var(--accent)]/20`}
                                                title={ad.featured ? "إزالة التمييز" : "تمييز"}
                                            >
                                                ⭐
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ad.id)}
                                                className="p-2 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--error)]/10 hover:text-[var(--error)]"
                                                title="حذف"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-sm text-[var(--foreground-muted)]">
                        عرض {filteredAds.length} من {ads.length} إعلان
                    </span>
                    <div className="flex gap-2">
                        <button className="btn btn-secondary px-4 py-2" disabled>السابق</button>
                        <button className="btn btn-secondary px-4 py-2">التالي</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
