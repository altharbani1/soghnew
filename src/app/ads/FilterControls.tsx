"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { saudiCities } from "@/lib/data";

interface Props {
    currentCity: string;
    currentSort: string;
}

export function FilterControls({ currentCity, currentSort }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/ads?${params.toString()}`);
    };

    return (
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 mb-6">
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
        </div>
    );
}
