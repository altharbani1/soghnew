import Link from "next/link";
import Image from "next/image";

interface AdGridCardProps {
    id: string;
    title: string;
    price: number;
    location: string;
    date: string;
    imageUrl?: string;
    featured?: boolean;
}

export default function AdGridCard({
    id,
    title,
    price,
    location,
    date,
    imageUrl,
    featured = false,
}: AdGridCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ar-SA", {
            style: "currency",
            currency: "SAR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Link href={`/ads/${id}`} className="block">
            <article className={`card group overflow-hidden ${featured ? "ring-2 ring-[var(--warning)]" : ""}`}>
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--background-secondary)]">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-[var(--foreground-muted)]">
                            📷
                        </div>
                    )}
                    {featured && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--warning)] text-white">
                            ⭐ مميز
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-3">
                    <h3 className="font-medium text-sm mb-1.5 line-clamp-2 group-hover:text-[var(--primary)] transition-colors min-h-[2.5rem]">
                        {title}
                    </h3>

                    <p className="text-base font-bold text-[var(--primary)] mb-2">
                        {formatPrice(price)}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
