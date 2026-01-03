import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdListItem from "@/components/AdListItem";
import prisma from "@/lib/db";
import { categories as localCategories, getCategoryBySlug, saudiCities } from "@/lib/data";
import { CategoryFilters } from "./CategoryFilters";

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{
        subcategory?: string;
        city?: string;
        sort?: string;
    }>;
}

async function getCategoryData(slug: string) {
    // Try database first
    try {
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                subcategories: true,
                _count: { select: { ads: true } }
            }
        });
        if (category) return category;
    } catch (error) {
        console.error("Error fetching category:", error);
    }

    // Fallback to local data
    const localCat = getCategoryBySlug(slug);
    if (localCat) {
        return {
            id: localCat.id,
            name: localCat.name,
            slug: localCat.slug,
            icon: localCat.icon,
            color: localCat.color,
            subcategories: localCat.subcategories?.map(sub => ({
                id: sub.id,
                name: sub.name,
                slug: sub.slug,
                icon: sub.icon
            })) || []
        };
    }
    return null;
}

async function getAds(categorySlug: string, subcategory?: string, city?: string, sort?: string) {
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
                category: { slug: categorySlug },
                ...(subcategory ? { subcategory: { slug: subcategory } } : {}),
                ...(city ? { city } : {}),
            },
            orderBy,
            take: 50,
            include: {
                category: { select: { name: true } }
            }
        });

        return ads;
    } catch (error) {
        console.error("Error fetching ads:", error);
        return [];
    }
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const search = await searchParams;

    const [category, ads] = await Promise.all([
        getCategoryData(slug),
        getAds(slug, search.subcategory, search.city, search.sort)
    ]);

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
                <Header />
                <main className="flex-1 flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📁</div>
                        <h1 className="text-2xl font-bold mb-2">القسم غير موجود</h1>
                        <Link href="/categories" className="btn btn-primary">
                            تصفح الأقسام
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-6">
                <div className="container">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-6">
                        <Link href="/" className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
                            الرئيسية
                        </Link>
                        <span className="text-[var(--foreground-muted)]">←</span>
                        <Link href="/categories" className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
                            الأقسام
                        </Link>
                        <span className="text-[var(--foreground-muted)]">←</span>
                        <span className="font-medium">{category.name}</span>
                    </nav>

                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                            style={{ backgroundColor: category.color ? `${category.color}15` : "#e2e8f0" }}
                        >
                            {category.icon}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{category.name}</h1>
                            <p className="text-[var(--foreground-muted)]">{ads.length} إعلان</p>
                        </div>
                    </div>

                    {/* Filters - Client Component */}
                    <CategoryFilters
                        categorySlug={slug}
                        subcategories={category.subcategories || []}
                        currentSubcategory={search.subcategory || ""}
                        currentCity={search.city || ""}
                        currentSort={search.sort || "newest"}
                    />

                    {/* Ads List */}
                    {ads.length > 0 ? (
                        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
                            <div className="p-3 border-b border-[var(--border)] text-sm text-[var(--foreground-muted)]">
                                {ads.length} نتيجة
                            </div>
                            {ads.map((ad) => (
                                <AdListItem
                                    key={ad.id}
                                    id={ad.id}
                                    title={ad.title}
                                    price={Number(ad.price)}
                                    location={ad.district ? `${ad.district}, ${ad.city}` : ad.city}
                                    date={new Date(ad.createdAt).toLocaleDateString('ar-SA')}
                                    category={ad.category?.name || category.name}
                                    featured={ad.isFeatured}
                                    views={ad.viewsCount}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-12 text-center">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-lg font-semibold mb-2">لا توجد إعلانات</h3>
                            <p className="text-[var(--foreground-muted)] mb-4">
                                لا توجد إعلانات في هذا القسم حالياً
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
