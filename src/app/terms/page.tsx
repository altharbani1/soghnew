import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-12">
                <div className="container max-w-4xl">
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                        {/* Hero */}
                        <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 p-8">
                            <h1 className="text-3xl font-bold mb-2">الشروط والأحكام</h1>
                            <p className="text-[var(--foreground-muted)]">آخر تحديث: يناير 2026</p>
                        </div>

                        {/* Content */}
                        <div className="p-8 prose prose-lg max-w-none">
                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-4">1. مقدمة</h2>
                                <p className="text-[var(--foreground-muted)] leading-relaxed">
                                    مرحباً بك في سوقه. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام.
                                    يرجى قراءتها بعناية قبل استخدام خدماتنا.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-4">2. استخدام الموقع</h2>
                                <ul className="list-disc list-inside space-y-2 text-[var(--foreground-muted)]">
                                    <li>يجب أن يكون عمرك 18 عاماً أو أكثر لاستخدام خدماتنا</li>
                                    <li>يجب تقديم معلومات صحيحة ودقيقة عند التسجيل</li>
                                    <li>أنت مسؤول عن الحفاظ على سرية حسابك</li>
                                    <li>يُمنع استخدام الموقع لأي أغراض غير قانونية</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-4">3. قواعد نشر الإعلانات</h2>
                                <ul className="list-disc list-inside space-y-2 text-[var(--foreground-muted)]">
                                    <li>يجب أن يكون المحتوى صادقاً ودقيقاً</li>
                                    <li>يُمنع نشر محتوى مخالف للقوانين أو الآداب العامة</li>
                                    <li>يُمنع نشر إعلانات لمنتجات محظورة</li>
                                    <li>يُمنع نشر معلومات اتصال وهمية</li>
                                    <li>يحق للموقع حذف أي إعلان مخالف دون إشعار</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-4">4. المسؤولية</h2>
                                <p className="text-[var(--foreground-muted)] leading-relaxed">
                                    سوقه هي منصة وساطة فقط ولا تتحمل مسؤولية المعاملات بين البائعين والمشترين.
                                    يُنصح بالتحقق من المنتجات قبل الشراء والتعامل بحذر.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-4">5. الملكية الفكرية</h2>
                                <p className="text-[var(--foreground-muted)] leading-relaxed">
                                    جميع محتويات الموقع ملك لسوقه. يُمنع نسخ أو استخدام أي جزء من الموقع
                                    دون إذن مسبق.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-4">6. إنهاء الحساب</h2>
                                <p className="text-[var(--foreground-muted)] leading-relaxed">
                                    يحق لنا إنهاء أو تعليق حسابك في أي وقت إذا انتهكت هذه الشروط.
                                </p>
                            </section>

                            <section className="text-center pt-8 border-t border-[var(--border)]">
                                <p className="text-[var(--foreground-muted)] mb-4">
                                    إذا كان لديك أي استفسار، لا تتردد في التواصل معنا
                                </p>
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
