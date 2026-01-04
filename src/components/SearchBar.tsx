"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
    type: "ad" | "category";
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
    href: string;
}

interface Ad {
    id: string;
    title: string;
    price: number;
    city: string;
    category: {
        name: string;
        icon?: string;
    };
}

export function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Search from API
    useEffect(() => {
        const searchTimer = setTimeout(async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`/api/ads?search=${encodeURIComponent(query)}&limit=6`);
                if (res.ok) {
                    const data = await res.json();
                    const searchResults: SearchResult[] = data.ads.map((ad: Ad) => ({
                        type: "ad",
                        id: ad.id,
                        title: ad.title,
                        subtitle: `${ad.price.toLocaleString("ar-SA")} ريال - ${ad.city}`,
                        icon: ad.category?.icon || "📦",
                        href: `/ads/${ad.id}`,
                    }));
                    setResults(searchResults);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(searchTimer);
    }, [query]);

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && results[selectedIndex]) {
                router.push(results[selectedIndex].href);
                setIsOpen(false);
            } else {
                handleSearch();
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full max-w-xl mx-auto" ref={resultsRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="ابحث عن سيارة، شقة، جوال..."
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                    onClick={handleSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/70 hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </button>
            </div>

            {/* Results Dropdown */}
            {isOpen && query.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] rounded-xl border border-[var(--border)] shadow-xl overflow-hidden z-50 animate-fadeIn">
                    {isLoading ? (
                        <div className="p-6 text-center">
                            <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="p-2">
                                {results.map((result, index) => (
                                    <Link
                                        key={result.id}
                                        href={result.href}
                                        className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${index === selectedIndex ? "bg-[var(--primary)]/10" : "hover:bg-[var(--background-secondary)]"
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="text-xl">{result.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate text-[var(--foreground)]">{result.title}</p>
                                            {result.subtitle && (
                                                <p className="text-xs text-[var(--foreground-muted)] truncate">{result.subtitle}</p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="p-2 border-t border-[var(--border)] bg-[var(--background-secondary)]">
                                <button
                                    onClick={handleSearch}
                                    className="w-full text-sm text-[var(--primary)] hover:underline flex items-center justify-center gap-1"
                                >
                                    عرض جميع نتائج &quot;{query}&quot;
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="p-6 text-center">
                            <div className="text-3xl mb-2">🔍</div>
                            <p className="text-sm text-[var(--foreground-muted)]">لا توجد نتائج لـ &quot;{query}&quot;</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
