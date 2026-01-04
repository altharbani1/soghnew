import Link from "next/link";

interface AdCardProps {
    id: string;
    title: string;
    price: number;
    location: string;
    date: string;
    image: string;
    category: string;
    featured?: boolean;
}

export default function AdCard({
    id,
    title,
    price,
    location,
    date,
    image,
    category,
    featured = false,
}: AdCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ar-SA", {
            style: "currency",
            currency: "SAR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Link href={`/ads/${id}`} className="block">
            <article className={`card group ${featured ? "ring-2 ring-[var(--accent)]" : ""}`}>
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--background-secondary)]">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                    {featured && (
                        <span className="absolute top-3 right-3 badge badge-warning">
                            ⭐ مميز
                        </span>
                    )}
                    <span className="absolute top-3 left-3 badge badge-primary">
                        {category}
                    </span>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                        {title}
                    </h3>

                    <p className="text-xl font-bold text-[var(--primary)] mb-3">
                        {formatPrice(price)}
                    </p>

                    <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)]">
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {location}
                        </span>
                        <span>{date}</span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

