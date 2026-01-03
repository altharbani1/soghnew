"use client";

import { useState, useEffect } from "react";

interface LocationMapProps {
    latitude?: number;
    longitude?: number;
    address?: string;
    city?: string;
    interactive?: boolean;
    onLocationSelect?: (lat: number, lng: number, address: string) => void;
}

// Saudi Arabia city coordinates
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    "الرياض": { lat: 24.7136, lng: 46.6753 },
    "جدة": { lat: 21.4858, lng: 39.1925 },
    "مكة": { lat: 21.3891, lng: 39.8579 },
    "المدينة": { lat: 24.5247, lng: 39.5692 },
    "الدمام": { lat: 26.4207, lng: 50.0888 },
    "الخبر": { lat: 26.2172, lng: 50.1971 },
    "الطائف": { lat: 21.2854, lng: 40.4150 },
    "تبوك": { lat: 28.3835, lng: 36.5662 },
    "أبها": { lat: 18.2164, lng: 42.5053 },
    "القصيم": { lat: 26.3260, lng: 43.9750 },
};

export default function LocationMap({
    latitude,
    longitude,
    address,
    city,
    interactive = false,
    onLocationSelect,
}: LocationMapProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState(false);

    // Get coordinates from city if not provided
    const coords = latitude && longitude
        ? { lat: latitude, lng: longitude }
        : city && cityCoordinates[city]
            ? cityCoordinates[city]
            : { lat: 24.7136, lng: 46.6753 }; // Default to Riyadh

    useEffect(() => {
        // Simulate map loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    onLocationSelect?.(
                        position.coords.latitude,
                        position.coords.longitude,
                        "موقعك الحالي"
                    );
                },
                () => {
                    setMapError(true);
                }
            );
        }
    };

    // Google Maps embed URL
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${coords.lat},${coords.lng}&zoom=14`;

    return (
        <div className="rounded-xl overflow-hidden border border-[var(--border)]">
            {/* Map Header */}
            <div className="p-3 bg-[var(--background-secondary)] border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="text-sm font-medium">{address || city || "الموقع"}</span>
                </div>
                {interactive && (
                    <button
                        onClick={handleGetCurrentLocation}
                        className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="1" />
                            <line x1="12" x2="12" y1="2" y2="4" />
                            <line x1="12" x2="12" y1="20" y2="22" />
                            <line x1="2" x2="4" y1="12" y2="12" />
                            <line x1="20" x2="22" y1="12" y2="12" />
                        </svg>
                        موقعي الحالي
                    </button>
                )}
            </div>

            {/* Map */}
            <div className="relative h-[250px] bg-[var(--background-secondary)]">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full"></div>
                    </div>
                ) : mapError ? (
                    <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" className="mx-auto mb-2">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <p className="text-[var(--foreground-muted)]">تعذر تحميل الخريطة</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Static Map Image as fallback (works without API key) */}
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{
                                backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.lng}&zoom=14&size=600x250&markers=color:red%7C${coords.lat},${coords.lng}&key=')`,
                                backgroundColor: 'var(--background-secondary)',
                            }}
                        >
                            {/* Map Placeholder with city name */}
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-blue-100/50 to-blue-200/50 dark:from-blue-900/20 dark:to-blue-800/20">
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-full bg-[var(--error)] flex items-center justify-center mx-auto mb-2 shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                            <circle cx="12" cy="10" r="3" fill="var(--error)" />
                                        </svg>
                                    </div>
                                    <p className="font-medium text-[var(--foreground)]">{city || "الرياض"}</p>
                                    <p className="text-xs text-[var(--foreground-muted)]">{address || "المملكة العربية السعودية"}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Open in Google Maps */}
            <a
                href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 text-center text-sm text-[var(--primary)] hover:bg-[var(--background-secondary)] border-t border-[var(--border)] transition-colors"
            >
                فتح في خرائط Google ↗
            </a>
        </div>
    );
}

// Mini Location Badge
interface LocationBadgeProps {
    city: string;
    onClick?: () => void;
}

export function LocationBadge({ city, onClick }: LocationBadgeProps) {
    return (
        <button
            onClick={onClick}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] text-sm hover:bg-[var(--primary)]/20 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
            {city}
        </button>
    );
}
