"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { saudiCities } from "@/lib/data";

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
}

interface Props {
    categorySlug: string;
    subcategories: Subcategory[];
    currentSubcategory: string;
    currentCity: string;
    currentSort: string;
}

export function CategoryFilters({
    categorySlug,
    subcategories,
    currentSubcategory,
    currentCity,
    currentSort
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/categories/${categorySlug}?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push(`/categories/${categorySlug}`);
    };

    const hasFilters = currentSubcategory || currentCity || currentSort !== "newest";

    return (
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 mb-6">
            {/* Subcategories */}
            {subcategories.length > 0 && (
                <div className="mb-4 pb-4 border-b border-[var(--border)]">
                    <label className="block text-sm font-medium mb-2">القسم الفرعي</label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => updateFilter("subcategory", "")}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${!currentSubcategory
                                ? "bg-[var(--primary)] text-white"
                                : "bg-[var(--background-secondary)] hover:bg-[var(--primary)]/10"
                                }`}
                        >
                            الكل
                        </button>
                        {subcategories.map((sub) => (
                            <button
                                key={sub.id}
                                onClick={() => updateFilter("subcategory", sub.slug)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${currentSubcategory === sub.slug
                                    ? "bg-[var(--primary)] text-white"
                                    : "bg-[var(--background-secondary)] hover:bg-[var(--primary)]/10"
                                    }`}
                            >
                                {sub.icon && <span className="ml-1">{sub.icon}</span>}
                                {sub.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* City and Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">المدينة</label>
                    <select
                        value={currentCity}
                        onChange={(e) => updateFilter("city", e.target.value)}
                        className="input cursor-pointer"
                    >
                        <option value="">كل المدن</option>
                        {saudiCities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">الترتيب</label>
                    <select
                        value={currentSort}
                        onChange={(e) => updateFilter("sort", e.target.value)}
                        className="input cursor-pointer"
                    >
                        <option value="newest">الأحدث</option>
                        <option value="price-low">السعر: من الأقل</option>
                        <option value="price-high">السعر: من الأعلى</option>
                        <option value="views">الأكثر مشاهدة</option>
                    </select>
                </div>
            </div>

            {/* Clear Filters */}
            {hasFilters && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                    <button
                        onClick={clearFilters}
                        className="text-sm text-[var(--primary)] hover:underline"
                    >
                        ✕ مسح كل الفلاتر
                    </button>
                </div>
            )}
        </div>
    );
}
