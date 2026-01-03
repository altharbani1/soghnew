"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocationMap from "@/components/LocationMap";
import RatingStars, { RatingCard } from "@/components/RatingStars";
import { StartChatButton } from "@/components/MessagesPanel";
import ReportAdModal from "@/components/ReportAdModal";
import { sampleAds, formatPrice } from "@/lib/data";
import { use } from "react";

// Sample comments data
const sampleComments = [
    {
        id: "c1",
        userId: "u10",
        userName: "محمد العتيبي",
        content: "السلام عليكم، هل السعر قابل للتفاوض؟",
        date: "منذ ساعة",
        replies: [
            {
                id: "r1",
                userId: "u1",
                userName: "صاحب الإعلان",
                content: "وعليكم السلام، نعم يوجد مجال بسيط",
                date: "منذ 45 دقيقة",
                isOwner: true,
            },
        ],
    },
    {
        id: "c2",
        userId: "u11",
        userName: "عبدالله السعيد",
        content: "ما شاء الله، موقع ممتاز. هل الفحص متوفر؟",
        date: "منذ 3 ساعات",
        replies: [],
    },
    {
        id: "c3",
        userId: "u12",
        userName: "فهد القحطاني",
        content: "هل يوجد ضمان؟",
        date: "منذ 5 ساعات",
        replies: [
            {
                id: "r2",
                userId: "u1",
                userName: "صاحب الإعلان",
                content: "نعم، ضمان الوكالة ساري",
                date: "منذ 4 ساعات",
                isOwner: true,
            },
        ],
    },
];

export default function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const ad = sampleAds.find((a) => a.id === resolvedParams.id) || sampleAds[0];
    const [selectedImage, setSelectedImage] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState(sampleComments);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [showReportModal, setShowReportModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Generate multiple images for demo
    const images = [
        ad.image,
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
    ];

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const comment = {
            id: `c${Date.now()}`,
            userId: "guest",
            userName: "زائر",
            content: newComment,
            date: "الآن",
            replies: [],
        };
        setComments([comment, ...comments]);
        setNewComment("");
    };

    const handleAddReply = (commentId: string) => {
        if (!replyText.trim()) return;
        setComments(
            comments.map((c) => {
                if (c.id === commentId) {
                    return {
                        ...c,
                        replies: [
                            ...c.replies,
                            {
                                id: `r${Date.now()}`,
                                userId: "guest",
                                userName: "زائر",
                                content: replyText,
                                date: "الآن",
                                isOwner: false,
                            },
                        ],
                    };
                }
                return c;
            })
        );
        setReplyText("");
        setReplyingTo(null);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
            <Header />

            <main className="flex-1 py-6">
                <div className="container">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-6">
                        <Link href="/" className="hover:text-[var(--primary)]">الرئيسية</Link>
                        <span>←</span>
                        <Link href={`/categories/${ad.categorySlug}`} className="hover:text-[var(--primary)]">{ad.category}</Link>
                        <span>←</span>
                        <span className="text-[var(--foreground)]">{ad.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Ad Info Card */}
                            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                                {/* Title & Meta */}
                                <div className="p-6 border-b border-[var(--border)]">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <h1 className="text-2xl font-bold">{ad.title}</h1>
                                        <div className="flex gap-2">
                                            {ad.featured && (
                                                <span className="badge badge-warning">⭐ مميز</span>
                                            )}
                                            <button
                                                onClick={() => setShowReportModal(true)}
                                                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--error)]"
                                            >
                                                إبلاغ
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--foreground-muted)]">
                                        <span className="badge badge-primary">{ad.category}</span>
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            {ad.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            {ad.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            {ad.views} مشاهدة
                                        </span>
                                    </div>
                                </div>

                                {/* Image Gallery */}
                                <div className="p-6 border-b border-[var(--border)]">
                                    {/* Main Image */}
                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--background-secondary)] mb-4">
                                        <Image
                                            src={images[selectedImage]}
                                            alt={ad.title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                    {/* Thumbnails */}
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedImage(idx)}
                                                className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === idx
                                                    ? "border-[var(--primary)]"
                                                    : "border-transparent opacity-70 hover:opacity-100"
                                                    }`}
                                            >
                                                <Image src={img} alt="" fill className="object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="p-6">
                                    <h2 className="font-bold text-lg mb-3">تفاصيل الإعلان</h2>
                                    <p className="text-[var(--foreground-muted)] leading-relaxed whitespace-pre-line">
                                        {ad.description}
                                        {"\n\n"}
                                        • الحالة: ممتازة
                                        {"\n"}
                                        • الضمان: متوفر
                                        {"\n"}
                                        • قابل للتفاوض: نعم
                                        {"\n\n"}
                                        للتواصل والاستفسار يرجى استخدام الأزرار أدناه أو كتابة تعليق.
                                    </p>
                                </div>
                            </div>

                            {/* Location Map */}
                            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                                <div className="p-4 border-b border-[var(--border)]">
                                    <h2 className="font-bold">موقع الإعلان</h2>
                                </div>
                                <LocationMap city={ad.city} address={ad.location} />
                            </div>

                            {/* Comments Section */}
                            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
                                <div className="p-6 border-b border-[var(--border)]">
                                    <h2 className="font-bold text-lg flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        </svg>
                                        التعليقات والردود ({comments.length})
                                    </h2>
                                </div>

                                {/* Add Comment */}
                                <div className="p-6 border-b border-[var(--border)] bg-[var(--background-secondary)]">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="اكتب تعليقك أو استفسارك هنا..."
                                        className="input min-h-[100px] resize-none mb-3"
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        className="btn btn-primary"
                                    >
                                        إرسال التعليق
                                    </button>
                                </div>

                                {/* Comments List */}
                                <div className="divide-y divide-[var(--border)]">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="p-6">
                                            {/* Comment */}
                                            <div className="flex gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold flex-shrink-0">
                                                    {comment.userName[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold">{comment.userName}</span>
                                                        <span className="text-xs text-[var(--foreground-muted)]">{comment.date}</span>
                                                    </div>
                                                    <p className="text-[var(--foreground-muted)] mb-2">{comment.content}</p>
                                                    <button
                                                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                                        className="text-sm text-[var(--primary)] hover:underline"
                                                    >
                                                        رد
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Reply Input */}
                                            {replyingTo === comment.id && (
                                                <div className="mt-4 mr-12 flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        placeholder="اكتب ردك..."
                                                        className="input flex-1"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => handleAddReply(comment.id)}
                                                        className="btn btn-primary"
                                                    >
                                                        رد
                                                    </button>
                                                </div>
                                            )}

                                            {/* Replies */}
                                            {comment.replies.length > 0 && (
                                                <div className="mt-4 mr-12 space-y-4">
                                                    {comment.replies.map((reply) => (
                                                        <div key={reply.id} className="flex gap-3">
                                                            <div
                                                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm ${reply.isOwner
                                                                    ? "bg-[var(--secondary)]/10 text-[var(--secondary)]"
                                                                    : "bg-[var(--foreground-muted)]/10 text-[var(--foreground-muted)]"
                                                                    }`}
                                                            >
                                                                {reply.userName[0]}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className={`font-semibold ${reply.isOwner ? "text-[var(--secondary)]" : ""}`}>
                                                                        {reply.userName}
                                                                    </span>
                                                                    {reply.isOwner && (
                                                                        <span className="badge badge-success text-xs">صاحب الإعلان</span>
                                                                    )}
                                                                    <span className="text-xs text-[var(--foreground-muted)]">{reply.date}</span>
                                                                </div>
                                                                <p className="text-[var(--foreground-muted)] text-sm">{reply.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Price Card */}
                            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-6 sticky top-24">
                                <div className="text-center mb-6">
                                    <div className="text-sm text-[var(--foreground-muted)] mb-1">السعر</div>
                                    <div className="text-3xl font-bold text-[var(--primary)]">
                                        {formatPrice(ad.price)}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <a
                                        href={`tel:${ad.userPhone}`}
                                        className="btn btn-primary w-full"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                        اتصال
                                    </a>
                                    <a
                                        href={`https://wa.me/966${ad.userPhone.slice(1)}`}
                                        target="_blank"
                                        className="btn btn-secondary w-full bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                                        </svg>
                                        واتساب
                                    </a>
                                    <StartChatButton
                                        sellerId={ad.userId}
                                        sellerName={ad.userName}
                                        adId={ad.id}
                                        adTitle={ad.title}
                                    />
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`btn w-full ${isFavorite ? 'btn-primary' : 'btn-secondary'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                        </svg>
                                        {isFavorite ? "تم الحفظ" : "حفظ في المفضلة"}
                                    </button>
                                </div>

                                {/* Seller Info with Rating */}
                                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-lg">
                                            {ad.userName[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold">{ad.userName}</div>
                                            <div className="flex items-center gap-1">
                                                <RatingStars rating={4.5} totalReviews={23} size="sm" />
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/users/${ad.userId}`}
                                        className="text-sm text-[var(--primary)] hover:underline"
                                    >
                                        عرض جميع إعلانات البائع ←
                                    </Link>
                                </div>

                                {/* Rating Card */}
                                <div className="mt-4">
                                    <RatingCard
                                        sellerId={ad.userId}
                                        sellerName={ad.userName}
                                        currentRating={4.5}
                                        totalReviews={23}
                                    />
                                </div>

                                {/* Warning */}
                                <div className="mt-6 p-4 rounded-xl bg-[var(--warning)]/10 text-[var(--warning)] text-sm">
                                    <div className="font-semibold mb-1">⚠️ نصائح الأمان</div>
                                    <ul className="text-xs space-y-1 opacity-90">
                                        <li>• لا تدفع مقدماً قبل المعاينة</li>
                                        <li>• قابل البائع في مكان عام</li>
                                        <li>• تأكد من صحة المنتج قبل الشراء</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Report Modal */}
            <ReportAdModal
                adId={ad.id}
                adTitle={ad.title}
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
            />
        </div>
    );
}
