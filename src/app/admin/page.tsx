"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatNumber } from "@/lib/data";

interface AdminStats {
    users: number;
    totalAds: number;
    activeAds: number;
    recentAds: {
        id: string;
        title: string;
        user: string;
        status: string;
        date: string;
    }[];
    categoryDistribution: {
        name: string;
        count: number;
        color: string;
    }[];
}

const statusColors: Record<string, string> = {
    pending: "bg-[var(--warning)]/10 text-[var(--warning)]",
    active: "bg-[var(--secondary)]/10 text-[var(--secondary)]",
    approved: "bg-[var(--secondary)]/10 text-[var(--secondary)]",
    sold: "bg-[var(--accent)]/10 text-[var(--accent)]",
    rejected: "bg-[var(--error)]/10 text-[var(--error)]",
    deleted: "bg-[var(--foreground-muted)]/10 text-[var(--foreground-muted)]",
};

const statusLabels: Record<string, string> = {
    pending: "قيد المراجعة",
    active: "نشط",
    approved: "موافق عليه",
    sold: "مباع",
    rejected: "مرفوض",
    deleted: "محذوف",
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        { label: "إجمالي الإعلانات", value: stats.totalAds, icon: "📝", color: "var(--primary)" },
        { label: "الإعلانات النشطة", value: stats.activeAds, icon: "✅", color: "var(--secondary)" },
        { label: "المستخدمين", value: stats.users, icon: "👥", color: "var(--accent)" },
        { label: "نشاط اليوم", value: "---", icon: "📊", color: "var(--warning)" }, // Placeholder for now
    ];

    // Calculate percentages for distribution
    const totalDistributed = stats.categoryDistribution.reduce((acc, curr) => acc + curr.count, 0) || 1;
    const distribution = stats.categoryDistribution.map(cat => ({
        ...cat,
        percent: Math.round((cat.count / totalDistributed) * 100)
    }));

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">{stat.icon}</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{formatNumber(stat.value)}</div>
                        <div className="text-sm text-[var(--foreground-muted)]">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Categories Distribution */}
                <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6">
                    <h2 className="font-bold text-lg mb-4">توزيع الإعلانات حسب القسم</h2>
                    <div className="space-y-3">
                        {distribution.length > 0 ? distribution.map((cat) => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{cat.name}</span>
                                    <span className="text-[var(--foreground-muted)]">{formatNumber(cat.count)}</span>
                                </div>
                                <div className="h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{ width: `${cat.percent}%`, backgroundColor: cat.color || 'var(--primary)' }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <p className="text-[var(--foreground-muted)] text-center py-4">لا توجد بيانات</p>
                        )}
                    </div>
                </div>

                {/* Recent Ads */}
                <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                    <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                        <h2 className="font-bold">أحدث الإعلانات</h2>
                        <Link href="/" className="text-sm text-[var(--primary)] hover:underline">
                            عرض الموقع
                        </Link>
                    </div>
                    <div className="divide-y divide-[var(--border)]">
                        {stats.recentAds.length > 0 ? stats.recentAds.map((ad) => (
                            <div key={ad.id} className="p-4 flex items-center justify-between hover:bg-[var(--background-secondary)]">
                                <div>
                                    <div className="font-medium">{ad.title}</div>
                                    <div className="text-sm text-[var(--foreground-muted)]">
                                        {ad.user} • {new Date(ad.date).toLocaleDateString('ar-SA')}
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-lg ${statusColors[ad.status] || 'bg-gray-100 text-gray-500'}`}>
                                    {statusLabels[ad.status] || ad.status}
                                </span>
                            </div>
                        )) : (
                            <p className="p-4 text-center text-[var(--foreground-muted)]">لا توجد إعلانات حديثة</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Quick Actions */}
                <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6">
                    <h2 className="font-bold text-lg mb-4">روابط سريعة</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/ads/new" className="btn btn-primary">
                            + إضافة إعلان (تجربة)
                        </Link>
                        <Link href="/" className="btn btn-secondary">
                            🏠 الصفحة الرئيسية
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
