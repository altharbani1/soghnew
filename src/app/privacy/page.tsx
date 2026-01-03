import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-12">
                <div className="container max-w-4xl">
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                        {/* Hero */}
                        <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 p-8">
                            <h1 className="text-3xl font-bold mb-2">سياسة الخصوصية</h1>
                            <p className="text-[var(--foreground-muted)]">آخر تحديث: يناير 2026</p>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    🔒 التزامنا بخصوصيتك
                                </h2>
                                <p className="text-[var(--foreground-muted)] leading-relaxed">
                                    نحن في سوقه نأخذ خصوصيتك على محمل الجد. توضح هذه السياسة كيفية جمع
                                    واستخدام وحماية معلوماتك الشخصية.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-4">المعلومات التي نجمعها</h2>
                                <div className="space-y-4">
                                    <div className="p-4 bg-[var(--background-secondary)] rounded-xl">
                                        <h3 className="font-semibold mb-2">📋 معلومات الحساب</h3>
                                        <p className="text-sm text-[var(--foreground-muted)]">
                                            الاسم، البريد الإلكتروني، رقم الهاتف عند التسجيل
                                        </p>
                                    </div>
                                    <div className="p-4 bg-[var(--background-secondary)] rounded-xl">
                                        <h3 className="font-semibold mb-2">📢 معلومات الإعلانات</h3>
                                        <p className="text-sm text-[var(--foreground-muted)]">
                                            تفاصيل الإعلانات والصور ومعلومات الاتصال التي تنشرها
                                        </p>
                                    </div>
                                    <div className="p-4 bg-[var(--background-secondary)] rounded-xl">
                                        <h3 className="font-semibold mb-2">📱 معلومات الجهاز</h3>
                                        <p className="text-sm text-[var(--foreground-muted)]">
                                            نوع المتصفح، عنوان IP، ومعلومات الجهاز المستخدم
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-4">كيف نستخدم معلوماتك</h2>
                                <ul className="list-disc list-inside space-y-2 text-[var(--foreground-muted)]">
                                    <li>تقديم وتحسين خدماتنا</li>
                                    <li>التواصل معك بخصوص حسابك وإعلاناتك</li>
                                    <li>حماية الموقع من الاستخدام غير المشروع</li>
                                    <li>إرسال إشعارات مهمة (يمكنك إلغاء الاشتراك)</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-4">حماية معلوماتك</h2>
                                <p className="text-[var(--foreground-muted)] leading-relaxed mb-4">
                                    نستخدم تقنيات أمان متقدمة لحماية بياناتك:
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-[var(--secondary)]/10 rounded-xl text-center">
                                        <div className="text-2xl mb-2">🔐</div>
                                        <span className="text-sm font-medium">تشفير SSL</span>
                                    </div>
                                    <div className="p-4 bg-[var(--secondary)]/10 rounded-xl text-center">
                                        <div className="text-2xl mb-2">🛡️</div>
                                        <span className="text-sm font-medium">حماية البيانات</span>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-bold mb-4">حقوقك</h2>
                                <ul className="list-disc list-inside space-y-2 text-[var(--foreground-muted)]">
                                    <li>الوصول إلى بياناتك الشخصية</li>
                                    <li>تصحيح أو تحديث معلوماتك</li>
                                    <li>حذف حسابك وبياناتك</li>
                                    <li>إلغاء الاشتراك من الإشعارات</li>
                                </ul>
                            </section>

                            <section className="text-center pt-8 border-t border-[var(--border)]">
                                <p className="text-[var(--foreground-muted)] mb-4">
                                    لأي استفسارات حول الخصوصية، تواصل معنا
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
