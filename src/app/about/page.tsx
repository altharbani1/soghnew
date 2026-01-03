import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-12">
                <div className="container max-w-4xl">
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                        {/* Hero */}
                        <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 p-8 text-center">
                            <h1 className="text-3xl font-bold mb-4">عن سوقه</h1>
                            <p className="text-lg text-[var(--foreground-muted)]">
                                منصة الإعلانات المبوبة الأولى في المملكة العربية السعودية
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8">
                            <section>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    🎯 رؤيتنا
                                </h2>
                                <p className="text-[var(--foreground-muted)] leading-relaxed">
                                    نسعى لأن نكون المنصة الرائدة في مجال الإعلانات المبوبة في المملكة العربية السعودية،
                                    من خلال توفير تجربة سهلة وآمنة للبائعين والمشترين.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    💡 من نحن
                                </h2>
                                <p className="text-[var(--foreground-muted)] leading-relaxed">
                                    سوقه هي منصة إلكترونية متخصصة في الإعلانات المبوبة، تتيح للمستخدمين نشر
                                    إعلاناتهم والبحث عن المنتجات والخدمات في مختلف الأقسام مثل السيارات، العقارات،
                                    الإلكترونيات، والمزيد.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    ⭐ مميزاتنا
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-[var(--background-secondary)] rounded-xl">
                                        <div className="text-2xl mb-2">🆓</div>
                                        <h3 className="font-semibold mb-1">مجاني بالكامل</h3>
                                        <p className="text-sm text-[var(--foreground-muted)]">انشر إعلاناتك مجاناً</p>
                                    </div>
                                    <div className="p-4 bg-[var(--background-secondary)] rounded-xl">
                                        <div className="text-2xl mb-2">🔒</div>
                                        <h3 className="font-semibold mb-1">آمن وموثوق</h3>
                                        <p className="text-sm text-[var(--foreground-muted)]">حماية بياناتك أولويتنا</p>
                                    </div>
                                    <div className="p-4 bg-[var(--background-secondary)] rounded-xl">
                                        <div className="text-2xl mb-2">🚀</div>
                                        <h3 className="font-semibold mb-1">سريع وسهل</h3>
                                        <p className="text-sm text-[var(--foreground-muted)]">نشر الإعلان في دقائق</p>
                                    </div>
                                    <div className="p-4 bg-[var(--background-secondary)] rounded-xl">
                                        <div className="text-2xl mb-2">📱</div>
                                        <h3 className="font-semibold mb-1">متوافق مع الجوال</h3>
                                        <p className="text-sm text-[var(--foreground-muted)]">تصفح من أي جهاز</p>
                                    </div>
                                </div>
                            </section>

                            <section className="text-center pt-8 border-t border-[var(--border)]">
                                <h2 className="text-xl font-bold mb-4">هل لديك سؤال؟</h2>
                                <Link href="/contact" className="btn btn-primary">
                                    تواصل معنا
                                </Link>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
