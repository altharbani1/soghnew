import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdListItem from "@/components/AdListItem";
import prisma from "@/lib/db";
import { FilterControls } from "./FilterControls";

interface Props {
    searchParams: Promise<{
        city?: string;
        sort?: string;
    }>;
}

async function getAds(city?: string, sort?: string) {
    try {
        const orderBy: Record<string, "asc" | "desc"> = {};

        if (sort === "price-low") {
            orderBy.price = "asc";
        } else if (sort === "price-high") {
            orderBy.price = "desc";
        } else if (sort === "views") {
            orderBy.viewsCount = "desc";
        } else {
            orderBy.createdAt = "desc";
        }

        const ads = await prisma.ad.findMany({
            where: {
                status: "active",
                ...(city ? { city } : {}),
            },
            orderBy,
            take: 50,
            include: {
                category: {
                    select: { name: true }
                }
            }
        });

        return ads;
    } catch (error) {
        console.error("Error fetching ads:", error);
        return [];
    }
}

export default async function AllAdsPage({ searchParams }: Props) {
    const params = await searchParams;
    const ads = await getAds(params.city, params.sort);

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-6">
                <div className="container">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">جميع الإعلانات</h1>
                            <p className="text-sm text-[var(--foreground-muted)]">
                                تصفح أحدث الإعلانات المنشورة ({ads.length} إعلان)
                            </p>
                        </div>
                        <Link href="/ads/new" className="btn btn-primary text-center">
                            ➕ أضف إعلان
                        </Link>
                    </div>

                    {/* Filters - Client Component */}
                    <FilterControls
                        currentCity={params.city || ""}
                        currentSort={params.sort || "newest"}
                    />

                    {/* Ads List */}
                    {ads.length > 0 ? (
                        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
                            <div className="p-3 border-b border-[var(--border)] text-sm text-[var(--foreground-muted)]">
                                عدد النتائج: {ads.length} إعلان
                            </div>
                            {ads.map((ad) => (
                                <AdListItem
                                    key={ad.id}
                                    id={ad.id}
                                    slug={ad.slug}
                                    title={ad.title}
                                    price={Number(ad.price)}
                                    location={ad.district ? `${ad.district}, ${ad.city}` : ad.city}
                                    date={new Date(ad.createdAt).toLocaleDateString('ar-SA')}
                                    category={ad.category?.name || ""}
                                    featured={ad.isFeatured}
                                    views={ad.viewsCount}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-12 text-center">
                            <div className="text-5xl mb-4">📭</div>
                            <h3 className="text-lg font-semibold mb-2">لا توجد إعلانات</h3>
                            <p className="text-[var(--foreground-muted)] mb-4">
                                لم يتم العثور على أي إعلانات
                            </p>
                            <Link href="/ads/new" className="btn btn-primary">أضف أول إعلان</Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
