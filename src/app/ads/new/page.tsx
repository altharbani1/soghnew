"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories, saudiCities, getNeighborhoods } from "@/lib/data";

// Simulated current user data (in production, get from auth context/API)
const currentUser = {
    id: "u1",
    name: "أحمد محمد",
    phone: "0501234567",
    email: "ahmed@example.com",
    verified: true,
};

export default function NewAdPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        subcategory: "",
        description: "",
        price: "",
        city: "",
        neighborhood: "",
        location: "",
        phone: currentUser.phone, // Auto-fill from user profile
        images: [] as File[],
    });

    // Update neighborhoods when city changes
    useEffect(() => {
        if (formData.city) {
            const neighborhoods = getNeighborhoods(formData.city);
            setAvailableNeighborhoods(neighborhoods);
            // Reset neighborhood when city changes
            if (!neighborhoods.includes(formData.neighborhood)) {
                setFormData(prev => ({ ...prev, neighborhood: "" }));
            }
        } else {
            setAvailableNeighborhoods([]);
        }
    }, [formData.city]);

    const selectedCategory = categories.find(c => c.slug === formData.category);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files).slice(0, 10 - imagePreviews.length);
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
    };

    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleImageUpload(e.dataTransfer.files);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // In production, this would save to database
        alert("تم نشر إعلانك بنجاح! ✅");
        router.push("/");
    };

    const isStep1Valid = formData.title && formData.category;
    const isStep2Valid = formData.description && formData.price;
    const isStep3Valid = formData.city && formData.neighborhood && formData.phone;

    const stepLabels = ["المعلومات الأساسية", "التفاصيل والصور", "التواصل والنشر"];

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-8">
                <div className="container max-w-3xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 px-4 py-2 rounded-full mb-4">
                            <span className="text-lg">✨</span>
                            <span className="text-sm font-medium text-[var(--primary)]">أضف إعلانك مجاناً</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                            أضف إعلانك الجديد
                        </h1>
                        <p className="text-[var(--foreground-muted)]">
                            أضف إعلانك في 3 خطوات بسيطة وابدأ البيع الآن
                        </p>
                    </div>

                    {/* Progress Steps - Enhanced */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between relative">
                            {/* Progress Line */}
                            <div className="absolute top-5 right-0 left-0 h-1 bg-[var(--border)] -z-10" />
                            <div
                                className="absolute top-5 right-0 h-1 bg-gradient-to-l from-[var(--primary)] to-[var(--secondary)] -z-10 transition-all duration-500"
                                style={{ width: `${((step - 1) / 2) * 100}%` }}
                            />

                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s
                                            ? "bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg"
                                            : "bg-[var(--background)] text-[var(--foreground-muted)] border-2 border-[var(--border)]"
                                            } ${step === s ? "scale-110 ring-4 ring-[var(--primary)]/20" : ""}`}
                                    >
                                        {step > s ? "✓" : s}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium transition-colors ${step >= s ? "text-[var(--primary)]" : "text-[var(--foreground-muted)]"
                                        }`}>
                                        {stepLabels[s - 1]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-[var(--background)] rounded-3xl border border-[var(--border)] shadow-xl overflow-hidden">
                        <form onSubmit={handleSubmit}>
                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <div className="p-8 space-y-6 animate-fadeIn">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-xl">
                                            📝
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">معلومات الإعلان الأساسية</h2>
                                            <p className="text-sm text-[var(--foreground-muted)]">أدخل عنوان الإعلان واختر القسم المناسب</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            عنوان الإعلان <span className="text-[var(--error)]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="مثال: ايفون 15 برو ماكس جديد بكرتونه"
                                            className="input text-lg"
                                            maxLength={100}
                                        />
                                        <div className="flex justify-between mt-1">
                                            <p className="text-xs text-[var(--foreground-muted)]">
                                                اكتب عنواناً واضحاً ومختصراً
                                            </p>
                                            <span className={`text-xs ${formData.title.length > 80 ? 'text-[var(--warning)]' : 'text-[var(--foreground-muted)]'}`}>
                                                {formData.title.length}/100
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-3">
                                            اختر القسم <span className="text-[var(--error)]">*</span>
                                        </label>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, category: cat.slug, subcategory: "" }))}
                                                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${formData.category === cat.slug
                                                        ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-lg scale-105"
                                                        : "border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--background-secondary)]"
                                                        }`}
                                                >
                                                    <div
                                                        className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl mb-2"
                                                        style={{
                                                            backgroundColor: formData.category === cat.slug ? cat.color : `${cat.color}15`
                                                        }}
                                                    >
                                                        {cat.icon}
                                                    </div>
                                                    <span className={`text-xs font-medium block text-center ${formData.category === cat.slug ? "text-[var(--primary)]" : ""
                                                        }`}>
                                                        {cat.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subcategory Selection */}
                                    {selectedCategory?.subcategories && selectedCategory.subcategories.length > 0 && (
                                        <div className="animate-fadeIn">
                                            <label className="block text-sm font-semibold mb-3">
                                                اختر القسم الفرعي (اختياري)
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCategory.subcategories.map((sub) => (
                                                    <button
                                                        key={sub.id}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, subcategory: sub.slug }))}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${formData.subcategory === sub.slug
                                                            ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                                                            : "border-[var(--border)] hover:border-[var(--primary)]/50"
                                                            }`}
                                                    >
                                                        <span>{sub.icon || '📁'}</span>
                                                        <span className="text-sm font-medium">{sub.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-6 border-t border-[var(--border)]">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            disabled={!isStep1Valid}
                                            className="btn btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            التالي
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="m15 18-6-6 6-6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Details */}
                            {step === 2 && (
                                <div className="p-8 space-y-6 animate-fadeIn">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] flex items-center justify-center text-white text-xl">
                                            📷
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">تفاصيل وصور الإعلان</h2>
                                            <p className="text-sm text-[var(--foreground-muted)]">أضف وصفاً تفصيلياً وصور جذابة</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            وصف الإعلان <span className="text-[var(--error)]">*</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="اكتب وصفاً تفصيلياً للإعلان...&#10;• الحالة: جديد/مستعمل&#10;• المواصفات والمميزات&#10;• سبب البيع&#10;• طريقة التسليم"
                                            className="input min-h-[180px] resize-none leading-relaxed"
                                            maxLength={2000}
                                        />
                                        <div className="flex justify-between mt-1">
                                            <p className="text-xs text-[var(--foreground-muted)]">
                                                وصف تفصيلي يزيد من فرص البيع
                                            </p>
                                            <span className={`text-xs ${formData.description.length > 1800 ? 'text-[var(--warning)]' : 'text-[var(--foreground-muted)]'}`}>
                                                {formData.description.length}/2000
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">
                                                السعر (ريال) <span className="text-[var(--error)]">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    placeholder="0"
                                                    className="input text-lg font-semibold pl-16"
                                                    min="0"
                                                />
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] font-medium">
                                                    ر.س
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">
                                                نوع السعر
                                            </label>
                                            <select className="input cursor-pointer">
                                                <option value="fixed">ثابت</option>
                                                <option value="negotiable">قابل للتفاوض</option>
                                                <option value="contact">على السوم</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-3">
                                            صور الإعلان <span className="text-xs text-[var(--foreground-muted)]">({imagePreviews.length}/10)</span>
                                        </label>

                                        {/* Image Upload Zone */}
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragging
                                                ? "border-[var(--primary)] bg-[var(--primary)]/5 scale-[1.02]"
                                                : "border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--background-secondary)]"
                                                }`}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e.target.files)}
                                            />
                                            <div className="text-5xl mb-3">📸</div>
                                            <p className="font-medium text-[var(--foreground)]">
                                                {isDragging ? "أفلت الصور هنا" : "اضغط أو اسحب الصور هنا"}
                                            </p>
                                            <p className="text-sm text-[var(--foreground-muted)] mt-1">
                                                يمكنك إضافة حتى 10 صور (JPG, PNG)
                                            </p>
                                        </div>

                                        {/* Image Previews */}
                                        {imagePreviews.length > 0 && (
                                            <div className="mt-4 grid grid-cols-5 gap-3">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-[var(--border)]">
                                                        <img
                                                            src={preview}
                                                            alt={`صورة ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {index === 0 && (
                                                            <div className="absolute top-1 right-1 bg-[var(--primary)] text-white text-xs px-2 py-0.5 rounded-full">
                                                                رئيسية
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                                            className="absolute top-1 left-1 w-6 h-6 bg-[var(--error)] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between pt-6 border-t border-[var(--border)]">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="btn btn-secondary px-6"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="m9 18 6-6-6-6" />
                                            </svg>
                                            السابق
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStep(3)}
                                            disabled={!isStep2Valid}
                                            className="btn btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            التالي
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="m15 18-6-6 6-6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Contact */}
                            {step === 3 && (
                                <div className="p-6 space-y-6 animate-fadeIn">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] flex items-center justify-center text-white text-xl">
                                            📍
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">معلومات الموقع والتواصل</h2>
                                            <p className="text-sm text-[var(--foreground-muted)]">حدد موقعك بدقة لسهولة الوصول</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">
                                                المدينة <span className="text-[var(--error)]">*</span>
                                            </label>
                                            <select
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="input cursor-pointer"
                                            >
                                                <option value="">اختر المدينة</option>
                                                {saudiCities.map((city) => (
                                                    <option key={city} value={city}>
                                                        {city}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2">
                                                الحي <span className="text-[var(--error)]">*</span>
                                            </label>
                                            <select
                                                name="neighborhood"
                                                value={formData.neighborhood}
                                                onChange={handleChange}
                                                className="input cursor-pointer"
                                                disabled={!formData.city}
                                            >
                                                <option value="">{formData.city ? "اختر الحي" : "اختر المدينة أولاً"}</option>
                                                {availableNeighborhoods.map((neighborhood) => (
                                                    <option key={neighborhood} value={neighborhood}>
                                                        {neighborhood}
                                                    </option>
                                                ))}
                                            </select>
                                            {formData.city && availableNeighborhoods.length > 0 && (
                                                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                                                    {availableNeighborhoods.length} حي متاح في {formData.city}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            تفاصيل إضافية للموقع (اختياري)
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="مثال: شارع الأمير سلطان، بالقرب من مول..."
                                            className="input"
                                        />
                                        <p className="text-xs text-[var(--foreground-muted)] mt-1">
                                            أضف معلومات إضافية لمساعدة المشتري في الوصول
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20">
                                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                            <span>📱</span>
                                            رقم الجوال <span className="text-[var(--error)]">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                readOnly
                                                className="input bg-[var(--background-secondary)] cursor-not-allowed pl-12"
                                                dir="ltr"
                                            />
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[var(--success)]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                    <polyline points="22 4 12 14.01 9 11.01" />
                                                </svg>
                                                <span className="text-xs">موثق</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[var(--foreground-muted)] mt-2 flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M12 16v-4" />
                                                <path d="M12 8h.01" />
                                            </svg>
                                            سيتم استخدام رقم الجوال المسجل في حسابك للتواصل
                                        </p>
                                    </div>

                                    {/* Summary */}
                                    <div className="p-4 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
                                        <h3 className="font-semibold mb-3">ملخص الإعلان</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-[var(--foreground-muted)]">العنوان:</span>
                                                <span className="font-medium">{formData.title || "-"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--foreground-muted)]">القسم:</span>
                                                <span className="font-medium">
                                                    {categories.find((c) => c.slug === formData.category)?.name || "-"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--foreground-muted)]">السعر:</span>
                                                <span className="font-medium text-[var(--primary)]">
                                                    {formData.price ? `${Number(formData.price).toLocaleString("ar-SA")} ريال` : "-"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--foreground-muted)]">الموقع:</span>
                                                <span className="font-medium">
                                                    {formData.city && formData.neighborhood
                                                        ? `${formData.neighborhood}، ${formData.city}`
                                                        : formData.city || "-"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--foreground-muted)]">الجوال:</span>
                                                <span className="font-medium" dir="ltr">{formData.phone || "-"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-4 border-t border-[var(--border)]">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="btn btn-secondary"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="m9 18 6-6-6-6" />
                                            </svg>
                                            السابق
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!isStep3Valid || isSubmitting}
                                            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                                    </svg>
                                                    جاري النشر...
                                                </>
                                            ) : (
                                                <>
                                                    نشر الإعلان
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M5 12h14" />
                                                        <path d="m12 5 7 7-7 7" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Tips */}
                    <div className="mt-6 p-4 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20">
                        <h3 className="font-semibold text-[var(--primary)] mb-2">💡 نصائح لإعلان ناجح</h3>
                        <ul className="text-sm text-[var(--foreground-muted)] space-y-1">
                            <li>• اكتب عنواناً واضحاً ومختصراً</li>
                            <li>• أضف صوراً واضحة وحقيقية للمنتج</li>
                            <li>• حدد سعراً منطقياً حسب حالة المنتج</li>
                            <li>• اذكر جميع التفاصيل المهمة في الوصف</li>
                        </ul>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
