import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdListItem from "@/components/AdListItem";
import { categories, sampleAds, formatNumber, saudiCities } from "@/lib/data";

export default function Home() {
  const featuredAds = sampleAds.filter((ad) => ad.featured);
  const recentAds = sampleAds;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero text-white py-12 md:py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fadeIn">
                بيع واشتري بكل سهولة
              </h1>
              <p className="text-lg opacity-90 mb-6">
                أكبر منصة للإعلانات المبوبة في المملكة العربية السعودية
              </p>

              {/* Search Box */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="ابحث عن سيارة، شقة، جوال..."
                      className="w-full px-5 py-3 rounded-xl bg-white text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <select className="px-4 py-3 rounded-xl bg-white text-[var(--foreground)] focus:outline-none cursor-pointer">
                    <option value="">كل المدن</option>
                    {saudiCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <button className="btn bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white px-6 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    بحث
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold">+50,000</div>
                  <div className="text-white/80">إعلان نشط</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">+100,000</div>
                  <div className="text-white/80">مستخدم</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">+8</div>
                  <div className="text-white/80">أقسام</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-10 bg-[var(--background)]">
          <div className="container">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-lg">
                  📁
                </div>
                <div>
                  <h2 className="text-lg font-bold">تصفح الأقسام</h2>
                  <p className="text-xs text-[var(--foreground-muted)]">اكتشف {categories.length} قسم رئيسي</p>
                </div>
              </div>
              <Link
                href="/categories"
                className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                عرض الكل
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Link>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-[var(--background-secondary)] hover:bg-gradient-to-br hover:from-[var(--background)] hover:to-[var(--background-secondary)] border border-transparent hover:border-[var(--border)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"
                    style={{
                      backgroundColor: category.color,
                      boxShadow: `0 4px 12px ${category.color}30`
                    }}
                  >
                    <span className="drop-shadow-md">{category.icon}</span>
                  </div>
                  <span className="text-sm font-semibold whitespace-nowrap text-center group-hover:text-[var(--primary)] transition-colors">{category.name}</span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${category.color}15`,
                      color: category.color
                    }}
                  >
                    {formatNumber(category.count)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Ads */}
        {featuredAds.length > 0 && (
          <section className="py-6 bg-[var(--background-secondary)]">
            <div className="container">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  إعلانات مميزة
                </h2>
                <Link href="/ads?featured=true" className="text-sm text-[var(--primary)] hover:underline">
                  عرض الكل ←
                </Link>
              </div>

              <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
                {featuredAds.map((ad) => (
                  <AdListItem
                    key={ad.id}
                    id={ad.id}
                    title={ad.title}
                    price={ad.price}
                    location={ad.location}
                    date={ad.date}
                    category={ad.category}
                    featured={ad.featured}
                    views={ad.views}
                    commentsCount={3}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recent Ads */}
        <section className="py-6 bg-[var(--background-secondary)]">
          <div className="container">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">أحدث الإعلانات</h2>
              <Link href="/ads" className="text-sm text-[var(--primary)] hover:underline">
                عرض الكل ←
              </Link>
            </div>

            <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
              {recentAds.map((ad) => (
                <AdListItem
                  key={ad.id}
                  id={ad.id}
                  title={ad.title}
                  price={ad.price}
                  location={ad.location}
                  date={ad.date}
                  category={ad.category}
                  featured={ad.featured}
                  views={ad.views}
                  commentsCount={Math.floor(Math.random() * 10)}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-6">
              <button className="btn btn-secondary">
                تحميل المزيد من الإعلانات
              </button>
            </div>
          </div>
        </section>

        {/* Quick Add CTA */}
        <section className="py-8 bg-[var(--background)]">
          <div className="container">
            <div className="gradient-primary rounded-2xl p-6 md:p-8 text-white text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-3">
                عندك شي تبيعه؟
              </h2>
              <p className="opacity-90 mb-6 max-w-md mx-auto">
                أضف إعلانك الآن مجاناً ووصل لآلاف المشترين
              </p>
              <Link href="/ads/new" className="btn bg-white text-[var(--primary)] hover:bg-white/90 px-8">
                أضف إعلانك مجاناً
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
