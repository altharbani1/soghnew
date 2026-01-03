"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/data";

// Mock users data
const mockUsers = [
    { id: "u1", name: "أحمد محمد", email: "ahmed@email.com", phone: "0500000001", adsCount: 12, rating: 4.8, verified: true, status: "active", joinDate: "2023-01-15" },
    { id: "u2", name: "عقارات الخليج", email: "gulf@email.com", phone: "0500000002", adsCount: 45, rating: 4.5, verified: true, status: "active", joinDate: "2022-08-20" },
    { id: "u3", name: "متجر التقنية", email: "tech@email.com", phone: "0500000003", adsCount: 28, rating: 4.2, verified: false, status: "active", joinDate: "2023-03-10" },
    { id: "u4", name: "أثاث المنزل", email: "furniture@email.com", phone: "0500000004", adsCount: 8, rating: 3.9, verified: false, status: "active", joinDate: "2023-06-05" },
    { id: "u5", name: "معرض السيارات", email: "cars@email.com", phone: "0500000005", adsCount: 67, rating: 4.7, verified: true, status: "active", joinDate: "2022-02-28" },
    { id: "u6", name: "مكتب الفخامة", email: "luxury@email.com", phone: "0500000006", adsCount: 23, rating: 4.4, verified: true, status: "suspended", joinDate: "2023-04-12" },
    { id: "u7", name: "تقنيات المستقبل", email: "future@email.com", phone: "0500000007", adsCount: 15, rating: 4.1, verified: false, status: "active", joinDate: "2023-09-01" },
    { id: "u8", name: "شركة التقنية", email: "company@email.com", phone: "0500000008", adsCount: 5, rating: 4.6, verified: true, status: "banned", joinDate: "2023-07-20" },
];

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
    const [users, setUsers] = useState(mockUsers);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filteredUsers = users.filter((user) => {
        const matchesFilter = filter === "all" ||
            (filter === "verified" && user.verified) ||
            (filter === "unverified" && !user.verified) ||
            user.status === filter;
        const matchesSearch = user.name.includes(search) || user.email.includes(search) || user.phone.includes(search);
        return matchesFilter && matchesSearch;
    });

    const handleVerify = (id: string) => {
        setUsers(users.map((u) => (u.id === id ? { ...u, verified: true } : u)));
    };

    const handleSuspend = (id: string) => {
        setUsers(users.map((u) => (u.id === id ? { ...u, status: "suspended" } : u)));
    };

    const handleBan = (id: string) => {
        if (confirm("هل أنت متأكد من حظر هذا المستخدم؟")) {
            setUsers(users.map((u) => (u.id === id ? { ...u, status: "banned" } : u)));
        }
    };

    const handleActivate = (id: string) => {
        setUsers(users.map((u) => (u.id === id ? { ...u, status: "active" } : u)));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
                    <p className="text-[var(--foreground-muted)]">
                        {formatNumber(users.length)} مستخدم • {users.filter(u => u.verified).length} موثق
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

            {/* Users Table */}
            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
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
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-[var(--background-secondary)]">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{user.name}</span>
                                                    {user.verified && (
                                                        <span className="text-[var(--secondary)]" title="موثق">✓</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-[var(--foreground-muted)]">#{user.id}</div>
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
                                            <span>{user.rating}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded-lg ${statusColors[user.status]}`}>
                                            {statusLabels[user.status]}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[var(--foreground-muted)]">{user.joinDate}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            {!user.verified && user.status === "active" && (
                                                <button
                                                    onClick={() => handleVerify(user.id)}
                                                    className="p-2 rounded-lg bg-[var(--secondary)]/10 text-[var(--secondary)] hover:bg-[var(--secondary)]/20"
                                                    title="توثيق"
                                                >
                                                    ✓
                                                </button>
                                            )}
                                            {user.status === "active" && (
                                                <button
                                                    onClick={() => handleSuspend(user.id)}
                                                    className="p-2 rounded-lg bg-[var(--warning)]/10 text-[var(--warning)] hover:bg-[var(--warning)]/20"
                                                    title="إيقاف مؤقت"
                                                >
                                                    ⏸
                                                </button>
                                            )}
                                            {user.status !== "banned" && (
                                                <button
                                                    onClick={() => handleBan(user.id)}
                                                    className="p-2 rounded-lg bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20"
                                                    title="حظر"
                                                >
                                                    🚫
                                                </button>
                                            )}
                                            {user.status !== "active" && (
                                                <button
                                                    onClick={() => handleActivate(user.id)}
                                                    className="p-2 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--secondary)]/10"
                                                    title="تفعيل"
                                                >
                                                    ▶
                                                </button>
                                            )}
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
                        عرض {filteredUsers.length} من {users.length} مستخدم
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
