"use client";

import { useState, useEffect } from "react";
import { formatNumber } from "@/lib/data";

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
    description: string | null;
    isActive: boolean;
    _count: {
        ads: number;
        subcategories: number;
    };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = currentCategory.id ? "PUT" : "POST";
            const url = currentCategory.id
                ? `/api/admin/categories/${currentCategory.id}`
                : "/api/admin/categories";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentCategory),
            });

            if (res.ok) {
                setIsEditing(false);
                setCurrentCategory({});
                fetchCategories();
            } else {
                alert("حدث خطأ أثناء الحفظ");
            }
        } catch (error) {
            console.error(error);
            alert("حدث خطأ");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا القسم؟ قد يؤثر ذلك على الإعلانات المرتبطة.")) return;
        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setCategories(categories.filter(c => c.id !== id));
            } else {
                alert("لا يمكن حذف القسم، ربما يحتوي على بيانات مرتبطة.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">إدارة الأقسام</h1>
                    <p className="text-[var(--foreground-muted)]">
                        {formatNumber(categories.length)} قسم رئيسي
                    </p>
                </div>
                <button
                    onClick={() => { setCurrentCategory({}); setIsEditing(true); }}
                    className="btn btn-primary"
                >
                    + إضافة قسم جديد
                </button>
            </div>

            {isEditing && (
                <div className="bg-[var(--background)] p-6 rounded-2xl border border-[var(--border)] mb-6">
                    <h2 className="text-lg font-bold mb-4">
                        {currentCategory.id ? "تعديل القسم" : "قشم جديد"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">اسم القسم</label>
                                <input
                                    type="text"
                                    value={currentCategory.name || ""}
                                    onChange={e => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                    className="input w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Slug (الرابط)</label>
                                <input
                                    type="text"
                                    value={currentCategory.slug || ""}
                                    onChange={e => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                                    className="input w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">الأيقونة (Emoji أو رابط)</label>
                                <input
                                    type="text"
                                    value={currentCategory.icon || ""}
                                    onChange={e => setCurrentCategory({ ...currentCategory, icon: e.target.value })}
                                    className="input w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">لون القسم</label>
                                <input
                                    type="color"
                                    value={currentCategory.color || "#000000"}
                                    onChange={e => setCurrentCategory({ ...currentCategory, color: e.target.value })}
                                    className="input w-full h-10 p-1"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">الوصف</label>
                            <textarea
                                value={currentCategory.description || ""}
                                onChange={e => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                className="input w-full h-24 resize-none"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="btn btn-secondary"
                            >
                                إلغاء
                            </button>
                            <button type="submit" className="btn btn-primary">
                                حفظ
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${cat.color}20`, color: cat.color || 'inherit' }}>
                                {cat.icon || "📁"}
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => { setCurrentCategory(cat); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--secondary)]"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--error)]"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                        <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 mb-4 h-10">
                            {cat.description || "لا يوجد وصف"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)] border-t border-[var(--border)] pt-4">
                            <span>📦 {cat._count.subcategories} قسم فرعي</span>
                            <span>📝 {cat._count.ads} إعلان</span>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && categories.length === 0 && (
                <div className="text-center py-12 text-[var(--foreground-muted)]">
                    لا توجد أقسام حتى الآن. ابدأ بإضافة قسم جديد!
                </div>
            )}
        </div>
    );
}
