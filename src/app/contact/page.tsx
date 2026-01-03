"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-12">
                <div className="container max-w-4xl">
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                        {/* Hero */}
                        <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 p-8 text-center">
                            <h1 className="text-3xl font-bold mb-4">تواصل معنا</h1>
                            <p className="text-lg text-[var(--foreground-muted)]">
                                نحن هنا لمساعدتك. أرسل لنا رسالتك وسنرد عليك في أقرب وقت
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Contact Info */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold">معلومات التواصل</h2>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 bg-[var(--background-secondary)] rounded-xl">
                                            <span className="text-2xl">📧</span>
                                            <div>
                                                <h3 className="font-semibold">البريد الإلكتروني</h3>
                                                <p className="text-[var(--foreground-muted)]">support@souqah.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-[var(--background-secondary)] rounded-xl">
                                            <span className="text-2xl">📱</span>
                                            <div>
                                                <h3 className="font-semibold">واتساب</h3>
                                                <p className="text-[var(--foreground-muted)]">+966 50 000 0000</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-[var(--background-secondary)] rounded-xl">
                                            <span className="text-2xl">🕐</span>
                                            <div>
                                                <h3 className="font-semibold">ساعات العمل</h3>
                                                <p className="text-[var(--foreground-muted)]">24/7 - نحن متصلون دائماً</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Form */}
                                <div>
                                    {submitted ? (
                                        <div className="text-center py-12">
                                            <div className="text-5xl mb-4">✅</div>
                                            <h3 className="text-xl font-bold mb-2">تم إرسال رسالتك!</h3>
                                            <p className="text-[var(--foreground-muted)]">
                                                شكراً لتواصلك معنا. سنرد عليك قريباً
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">الاسم</label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="input"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">الموضوع</label>
                                                <select
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    className="input cursor-pointer"
                                                    required
                                                >
                                                    <option value="">اختر الموضوع</option>
                                                    <option value="general">استفسار عام</option>
                                                    <option value="support">دعم فني</option>
                                                    <option value="report">بلاغ</option>
                                                    <option value="suggestion">اقتراح</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">الرسالة</label>
                                                <textarea
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    className="input min-h-[120px] resize-none"
                                                    required
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-primary w-full">
                                                إرسال الرسالة
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
