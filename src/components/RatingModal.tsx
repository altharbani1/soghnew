"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface RatingModalProps {
    userId: string;
    userName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function RatingModal({ userId, userName, onClose, onSuccess }: RatingModalProps) {
    const { status } = useSession();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (rating === 0) {
            setError("يرجى اختيار تقييم");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/ratings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, rating, comment }),
            });

            const data = await res.json();

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                setError(data.error || "حدث خطأ");
            }
        } catch (err) {
            setError("حدث خطأ أثناء إرسال التقييم");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status !== "authenticated") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] w-full max-w-md p-6">
                    <div className="text-center">
                        <div className="text-5xl mb-4">🔒</div>
                        <h3 className="text-lg font-semibold mb-2">يجب تسجيل الدخول</h3>
                        <p className="text-[var(--foreground-muted)]">لإضافة تقييم، يرجى تسجيل الدخول</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] w-full max-w-md p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">تقييم {userName}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--background-secondary)] rounded-lg">
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-[var(--error)]/10 text-[var(--error)] rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Stars */}
                <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                            className="text-3xl transition-transform hover:scale-110"
                        >
                            {star <= (hoveredRating || rating) ? "⭐" : "☆"}
                        </button>
                    ))}
                </div>

                <div className="text-center mb-4 text-sm text-[var(--foreground-muted)]">
                    {rating === 1 && "سيء جداً"}
                    {rating === 2 && "سيء"}
                    {rating === 3 && "مقبول"}
                    {rating === 4 && "جيد"}
                    {rating === 5 && "ممتاز"}
                </div>

                {/* Comment */}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="أضف تعليقاً (اختياري)..."
                    className="input min-h-[100px] resize-none mb-4"
                />

                <div className="flex gap-2">
                    <button onClick={onClose} className="btn btn-secondary flex-1">
                        إلغاء
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || rating === 0}
                        className="btn btn-primary flex-1 disabled:opacity-50"
                    >
                        {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Rating Stars Display Component
interface RatingDisplayProps {
    rating: number;
    totalReviews: number;
    size?: "sm" | "md" | "lg";
}

export function RatingDisplay({ rating, totalReviews, size = "md" }: RatingDisplayProps) {
    const starSize = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-lg";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-1">
            <div className={`flex ${starSize}`}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= fullStars ? "text-yellow-500" : "text-gray-300"}>
                        {star <= fullStars ? "★" : star === fullStars + 1 && hasHalfStar ? "★" : "☆"}
                    </span>
                ))}
            </div>
            <span className="text-sm text-[var(--foreground-muted)]">
                ({rating.toFixed(1)}) • {totalReviews} تقييم
            </span>
        </div>
    );
}
