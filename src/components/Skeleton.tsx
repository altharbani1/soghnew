"use client";

// Skeleton Card Component
export function SkeletonCard() {
    return (
        <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="aspect-[4/3] bg-gradient-to-r from-[var(--background-secondary)] via-[var(--border)] to-[var(--background-secondary)] bg-[length:200%_100%] animate-shimmer" />

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 bg-[var(--background-secondary)] rounded-lg w-3/4" />

                {/* Price */}
                <div className="h-6 bg-[var(--primary)]/10 rounded-lg w-1/2" />

                {/* Location & Date */}
                <div className="flex items-center gap-3">
                    <div className="h-4 bg-[var(--background-secondary)] rounded w-1/3" />
                    <div className="h-4 bg-[var(--background-secondary)] rounded w-1/4" />
                </div>
            </div>
        </div>
    );
}

// Skeleton List Item Component
export function SkeletonListItem() {
    return (
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 flex gap-4 animate-pulse">
            {/* Image Skeleton */}
            <div className="w-32 h-24 rounded-xl bg-gradient-to-r from-[var(--background-secondary)] via-[var(--border)] to-[var(--background-secondary)] bg-[length:200%_100%] animate-shimmer flex-shrink-0" />

            {/* Content Skeleton */}
            <div className="flex-1 space-y-3">
                <div className="h-5 bg-[var(--background-secondary)] rounded-lg w-2/3" />
                <div className="h-4 bg-[var(--background-secondary)] rounded w-1/2" />
                <div className="flex gap-3">
                    <div className="h-4 bg-[var(--background-secondary)] rounded w-20" />
                    <div className="h-4 bg-[var(--background-secondary)] rounded w-16" />
                </div>
            </div>

            {/* Price */}
            <div className="h-6 bg-[var(--primary)]/10 rounded-lg w-24 self-start" />
        </div>
    );
}

// Skeleton Category Card
export function SkeletonCategoryCard() {
    return (
        <div className="bg-[var(--background)] rounded-3xl border border-[var(--border)] overflow-hidden animate-pulse">
            {/* Header */}
            <div className="p-6 bg-[var(--background-secondary)]">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--border)]" />
                    <div className="flex-1 space-y-2">
                        <div className="h-5 bg-[var(--border)] rounded w-1/2" />
                        <div className="h-4 bg-[var(--border)] rounded w-1/3" />
                    </div>
                </div>
            </div>

            {/* Subcategories */}
            <div className="p-5 grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-[var(--background-secondary)] rounded-xl" />
                ))}
            </div>
        </div>
    );
}

// Skeleton Profile
export function SkeletonProfile() {
    return (
        <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-[var(--background-secondary)]" />
                <div className="flex-1 space-y-2">
                    <div className="h-6 bg-[var(--background-secondary)] rounded w-1/2" />
                    <div className="h-4 bg-[var(--background-secondary)] rounded w-1/3" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-[var(--background-secondary)] rounded-xl" />
                ))}
            </div>
        </div>
    );
}

// Skeleton Ad Detail
export function SkeletonAdDetail() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Main Card */}
            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                {/* Title Section */}
                <div className="p-6 border-b border-[var(--border)]">
                    <div className="h-7 bg-[var(--background-secondary)] rounded w-2/3 mb-4" />
                    <div className="flex gap-3">
                        <div className="h-5 bg-[var(--primary)]/10 rounded-full w-20" />
                        <div className="h-5 bg-[var(--background-secondary)] rounded w-24" />
                        <div className="h-5 bg-[var(--background-secondary)] rounded w-20" />
                    </div>
                </div>

                {/* Image */}
                <div className="p-6 border-b border-[var(--border)]">
                    <div className="aspect-video bg-gradient-to-r from-[var(--background-secondary)] via-[var(--border)] to-[var(--background-secondary)] bg-[length:200%_100%] animate-shimmer rounded-xl mb-4" />
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-20 h-20 bg-[var(--background-secondary)] rounded-lg" />
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="p-6 space-y-2">
                    <div className="h-4 bg-[var(--background-secondary)] rounded w-full" />
                    <div className="h-4 bg-[var(--background-secondary)] rounded w-5/6" />
                    <div className="h-4 bg-[var(--background-secondary)] rounded w-4/6" />
                </div>
            </div>
        </div>
    );
}

// Grid of Skeleton Cards
export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

// List of Skeleton Items
export function SkeletonListGrid({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonListItem key={i} />
            ))}
        </div>
    );
}

export default SkeletonCard;
