"use client";

import { useState, useEffect } from "react";
import { formatNumber } from "@/lib/data";

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    adsCount: number;
    rating: number;
    verified: boolean;
    status: "active" | "suspended" | "banned";
    joinDate: string;
}

const statusColors: Record<string, string> = {
    active: "bg-[var(--secondary)]/10 text-[var(--secondary)]",
    suspended: "bg-[var(--warning)]/10 text-[var(--warning)]",
    banned: "bg-[var(--error)]/10 text-[var(--error)]",
};

const statusLabels: Record<string, string> = {
    active: "نشط",
    suspended: "موقوف",
    banned: "محظور",
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 0, current: 1 });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                filter,
                search
            });
            const res = await fetch(`/api/admin/users?${query}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [page, filter, search]);

    const handleAction = async (id: string, action: string) => {
        if (action === "ban" && !confirm("هل أنت متأكد من حظر هذا المستخدم؟")) return;

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });

            if (res.ok) {
                const data = await res.json();
                setUsers(prev => prev.map(u =>
                    u.id === id ? { ...u, status: data.user.status, verified: data.user.verified } : u
                ));
            } else {
                alert("حدث خطأ أثناء تنفيذ الإجراء");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("حدث خطأ في الاتصال");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
                    <p className="text-[var(--foreground-muted)]">
                        {formatNumber(pagination.total)} مستخدم
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
                        placeholder="بحث بالاسم أو الإيميل أو الجوال..."
                        className="input w-full"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {[
                        { value: "all", label: "الكل" },
                        { value: "verified", label: "موثق" },
                        { value: "unverified", label: "غير موثق" },
                        { value: "suspended", label: "موقوف" },
                        { value: "banned", label: "محظور" },
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

            {/* Users Table */}
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
                                        <th className="text-right p-4 font-medium">المستخدم</th>
                                        <th className="text-right p-4 font-medium">التواصل</th>
                                        <th className="text-right p-4 font-medium">الإعلانات</th>
                                        <th className="text-right p-4 font-medium">التقييم</th>
                                        <th className="text-right p-4 font-medium">الحالة</th>
                                        <th className="text-right p-4 font-medium">تاريخ التسجيل</th>
                                        <th className="text-right p-4 font-medium">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {users.length > 0 ? users.map((user) => (
                                        <tr key={user.id} className="hover:bg-[var(--background-secondary)]">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold">
                                                        {user.name?.[0] || "?"}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{user.name}</span>
                                                            {user.verified && (
                                                                <span className="text-[var(--secondary)]" title="موثق">✓</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-[var(--foreground-muted)]">#{user.id.substring(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm">{user.email}</div>
                                                <div className="text-xs text-[var(--foreground-muted)]">{user.phone}</div>
                                            </td>
                                            <td className="p-4 font-medium">{user.adsCount}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[var(--accent)]">⭐</span>
                                                    <span>{user.rating.toFixed(1)}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-xs px-2 py-1 rounded-lg ${statusColors[user.status] || 'bg-gray-100'}`}>
                                                    {statusLabels[user.status] || user.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[var(--foreground-muted)]">
                                                {new Date(user.joinDate).toLocaleDateString('ar-SA')}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {!user.verified && user.status === "active" && (
                                                        <button
                                                            onClick={() => handleAction(user.id, "verify")}
                                                            className="p-2 rounded-lg bg-[var(--secondary)]/10 text-[var(--secondary)] hover:bg-[var(--secondary)]/20"
                                                            title="توثيق"
                                                        >
                                                            ✓
                                                        </button>
                                                    )}
                                                    {user.status === "active" && (
                                                        <button
                                                            onClick={() => handleAction(user.id, "suspend")}
                                                            className="p-2 rounded-lg bg-[var(--warning)]/10 text-[var(--warning)] hover:bg-[var(--warning)]/20"
                                                            title="إيقاف مؤقت"
                                                        >
                                                            ⏸
                                                        </button>
                                                    )}
                                                    {user.status !== "banned" && (
                                                        <button
                                                            onClick={() => handleAction(user.id, "ban")}
                                                            className="p-2 rounded-lg bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20"
                                                            title="حظر"
                                                        >
                                                            🚫
                                                        </button>
                                                    )}
                                                    {user.status !== "active" && (
                                                        <button
                                                            onClick={() => handleAction(user.id, "activate")}
                                                            className="p-2 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--secondary)]/10"
                                                            title="تفعيل"
                                                        >
                                                            ▶
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-[var(--foreground-muted)]">
                                                لا يوجد مستخدمين مطابقين للبحث
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
