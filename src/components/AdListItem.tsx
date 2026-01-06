import Link from "next/link";

interface AdListItemProps {
    id: string;
    slug?: string | null;
    title: string;
    price: number;
    location: string;
    date: string;
    category: string;
    featured?: boolean;
    views: number;
    commentsCount?: number;
}

export default function AdListItem({
    id,
    slug,
    title,
    price,
    location,
    date,
    category,
    featured = false,
    views,
    commentsCount = 0,
}: AdListItemProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ar-SA", {
            style: "currency",
            currency: "SAR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Link href={`/ads/${slug || id}`} className="block">
            <article
                className={`
          group flex items-center gap-4 p-4 bg-[var(--background)] border-b border-[var(--border)]
          hover:bg-[var(--background-secondary)] transition-colors
          ${featured ? "bg-[var(--accent)]/5 border-r-4 border-r-[var(--accent)]" : ""}
        `}
            >
                {/* Category Icon */}
                <div className="hidden sm:flex w-12 h-12 rounded-lg bg-[var(--background-secondary)] items-center justify-center text-xl flex-shrink-0">
                    {category === "سيارات" && "🚗"}
                    {category === "عقارات" && "🏠"}
                    {category === "الكترونيات" && "📱"}
                    {category === "أثاث" && "🛋️"}
                    {category === "أزياء" && "👔"}
                    {category === "وظائف" && "💼"}
                    {category === "خدمات" && "🔧"}
                    {category === "أخرى" && "📦"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                        {featured && (
                            <span className="badge badge-warning text-xs flex-shrink-0">⭐ مميز</span>
                        )}
                        <h3 className="font-semibold text-base group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                            {title}
                        </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--foreground-muted)]">
                        <span className="badge badge-primary text-xs">{category}</span>
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {location}
                        </span>
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {date}
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6 text-sm text-[var(--foreground-muted)]">
                    <div className="text-center">
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>{views}</span>
                        </div>
                        <div className="text-xs">مشاهدة</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            <span>{commentsCount}</span>
                        </div>
                        <div className="text-xs">رد</div>
                    </div>
                </div>

                {/* Price */}
                <div className="text-left flex-shrink-0">
                    <div className="text-lg font-bold text-[var(--primary)]">
                        {formatPrice(price)}
                    </div>
                </div>

                {/* Arrow */}
                <div className="text-[var(--foreground-muted)] group-hover:text-[var(--primary)] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </div>
            </article>
        </Link>
    );
}
