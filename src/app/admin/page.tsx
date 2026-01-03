"use client";

import Link from "next/link";
import { formatNumber } from "@/lib/data";

// Mock admin stats
const stats = [
    { label: "إجمالي الإعلانات", value: 15420, change: "+12%", color: "var(--primary)", icon: "📝" },
    { label: "المستخدمين", value: 8750, change: "+8%", color: "var(--secondary)", icon: "👥" },
    { label: "الزيارات اليوم", value: 12300, change: "+25%", color: "var(--accent)", icon: "👁️" },
    { label: "البلاغات المعلقة", value: 23, change: "-5%", color: "var(--error)", icon: "🚨" },
];

// Mock recent ads
const recentAds = [
    { id: "1", title: "كامري 2023 فل كامل", user: "أحمد محمد", status: "pending", date: "منذ دقيقتين" },
    { id: "2", title: "شقة للإيجار - حي النرجس", user: "عقارات الخليج", status: "approved", date: "منذ 5 دقائق" },
    { id: "3", title: "ايفون 15 برو ماكس", user: "متجر التقنية", status: "approved", date: "منذ 10 دقائق" },
    { id: "4", title: "طقم كنب مودرن", user: "أثاث المنزل", status: "rejected", date: "منذ 15 دقيقة" },
    { id: "5", title: "مطلوب مهندس برمجيات", user: "شركة التقنية", status: "pending", date: "منذ 20 دقيقة" },
];

// Mock recent reports
const recentReports = [
    { id: "1", adTitle: "سيارة مستعملة", reason: "إعلان وهمي", reporter: "خالد", date: "منذ ساعة" },
    { id: "2", adTitle: "شقة للبيع", reason: "سعر مضلل", reporter: "فهد", date: "منذ 3 ساعات" },
    { id: "3", adTitle: "جوال للبيع", reason: "محتوى مخالف", reporter: "سعد", date: "منذ 5 ساعات" },
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

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">{stat.icon}</span>
                            <span
                                className={`text-sm font-medium px-2 py-1 rounded-lg ${stat.change.startsWith("+")
                                        ? "bg-[var(--secondary)]/10 text-[var(--secondary)]"
                                        : "bg-[var(--error)]/10 text-[var(--error)]"
                                    }`}
                            >
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{formatNumber(stat.value)}</div>
                        <div className="text-sm text-[var(--foreground-muted)]">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Chart Placeholder */}
                <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6">
                    <h2 className="font-bold text-lg mb-4">إحصائيات الزيارات</h2>
                    <div className="h-64 flex items-center justify-center bg-[var(--background-secondary)] rounded-xl">
                        <div className="text-center text-[var(--foreground-muted)]">
                            <div className="text-4xl mb-2">📈</div>
                            <p>رسم بياني للزيارات</p>
                            <p className="text-xs">(يتطلب مكتبة recharts)</p>
                        </div>
                    </div>
                </div>

                {/* Categories Distribution */}
                <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6">
                    <h2 className="font-bold text-lg mb-4">توزيع الإعلانات حسب القسم</h2>
                    <div className="space-y-3">
                        {[
                            { name: "سيارات", count: 5420, percent: 35, color: "#ef4444" },
                            { name: "عقارات", count: 3200, percent: 21, color: "#22c55e" },
                            { name: "الكترونيات", count: 2800, percent: 18, color: "#3b82f6" },
                            { name: "أثاث", count: 1500, percent: 10, color: "#f59e0b" },
                            { name: "أخرى", count: 2500, percent: 16, color: "#6b7280" },
                        ].map((cat) => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{cat.name}</span>
                                    <span className="text-[var(--foreground-muted)]">{formatNumber(cat.count)}</span>
                                </div>
                                <div className="h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Ads */}
                <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                    <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                        <h2 className="font-bold">أحدث الإعلانات</h2>
                        <Link href="/admin/ads" className="text-sm text-[var(--primary)] hover:underline">
                            عرض الكل
                        </Link>
                    </div>
                    <div className="divide-y divide-[var(--border)]">
                        {recentAds.map((ad) => (
                            <div key={ad.id} className="p-4 flex items-center justify-between hover:bg-[var(--background-secondary)]">
                                <div>
                                    <div className="font-medium">{ad.title}</div>
                                    <div className="text-sm text-[var(--foreground-muted)]">{ad.user} • {ad.date}</div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-lg ${statusColors[ad.status]}`}>
                                    {statusLabels[ad.status]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                    <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                        <h2 className="font-bold">أحدث البلاغات</h2>
                        <Link href="/admin/reports" className="text-sm text-[var(--primary)] hover:underline">
                            عرض الكل
                        </Link>
                    </div>
                    <div className="divide-y divide-[var(--border)]">
                        {recentReports.map((report) => (
                            <div key={report.id} className="p-4 hover:bg-[var(--background-secondary)]">
                                <div className="flex items-start justify-between mb-1">
                                    <span className="font-medium">{report.adTitle}</span>
                                    <span className="text-xs text-[var(--foreground-muted)]">{report.date}</span>
                                </div>
                                <div className="text-sm text-[var(--error)]">السبب: {report.reason}</div>
                                <div className="text-xs text-[var(--foreground-muted)]">المُبلغ: {report.reporter}</div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-[var(--background-secondary)] text-center">
                        <span className="text-[var(--error)] font-medium">{recentReports.length} بلاغات تحتاج مراجعة</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6">
                <h2 className="font-bold text-lg mb-4">إجراءات سريعة</h2>
                <div className="flex flex-wrap gap-3">
                    <Link href="/admin/ads?status=pending" className="btn btn-primary">
                        <span>📝</span> مراجعة الإعلانات ({5})
                    </Link>
                    <Link href="/admin/reports" className="btn btn-secondary bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/30">
                        <span>🚨</span> معالجة البلاغات ({recentReports.length})
                    </Link>
                    <Link href="/admin/users?verified=false" className="btn btn-secondary">
                        <span>👥</span> توثيق المستخدمين
                    </Link>
                    <Link href="/admin/categories" className="btn btn-secondary">
                        <span>📁</span> إدارة الأقسام
                    </Link>
                </div>
            </div>
        </div>
    );
}
