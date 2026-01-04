"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories, saudiCities, getNeighborhoods } from "@/lib/data";
import { use } from "react";

interface Props {
    params: Promise<{ id: string }>;
}

export default function EditAdPage({ params }: Props) {
    const { id } = use(params);
    const router = useRouter();
    const { data: session, status } = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
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
        images: [] as File[],
    });

    // Fetch ad data
    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await fetch(`/api/ads/${id}`);
                if (!res.ok) {
                    setError("الإعلان غير موجود");
                    return;
                }
                const jsonData = await res.json();
                const data = jsonData.ad || jsonData; // Handle both formats

                // Check ownership - compare with session user id
                if (session?.user?.id !== data.userId) {
                    setError("غير مصرح لك بتعديل هذا الإعلان");
                    return;
                }

                // Find category slug from name or slug
                const category = categories.find(c => c.name === data.category?.name || c.slug === data.category?.slug);

                setFormData({
                    title: data.title || "",
                    category: category?.slug || data.category?.slug || "",
                    subcategory: "",
                    description: data.description || "",
                    price: data.price?.toString() || "",
                    priceType: data.priceType || "fixed",
                    city: data.city || "",
                    neighborhood: data.district || "",
                    location: data.detailedLocation || "",
                    phone: data.contactPhone || "",
                    images: [],
                });

                // Set existing images
                if (data.images && data.images.length > 0) {
                    setExistingImages(data.images.map((img: { imageUrl: string }) => img.imageUrl));
                }

                setIsLoading(false);
            } catch (err) {
                setError("حدث خطأ أثناء جلب بيانات الإعلان");
                setIsLoading(false);
            }
        };

        if (status === "authenticated" && session?.user?.id) {
            fetchAd();
        } else if (status === "unauthenticated") {
            setIsLoading(false);
        }
    }, [id, session?.user?.id, status]);

    // Update neighborhoods when city changes
    useEffect(() => {
        if (formData.city) {
            const neighborhoods = getNeighborhoods(formData.city);
            setAvailableNeighborhoods(neighborhoods);
        } else {
            setAvailableNeighborhoods([]);
        }
    }, [formData.city]);

    if (status === "loading" || isLoading) {
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
                            لتعديل الإعلان، يرجى تسجيل الدخول
                        </p>
                        <Link href="/auth/login" className="btn btn-primary w-full">
                            تسجيل الدخول
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
                <Header />
                <main className="flex-1 flex items-center justify-center py-12">
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-8 max-w-md mx-4 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h1 className="text-2xl font-bold mb-2">خطأ</h1>
                        <p className="text-[var(--foreground-muted)] mb-6">{error}</p>
                        <Link href="/" className="btn btn-primary w-full">
                            العودة للرئيسية
                        </Link>
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
    };

    const handleImageUpload = (files: FileList | null) => {
        if (!files) return;
        const totalImages = existingImages.length + imagePreviews.length;
        const newFiles = Array.from(files).slice(0, 10 - totalImages);
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
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
            // Upload new images first (if any)
            const newImageUrls: string[] = [];
            for (const file of formData.images) {
                const formDataImg = new FormData();
                formDataImg.append("file", file);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formDataImg,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    newImageUrls.push(uploadData.url);
                }
            }

            // Combine existing and new images
            const allImages = [...existingImages, ...newImageUrls];

            // Update the ad
            const response = await fetch(`/api/ads/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    priceType: formData.priceType,
                    city: formData.city,
                    district: formData.neighborhood,
                    detailedLocation: formData.location || undefined,
                    contactPhone: formData.phone,
                    images: allImages.map((url, index) => ({
                        imageUrl: url,
                        isPrimary: index === 0,
                        displayOrder: index,
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "حدث خطأ أثناء تحديث الإعلان");
                return;
            }

            // Success - redirect to ad page
            router.push(`/ads/${id}`);
            router.refresh();
        } catch (err) {
            setError("حدث خطأ غير متوقع");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.title && formData.description && formData.price && formData.city && formData.phone;
    const totalImages = existingImages.length + imagePreviews.length;

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-8">
                <div className="container max-w-3xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 px-4 py-2 rounded-full mb-4">
                            <span className="text-lg">✏️</span>
                            <span className="text-sm font-medium text-[var(--primary)]">تعديل الإعلان</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                            تعديل الإعلان
                        </h1>
                        <p className="text-[var(--foreground-muted)]">
                            قم بتحديث بيانات إعلانك
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-[var(--background)] rounded-3xl border border-[var(--border)] shadow-xl overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    عنوان الإعلان <span className="text-[var(--error)]">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="عنوان الإعلان"
                                    className="input text-lg"
                                    maxLength={100}
                                    required
                                />
                            </div>

                            {/* Category (Read-only) */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    القسم
                                </label>
                                <div className="input bg-[var(--background-secondary)] cursor-not-allowed">
                                    {selectedCategory?.icon} {selectedCategory?.name || "غير محدد"}
                                </div>
                                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                                    لا يمكن تغيير القسم بعد نشر الإعلان
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    وصف الإعلان <span className="text-[var(--error)]">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="اكتب وصفاً تفصيلياً للإعلان..."
                                    className="input min-h-[180px] resize-none leading-relaxed"
                                    maxLength={2000}
                                    required
                                />
                            </div>

                            {/* Price */}
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

                            {/* Location */}
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
                                            الحي
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
                                    </div>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    رقم الجوال <span className="text-[var(--error)]">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="05xxxxxxxx"
                                    className="input"
                                    dir="ltr"
                                    required
                                />
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block text-sm font-semibold mb-3">
                                    صور الإعلان <span className="text-xs text-[var(--foreground-muted)]">({totalImages}/10)</span>
                                </label>

                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm text-[var(--foreground-muted)] mb-2">الصور الحالية:</p>
                                        <div className="grid grid-cols-5 gap-3">
                                            {existingImages.map((url, index) => (
                                                <div key={`existing-${index}`} className="relative group aspect-square rounded-xl overflow-hidden border border-[var(--border)]">
                                                    <img
                                                        src={url}
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
                                                        onClick={() => removeExistingImage(index)}
                                                        className="absolute top-1 left-1 w-6 h-6 bg-[var(--error)] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Image Upload Zone */}
                                {totalImages < 10 && (
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
                                            يمكنك إضافة حتى {10 - totalImages} صور إضافية
                                        </p>
                                    </div>
                                )}

                                {/* New Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm text-[var(--foreground-muted)] mb-2">صور جديدة:</p>
                                        <div className="grid grid-cols-5 gap-3">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={`new-${index}`} className="relative group aspect-square rounded-xl overflow-hidden border border-[var(--border)]">
                                                    <img
                                                        src={preview}
                                                        alt={`صورة جديدة ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(index)}
                                                        className="absolute top-1 left-1 w-6 h-6 bg-[var(--error)] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-between pt-6 border-t border-[var(--border)]">
                                <Link href={`/ads/${id}`} className="btn btn-secondary">
                                    إلغاء
                                </Link>
                                <button
                                    type="submit"
                                    disabled={!isFormValid || isSubmitting}
                                    className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                            </svg>
                                            جاري الحفظ...
                                        </>
                                    ) : (
                                        <>
                                            حفظ التغييرات
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14" />
                                                <path d="m12 5 7 7-7 7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
