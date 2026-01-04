"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories, saudiCities, getNeighborhoods } from "@/lib/data";

export default function NewAdPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        subcategory: "",
        description: "",
        price: "",
        priceType: "fixed",
        city: "",
        neighborhood: "",
        location: "",
        phone: "",
        carYear: "",
        images: [] as File[],
    });

    // Set phone from session when available
    useEffect(() => {
        if (session?.user?.phone) {
            setFormData(prev => ({ ...prev, phone: session.user.phone || "" }));
        }
    }, [session]);

    // Update neighborhoods when city changes
    useEffect(() => {
        if (formData.city) {
            const neighborhoods = getNeighborhoods(formData.city);
            setAvailableNeighborhoods(neighborhoods);
            if (!neighborhoods.includes(formData.neighborhood)) {
                setFormData(prev => ({ ...prev, neighborhood: "" }));
            }
        } else {
            setAvailableNeighborhoods([]);
        }
    }, [formData.city]);

    // Redirect if not logged in
    if (status === "loading") {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[var(--foreground-muted)]">جاري التحميل...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
                <Header />
                <main className="flex-1 flex items-center justify-center py-12">
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-8 max-w-md mx-4 text-center">
                        <div className="text-6xl mb-4">🔒</div>
                        <h1 className="text-2xl font-bold mb-2">يجب تسجيل الدخول</h1>
                        <p className="text-[var(--foreground-muted)] mb-6">
                            لإضافة إعلان جديد، يرجى تسجيل الدخول أو إنشاء حساب جديد
                        </p>
                        <div className="space-y-3">
                            <Link href="/auth/login" className="btn btn-primary w-full">
                                تسجيل الدخول
                            </Link>
                            <Link href="/auth/register" className="btn btn-secondary w-full">
                                إنشاء حساب جديد
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const selectedCategory = categories.find(c => c.slug === formData.category);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
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
        setError("");

        try {
            // Find category ID
            const category = categories.find(c => c.slug === formData.category);
            if (!category) {
                setError("يرجى اختيار القسم");
                setIsSubmitting(false);
                return;
            }

            // Upload images first (if any)
            const imageUrls: string[] = [];
            for (const file of formData.images) {
                const formDataImg = new FormData();
                formDataImg.append("file", file);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formDataImg,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    imageUrls.push(uploadData.url);
                } else {
                    const errorData = await uploadRes.json();
                    throw new Error(errorData.error || "فشل رفع الصورة");
                }
            }

            // Create the ad
            // Add car year to description if it's a car ad
            let fullDescription = formData.description;
            if (formData.category === "cars" && formData.carYear) {
                fullDescription = `📅 سنة الصنع: ${formData.carYear}\n\n${formData.description}`;
            }

            const response = await fetch("/api/ads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: fullDescription,
                    price: parseFloat(formData.price),
                    priceType: formData.priceType,
                    categorySlug: formData.category,
                    subcategorySlug: formData.subcategory || undefined,
                    city: formData.city,
                    district: formData.neighborhood,
                    detailedLocation: formData.location || undefined,
                    contactPhone: formData.phone,
                    images: imageUrls.map((url, index) => ({
                        imageUrl: url,
                        isPrimary: index === 0,
                        displayOrder: index,
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "حدث خطأ أثناء نشر الإعلان");
                return;
            }

            // Success - redirect to home
            router.push("/");
            router.refresh();
        } catch (err) {
            console.error("Submit error:", err);
            setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStep1Valid = formData.title && formData.category;
    const isStep2Valid = formData.description && formData.price;
    const isStep3Valid = formData.city && formData.phone && (formData.category !== "realestate" || formData.neighborhood);

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
                            مرحباً {session?.user?.name}، أضف إعلانك في 3 خطوات بسيطة
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between relative">
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
                                            required
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">
                                                القسم الرئيسي <span className="text-[var(--error)]">*</span>
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, subcategory: "" }))}
                                                className="input cursor-pointer"
                                                required
                                            >
                                                <option value="">-- اختر القسم --</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.slug}>
                                                        {cat.icon} {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Subcategory Dropdown */}
                                        {selectedCategory?.subcategories && selectedCategory.subcategories.length > 0 && (
                                            <div className="animate-fadeIn">
                                                <label className="block text-sm font-semibold mb-2">
                                                    القسم الفرعي
                                                </label>
                                                <select
                                                    name="subcategory"
                                                    value={formData.subcategory}
                                                    onChange={handleChange}
                                                    className="input cursor-pointer"
                                                >
                                                    <option value="">-- اختر القسم الفرعي --</option>
                                                    {selectedCategory.subcategories.map((sub) => (
                                                        <option key={sub.id} value={sub.slug}>
                                                            {sub.icon || '📁'} {sub.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {/* Car Year - Only show for cars category */}
                                    {formData.category === "cars" && (
                                        <div className="animate-fadeIn">
                                            <label className="block text-sm font-semibold mb-2">
                                                سنة الصنع <span className="text-[var(--error)]">*</span>
                                            </label>
                                            <select
                                                name="carYear"
                                                value={formData.carYear}
                                                onChange={handleChange}
                                                className="input cursor-pointer"
                                                required={formData.category === "cars"}
                                            >
                                                <option value="">-- اختر السنة --</option>
                                                {Array.from({ length: 35 }, (_, i) => new Date().getFullYear() + 1 - i).map((year) => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
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
                                            required
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
                                                    required
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
                                            <select
                                                name="priceType"
                                                value={formData.priceType}
                                                onChange={handleChange}
                                                className="input cursor-pointer"
                                            >
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
                                                required
                                            >
                                                <option value="">اختر المدينة</option>
                                                {saudiCities.map((city) => (
                                                    <option key={city} value={city}>
                                                        {city}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Neighborhood - Only for Real Estate */}
                                        {formData.category === "realestate" && (
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
                                                    required={formData.category === "realestate"}
                                                >
                                                    <option value="">{formData.city ? "اختر الحي" : "اختر المدينة أولاً"}</option>
                                                    {availableNeighborhoods.map((neighborhood) => (
                                                        <option key={neighborhood} value={neighborhood}>
                                                            {neighborhood}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
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
                                        <p className="text-xs text-[var(--foreground-muted)] mt-2">
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
