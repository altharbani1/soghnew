import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdGridCard from "@/components/AdGridCard";
import { categories, formatNumber, saudiCities } from "@/lib/data";
import prisma from "@/lib/db";
import { SearchBar } from "@/components/SearchBar";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";

async function getAds() {
  try {
    const ads = await prisma.ad.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: {
        user: {
          select: {
            name: true,
            phone: true,
          }
        },
        category: {
          select: {
            name: true,
            slug: true,
          }
        },
        images: {
          take: 1,
          orderBy: { displayOrder: "asc" }
        }
      }
    });
    return ads;
  } catch (error) {
    console.error("Error fetching ads:", error);
    return [];
  }
}

async function getFeaturedAds() {
  try {
    const ads = await prisma.ad.findMany({
      where: {
        status: "active",
        isFeatured: true
      },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          }
        },
        images: {
          take: 1,
          orderBy: { displayOrder: "asc" }
        }
      }
    });
    return ads;
  } catch (error) {
    console.error("Error fetching featured ads:", error);
    return [];
  }
}

export default async function Home() {
  const [recentAds, featuredAds] = await Promise.all([
    getAds(),
    getFeaturedAds()
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
      {/* Structured Data for SEO */}
      <OrganizationJsonLd />
      <WebsiteJsonLd />

      <Header />

      <main className="flex-1">
        {/* Compact Hero with Unified Search */}
        <section className="gradient-hero text-white py-6 md:py-8">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                بيع واشتري بكل سهولة
              </h1>
              <p className="text-sm opacity-80 mb-4">
                أكبر منصة للإعلانات المبوبة في السعودية
              </p>

              {/* Unified Search Bar */}
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Categories Grid - Compact */}
        <section className="py-6 bg-[var(--background)]">
          <div className="container">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">تصفح الأقسام</h2>
              <Link
                href="/categories"
                className="text-sm text-[var(--primary)] hover:underline"
              >
                عرض الكل ←
              </Link>
            </div>

            {/* Categories - Horizontal Scroll on Mobile, Grid on Desktop */}
            <div className="flex md:grid md:grid-cols-6 lg:grid-cols-12 gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible scrollbar-hide">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="flex-shrink-0 w-20 md:w-auto group flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[var(--background-secondary)] hover:bg-[var(--primary)]/5 border border-transparent hover:border-[var(--primary)]/20 transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <span className="text-xs font-medium text-center whitespace-nowrap">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Ads - Grid Cards */}
        {featuredAds.length > 0 && (
          <section className="py-6">
            <div className="container">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[var(--warning)]/20 flex items-center justify-center text-sm">⭐</span>
                  إعلانات مميزة
                </h2>
                <Link href="/ads?featured=true" className="text-sm text-[var(--primary)] hover:underline">
                  عرض الكل ←
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {featuredAds.map((ad) => (
                  <AdGridCard
                    key={ad.id}
                    id={ad.id}
                    title={ad.title}
                    price={Number(ad.price)}
                    location={ad.city}
                    date={new Date(ad.createdAt).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                    imageUrl={ad.images?.[0]?.imageUrl}
                    featured={true}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recent Ads - Grid Cards */}
        <section className="py-6">
          <div className="container">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">أحدث الإعلانات</h2>
              <Link href="/ads" className="text-sm text-[var(--primary)] hover:underline">
                عرض الكل ←
              </Link>
            </div>

            {recentAds.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {recentAds.map((ad) => (
                  <AdGridCard
                    key={ad.id}
                    id={ad.id}
                    title={ad.title}
                    price={Number(ad.price)}
                    location={ad.city}
                    date={new Date(ad.createdAt).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                    imageUrl={ad.images?.[0]?.imageUrl}
                    featured={ad.isFeatured}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-8 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="font-bold text-lg mb-2">لا توجد إعلانات حالياً</h3>
                <p className="text-[var(--foreground-muted)] mb-4">كن أول من يضيف إعلان!</p>
                <Link href="/ads/new" className="btn btn-primary">
                  أضف إعلانك الآن
                </Link>
              </div>
            )}

            {/* Load More */}
            {recentAds.length > 0 && (
              <div className="text-center mt-6">
                <Link href="/ads" className="btn btn-secondary">
                  عرض المزيد من الإعلانات
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Quick Add CTA */}
        <section className="py-8 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white text-center md:text-right">
              <div>
                <h2 className="text-xl font-bold mb-1">عندك شي تبيعه؟</h2>
                <p className="text-sm opacity-90">أضف إعلانك الآن مجاناً وابدأ البيع</p>
              </div>
              <Link
                href="/ads/new"
                className="btn bg-white text-[var(--primary)] hover:bg-white/90 px-8"
              >
                ✨ أضف إعلان مجاني
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
