"use client";

import { useState } from "react";

interface RatingStarsProps {
    rating: number;
    totalReviews?: number;
    size?: "sm" | "md" | "lg";
    interactive?: boolean;
    onRate?: (rating: number) => void;
}

export default function RatingStars({
    rating,
    totalReviews,
    size = "md",
    interactive = false,
    onRate,
}: RatingStarsProps) {
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(rating);

    const sizes = {
        sm: { star: 14, text: "text-xs" },
        md: { star: 18, text: "text-sm" },
        lg: { star: 24, text: "text-base" },
    };

    const handleClick = (value: number) => {
        if (interactive) {
            setSelectedRating(value);
            onRate?.(value);
        }
    };

    const displayRating = interactive ? (hoverRating || selectedRating) : rating;

    return (
        <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        className={`transition-colors ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={sizes[size].star}
                            height={sizes[size].star}
                            viewBox="0 0 24 24"
                            fill={star <= displayRating ? "#f59e0b" : "none"}
                            stroke={star <= displayRating ? "#f59e0b" : "var(--foreground-muted)"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </button>
                ))}
            </div>
            {totalReviews !== undefined && (
                <span className={`text-[var(--foreground-muted)] ${sizes[size].text}`}>
                    ({totalReviews})
                </span>
            )}
        </div>
    );
}

// Rating Card Component for user profiles
interface RatingCardProps {
    sellerId: string;
    sellerName: string;
    currentRating: number;
    totalReviews: number;
}

export function RatingCard({ sellerName, currentRating, totalReviews }: RatingCardProps) {
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (userRating === 0) return;
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSubmitted(true);
        setIsSubmitting(false);

        setTimeout(() => {
            setShowRatingModal(false);
            setSubmitted(false);
            setUserRating(0);
            setReview("");
        }, 2000);
    };

    return (
        <>
            <div className="p-4 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
                <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">تقييم البائع</span>
                    <button
                        onClick={() => setShowRatingModal(true)}
                        className="text-sm text-[var(--primary)] hover:underline"
                    >
                        أضف تقييمك
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-[var(--accent)]">{currentRating.toFixed(1)}</div>
                    <div>
                        <RatingStars rating={currentRating} size="md" />
                        <p className="text-xs text-[var(--foreground-muted)] mt-1">
                            من {totalReviews} تقييم
                        </p>
                    </div>
                </div>
            </div>

            {/* Rating Modal */}
            {showRatingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRatingModal(false)} />
                    <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] w-full max-w-md p-6 animate-fadeIn">
                        {submitted ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-[var(--secondary)]/10 flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">شكراً لتقييمك!</h3>
                                <p className="text-[var(--foreground-muted)]">تم إضافة تقييمك بنجاح</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold">تقييم {sellerName}</h2>
                                    <button onClick={() => setShowRatingModal(false)} className="p-2 hover:bg-[var(--background-secondary)] rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="text-center mb-6">
                                    <p className="text-[var(--foreground-muted)] mb-3">كيف كانت تجربتك مع هذا البائع؟</p>
                                    <div className="flex justify-center">
                                        <RatingStars rating={userRating} size="lg" interactive onRate={setUserRating} />
                                    </div>
                                    <p className="text-sm text-[var(--foreground-muted)] mt-2">
                                        {userRating === 0 && "اضغط للتقييم"}
                                        {userRating === 1 && "سيء جداً"}
                                        {userRating === 2 && "سيء"}
                                        {userRating === 3 && "مقبول"}
                                        {userRating === 4 && "جيد"}
                                        {userRating === 5 && "ممتاز!"}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">تعليق (اختياري)</label>
                                    <textarea
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        placeholder="شاركنا تجربتك مع هذا البائع..."
                                        className="input min-h-[100px] resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={userRating === 0 || isSubmitting}
                                    className="btn btn-primary w-full disabled:opacity-50"
                                >
                                    {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
