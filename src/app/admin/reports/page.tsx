"use client";

import { useState } from "react";
import Link from "next/link";

// Mock reports data
const mockReports = [
    {
        id: "r1",
        adId: "a1",
        adTitle: "سيارة مستعملة للبيع",
        reason: "إعلان وهمي",
        details: "الصور لا تطابق الوصف والسعر غير واقعي",
        reporterId: "u10",
        reporterName: "خالد العمري",
        reporterEmail: "khaled@email.com",
        sellerId: "u1",
        sellerName: "أحمد محمد",
        status: "pending",
        date: "2024-01-15 10:30",
    },
    {
        id: "r2",
        adId: "a2",
        adTitle: "شقة للبيع - حي الملقا",
        reason: "سعر مضلل",
        details: "السعر المعلن أقل بكثير من السعر الحقيقي",
        reporterId: "u11",
        reporterName: "فهد السعيد",
        reporterEmail: "fahd@email.com",
        sellerId: "u2",
        sellerName: "عقارات الخليج",
        status: "pending",
        date: "2024-01-14 15:45",
    },
    {
        id: "r3",
        adId: "a3",
        adTitle: "جوال للبيع",
        reason: "محتوى مخالف",
        details: "يحتوي على كلمات مسيئة",
        reporterId: "u12",
        reporterName: "سعد القحطاني",
        reporterEmail: "saad@email.com",
        sellerId: "u3",
        sellerName: "متجر التقنية",
        status: "resolved",
        date: "2024-01-13 09:20",
    },
    {
        id: "r4",
        adId: "a4",
        adTitle: "وظيفة مندوب مبيعات",
        reason: "احتيال",
        details: "يطلب رسوم للتوظيف",
        reporterId: "u13",
        reporterName: "محمد العتيبي",
        reporterEmail: "mohammed@email.com",
        sellerId: "u4",
        sellerName: "شركة التوظيف",
        status: "pending",
        date: "2024-01-12 14:10",
    },
    {
        id: "r5",
        adId: "a5",
        adTitle: "ساعة رولكس أصلية",
        reason: "منتج مقلد",
        details: "الساعة مقلدة وليست أصلية",
        reporterId: "u14",
        reporterName: "عبدالله الشمري",
        reporterEmail: "abdullah@email.com",
        sellerId: "u5",
        sellerName: "متجر الساعات",
        status: "dismissed",
        date: "2024-01-11 11:55",
    },
];

const statusColors: Record<string, string> = {
    pending: "bg-[var(--warning)]/10 text-[var(--warning)]",
    resolved: "bg-[var(--secondary)]/10 text-[var(--secondary)]",
    dismissed: "bg-[var(--foreground-muted)]/10 text-[var(--foreground-muted)]",
};

const statusLabels: Record<string, string> = {
    pending: "قيد المراجعة",
    resolved: "تم الحل",
    dismissed: "مرفوض",
};

const reasonColors: Record<string, string> = {
    "إعلان وهمي": "bg-[var(--error)]/10 text-[var(--error)]",
    "سعر مضلل": "bg-[var(--warning)]/10 text-[var(--warning)]",
    "محتوى مخالف": "bg-[var(--accent)]/10 text-[var(--accent)]",
    "احتيال": "bg-[var(--error)]/10 text-[var(--error)]",
    "منتج مقلد": "bg-[var(--primary)]/10 text-[var(--primary)]",
};

export default function AdminReportsPage() {
    const [reports, setReports] = useState(mockReports);
    const [filter, setFilter] = useState("all");
    const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);

    const filteredReports = reports.filter((report) => {
        return filter === "all" || report.status === filter;
    });

    const handleResolve = (id: string, action: "delete_ad" | "warn_seller" | "ban_seller") => {
        setReports(reports.map((r) => (r.id === id ? { ...r, status: "resolved" } : r)));
        setSelectedReport(null);

        // Show action message
        const actionMessages: Record<string, string> = {
            delete_ad: "تم حذف الإعلان وإشعار البائع",
            warn_seller: "تم إرسال تحذير للبائع",
            ban_seller: "تم حظر البائع وحذف إعلاناته",
        };
        alert(actionMessages[action]);
    };

    const handleDismiss = (id: string) => {
        setReports(reports.map((r) => (r.id === id ? { ...r, status: "dismissed" } : r)));
        setSelectedReport(null);
    };

    const pendingCount = reports.filter((r) => r.status === "pending").length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">إدارة البلاغات</h1>
                    <p className="text-[var(--foreground-muted)]">
                        {reports.length} بلاغ • {pendingCount} قيد المراجعة
                    </p>
                </div>
                {pendingCount > 0 && (
                    <div className="px-4 py-2 rounded-lg bg-[var(--error)]/10 text-[var(--error)] font-medium">
                        🚨 {pendingCount} بلاغات تحتاج مراجعة
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {[
                    { value: "all", label: "الكل" },
                    { value: "pending", label: "قيد المراجعة" },
                    { value: "resolved", label: "تم الحل" },
                    { value: "dismissed", label: "مرفوض" },
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

            {/* Reports Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredReports.map((report) => (
                    <div
                        key={report.id}
                        className={`bg-[var(--background)] rounded-2xl border border-[var(--border)] p-5 cursor-pointer transition-shadow hover:shadow-lg ${selectedReport?.id === report.id ? "ring-2 ring-[var(--primary)]" : ""
                            }`}
                        onClick={() => setSelectedReport(report)}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex gap-2">
                                <span className={`text-xs px-2 py-1 rounded-lg ${reasonColors[report.reason] || "bg-[var(--background-secondary)]"}`}>
                                    {report.reason}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-lg ${statusColors[report.status]}`}>
                                    {statusLabels[report.status]}
                                </span>
                            </div>
                            <span className="text-xs text-[var(--foreground-muted)]">{report.date}</span>
                        </div>

                        <h3 className="font-medium mb-2">{report.adTitle}</h3>
                        <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 mb-3">{report.details}</p>

                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <span className="text-[var(--foreground-muted)]">المُبلغ:</span>{" "}
                                <span className="font-medium">{report.reporterName}</span>
                            </div>
                            <div>
                                <span className="text-[var(--foreground-muted)]">البائع:</span>{" "}
                                <span className="font-medium">{report.sellerName}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Report Detail Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedReport(null)} />
                    <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-auto animate-fadeIn">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-[var(--border)] flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-1">تفاصيل البلاغ</h2>
                                <div className="flex gap-2">
                                    <span className={`text-xs px-2 py-1 rounded-lg ${reasonColors[selectedReport.reason] || "bg-[var(--background-secondary)]"}`}>
                                        {selectedReport.reason}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-lg ${statusColors[selectedReport.status]}`}>
                                        {statusLabels[selectedReport.status]}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-[var(--background-secondary)] rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Ad Info */}
                            <div>
                                <h3 className="font-medium text-[var(--foreground-muted)] mb-2">الإعلان المُبلغ عنه</h3>
                                <div className="p-4 bg-[var(--background-secondary)] rounded-xl">
                                    <Link href={`/ads/${selectedReport.adId}`} className="font-medium hover:text-[var(--primary)]">
                                        {selectedReport.adTitle}
                                    </Link>
                                    <div className="text-sm text-[var(--foreground-muted)] mt-1">
                                        بواسطة: {selectedReport.sellerName}
                                    </div>
                                </div>
                            </div>

                            {/* Report Details */}
                            <div>
                                <h3 className="font-medium text-[var(--foreground-muted)] mb-2">تفاصيل البلاغ</h3>
                                <p className="p-4 bg-[var(--background-secondary)] rounded-xl">{selectedReport.details}</p>
                            </div>

                            {/* Reporter Info */}
                            <div>
                                <h3 className="font-medium text-[var(--foreground-muted)] mb-2">معلومات المُبلغ</h3>
                                <div className="p-4 bg-[var(--background-secondary)] rounded-xl">
                                    <div>{selectedReport.reporterName}</div>
                                    <div className="text-sm text-[var(--foreground-muted)]">{selectedReport.reporterEmail}</div>
                                </div>
                            </div>

                            {/* Actions */}
                            {selectedReport.status === "pending" && (
                                <div>
                                    <h3 className="font-medium text-[var(--foreground-muted)] mb-3">الإجراء</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleResolve(selectedReport.id, "delete_ad")}
                                            className="btn bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20 border-[var(--error)]/30"
                                        >
                                            🗑️ حذف الإعلان
                                        </button>
                                        <button
                                            onClick={() => handleResolve(selectedReport.id, "warn_seller")}
                                            className="btn bg-[var(--warning)]/10 text-[var(--warning)] hover:bg-[var(--warning)]/20 border-[var(--warning)]/30"
                                        >
                                            ⚠️ تحذير البائع
                                        </button>
                                        <button
                                            onClick={() => handleResolve(selectedReport.id, "ban_seller")}
                                            className="btn bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20 border-[var(--error)]/30"
                                        >
                                            🚫 حظر البائع
                                        </button>
                                        <button
                                            onClick={() => handleDismiss(selectedReport.id)}
                                            className="btn btn-secondary"
                                        >
                                            ❌ رفض البلاغ
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
