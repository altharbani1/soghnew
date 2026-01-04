"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatNumber, formatPrice } from "@/lib/data";

interface Ad {
    id: string;
    title: string;
    category: string;
    price: number;
    user: string;
    status: string;
    views: number;
    date: string;
    featured: boolean;
}

const statusColors: Record<string, string> = {
    pending: "bg-[var(--warning)]/10 text-[var(--warning)]",
    active: "bg-[var(--secondary)]/10 text-[var(--secondary)]",
    approved: "bg-[var(--secondary)]/10 text-[var(--secondary)]",
    rejected: "bg-[var(--error)]/10 text-[var(--error)]",
    sold: "bg-[var(--accent)]/10 text-[var(--accent)]",
};

const statusLabels: Record<string, string> = {
    pending: "قيد المراجعة",
    active: "نشط",
    approved: "موافق عليه",
    rejected: "مرفوض",
    sold: "مباع",
};

export default function AdminAdsPage() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 0, current: 1 });
    const [pendingCount, setPendingCount] = useState(0);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                filter,
                search
            });
            const res = await fetch(`/api/admin/ads?${query}`);
            if (res.ok) {
                const data = await res.json();
                setAds(data.ads);
                setPagination(data.pagination);
                setPendingCount(data.pendingCount);
            }
        } catch (error) {
            console.error("Error fetching ads:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchAds();
        }, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [page, filter, search]);

    const handleAction = async (id: string, action: string) => {
        if (action === "delete" && !confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;

        try {
            const method = action === "delete" ? "DELETE" : "PATCH";
            const body = action !== "delete" ? JSON.stringify({ action }) : undefined;

            const res = await fetch(`/api/admin/ads/${id}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body,
            });

            if (res.ok) {
                if (action === "delete") {
                    setAds(prev => prev.filter(ad => ad.id !== id));
                    // Update pending count if deleted ad was pending? Needs re-fetch or manual check
                    fetchAds(); // Simple re-fetch to update everything
                } else {
                    const data = await res.json();
                    setAds(prev => prev.map(ad =>
                        ad.id === id ? { ...ad, status: data.ad.status, featured: data.ad.featured } : ad
                    ));
                    // If action changed status from pending, update count
                    if (action === "approve" || action === "reject") {
                        setPendingCount(prev => Math.max(0, prev - 1));
                    }
                }
            } else {
                alert("حدث خطأ أثناء تنفيذ الإجراء");
            }
        } catch (error) {
            console.error("Error updating ad:", error);
            alert("حدث خطأ في الاتصال");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">إدارة الإعلانات</h1>
                    <p className="text-[var(--foreground-muted)]">
                        {formatNumber(pagination.total)} إعلان • {pendingCount} قيد المراجعة
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="بحث في الإعلانات..."
                        className="input w-full"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {[
                        { value: "all", label: "الكل" },
                        { value: "pending", label: "قيد المراجعة" },
                        { value: "active", label: "نشط" },
                        { value: "rejected", label: "مرفوض" },
                        { value: "sold", label: "مباع" },
                    ].map((f) => (
                        <button
                            key={f.value}
                            onClick={() => { setFilter(f.value); setPage(1); }}
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
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[var(--foreground-muted)]">جاري التحميل...</p>
                    </div>
                ) : (
                    <>
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
                                    {ads.length > 0 ? ads.map((ad) => (
                                        <tr key={ad.id} className="hover:bg-[var(--background-secondary)]">
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {ad.featured && <span className="text-yellow-500">⭐</span>}
                                                    <Link href={`/ads/${ad.id}`} className="font-medium hover:text-[var(--primary)] line-clamp-1 block max-w-[200px]" target="_blank">
                                                        {ad.title}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="p-4 text-[var(--foreground-muted)]">{ad.category}</td>
                                            <td className="p-4 font-medium text-nowrap">{formatPrice(ad.price)}</td>
                                            <td className="p-4 text-[var(--foreground-muted)]">{ad.user}</td>
                                            <td className="p-4">
                                                <span className={`text-xs px-2 py-1 rounded-lg ${statusColors[ad.status] || 'bg-gray-100'}`}>
                                                    {statusLabels[ad.status] || ad.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[var(--foreground-muted)]">{formatNumber(ad.views)}</td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {ad.status === "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleAction(ad.id, "approve")}
                                                                className="p-2 rounded-lg bg-[var(--secondary)]/10 text-[var(--secondary)] hover:bg-[var(--secondary)]/20"
                                                                title="قبول"
                                                            >
                                                                ✓
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(ad.id, "reject")}
                                                                className="p-2 rounded-lg bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20"
                                                                title="رفض"
                                                            >
                                                                ✕
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleAction(ad.id, "toggleFeatured")}
                                                        className={`p-2 rounded-lg ${ad.featured ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-[var(--background-secondary)]'} hover:bg-[var(--accent)]/20`}
                                                        title={ad.featured ? "إزالة التمييز" : "تمييز"}
                                                    >
                                                        ⭐
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(ad.id, "delete")}
                                                        className="p-2 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--error)]/10 hover:text-[var(--error)]"
                                                        title="حذف"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-[var(--foreground-muted)]">
                                                لا توجد إعلانات مطابقة
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="p-4 border-t border-[var(--border)] flex items-center justify-between">
                                <span className="text-sm text-[var(--foreground-muted)]">
                                    عرض الصفحة {pagination.current} من {pagination.pages}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="btn btn-secondary px-4 py-2 disabled:opacity-50"
                                    >
                                        السابق
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                        disabled={page === pagination.pages}
                                        className="btn btn-secondary px-4 py-2 disabled:opacity-50"
                                    >
                                        التالي
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
