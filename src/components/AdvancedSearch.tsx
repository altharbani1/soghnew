"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { categories, sampleAds, saudiCities } from "@/lib/data";

interface SearchResult {
    type: "ad" | "category" | "subcategory" | "city";
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
    href: string;
}

export default function AdvancedSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Search logic
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const searchResults: SearchResult[] = [];
        const queryLower = query.toLowerCase();

        // Search categories
        categories.forEach((cat) => {
            if (cat.name.includes(query) || cat.slug.includes(queryLower)) {
                searchResults.push({
                    type: "category",
                    id: cat.id,
                    title: cat.name,
                    subtitle: `${cat.count.toLocaleString("ar-SA")} إعلان`,
                    icon: cat.icon,
                    href: `/categories/${cat.slug}`,
                });
            }

            // Search subcategories
            cat.subcategories?.forEach((sub) => {
                if (sub.name.includes(query) || sub.slug.includes(queryLower)) {
                    searchResults.push({
                        type: "subcategory",
                        id: sub.id,
                        title: sub.name,
                        subtitle: `في ${cat.name}`,
                        icon: cat.icon,
                        href: `/categories/${cat.slug}/${sub.slug}`,
                    });
                }
            });
        });

        // Search cities
        saudiCities.forEach((city) => {
            if (city.includes(query)) {
                searchResults.push({
                    type: "city",
                    id: city,
                    title: city,
                    subtitle: "مدينة",
                    icon: "📍",
                    href: `/search?city=${city}`,
                });
            }
        });

        // Search ads
        sampleAds.forEach((ad) => {
            if (ad.title.includes(query) || ad.description.includes(query)) {
                searchResults.push({
                    type: "ad",
                    id: ad.id,
                    title: ad.title,
                    subtitle: `${ad.price.toLocaleString("ar-SA")} ريال - ${ad.location}`,
                    icon: "📦",
                    href: `/ads/${ad.id}`,
                });
            }
        });

        setResults(searchResults.slice(0, 8));
        setSelectedIndex(-1);
    }, [query]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, -1));
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault();
            window.location.href = results[selectedIndex].href;
        } else if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "category": return "قسم";
            case "subcategory": return "قسم فرعي";
            case "city": return "مدينة";
            case "ad": return "إعلان";
            default: return "";
        }
    };

    return (
        <div className="relative w-full" ref={resultsRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="ابحث عن سيارة، شقة، جوال..."
                    className="input pr-12 pl-4 w-full"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </div>
            </div>

            {/* Results Dropdown */}
            {isOpen && query.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] rounded-xl border border-[var(--border)] shadow-lg overflow-hidden z-50 animate-fadeIn">
                    {results.length > 0 ? (
                        <>
                            <div className="p-2">
                                {results.map((result, index) => (
                                    <Link
                                        key={`${result.type}-${result.id}`}
                                        href={result.href}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${index === selectedIndex ? "bg-[var(--primary)]/10" : "hover:bg-[var(--background-secondary)]"
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="text-2xl">{result.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{result.title}</p>
                                            {result.subtitle && (
                                                <p className="text-sm text-[var(--foreground-muted)] truncate">{result.subtitle}</p>
                                            )}
                                        </div>
                                        <span className="text-xs text-[var(--foreground-muted)] bg-[var(--background-secondary)] px-2 py-1 rounded">
                                            {getTypeLabel(result.type)}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                            <div className="p-3 border-t border-[var(--border)] bg-[var(--background-secondary)]">
                                <Link
                                    href={`/search?q=${encodeURIComponent(query)}`}
                                    className="text-sm text-[var(--primary)] hover:underline flex items-center justify-center gap-1"
                                >
                                    عرض جميع نتائج "{query}"
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="text-4xl mb-2">🔍</div>
                            <p className="text-[var(--foreground-muted)]">لا توجد نتائج لـ "{query}"</p>
                        </div>
                    )}
                </div>
            )}

            {/* Quick Suggestions (when focused but no query) */}
            {isOpen && !query.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] rounded-xl border border-[var(--border)] shadow-lg overflow-hidden z-50 animate-fadeIn">
                    <div className="p-4">
                        <p className="text-sm text-[var(--foreground-muted)] mb-3">الأكثر بحثاً</p>
                        <div className="flex flex-wrap gap-2">
                            {["سيارات للبيع", "شقق للإيجار", "ايفون", "لاند كروزر", "وظائف الرياض"].map((term) => (
                                <button
                                    key={term}
                                    onClick={() => setQuery(term)}
                                    className="px-3 py-1.5 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--border)] text-sm transition-colors"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 border-t border-[var(--border)]">
                        <p className="text-sm text-[var(--foreground-muted)] mb-3">الأقسام الرئيسية</p>
                        <div className="flex flex-wrap gap-2">
                            {categories.slice(0, 6).map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/categories/${cat.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="px-3 py-1.5 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--border)] text-sm transition-colors flex items-center gap-1"
                                >
                                    <span>{cat.icon}</span>
                                    <span>{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
