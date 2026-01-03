"use client";

import { useState } from "react";

interface ReportAdModalProps {
    adId: string;
    adTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

const reportReasons = [
    { id: "spam", label: "إعلان مكرر أو مزعج" },
    { id: "fake", label: "إعلان وهمي أو احتيالي" },
    { id: "wrong-category", label: "قسم خاطئ" },
    { id: "inappropriate", label: "محتوى غير لائق" },
    { id: "sold", label: "تم بيع المنتج" },
    { id: "wrong-info", label: "معلومات خاطئة" },
    { id: "other", label: "سبب آخر" },
];

export default function ReportAdModal({ adId, adTitle, isOpen, onClose }: ReportAdModalProps) {
    const [selectedReason, setSelectedReason] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!selectedReason) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("Report submitted:", { adId, reason: selectedReason, details });

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const handleClose = () => {
        setSelectedReason("");
        setDetails("");
        setIsSubmitted(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] w-full max-w-md max-h-[90vh] overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                    <h2 className="text-lg font-bold">الإبلاغ عن إعلان</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-[var(--background-secondary)] rounded-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    {isSubmitted ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-[var(--secondary)]/10 flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">تم إرسال البلاغ</h3>
                            <p className="text-[var(--foreground-muted)]">
                                شكراً لمساعدتنا في الحفاظ على سلامة المجتمع
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Ad Info */}
                            <div className="p-3 rounded-lg bg-[var(--background-secondary)] mb-4">
                                <p className="text-sm text-[var(--foreground-muted)] mb-1">الإعلان:</p>
                                <p className="font-medium line-clamp-1">{adTitle}</p>
                            </div>

                            {/* Reasons */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">سبب البلاغ</label>
                                <div className="space-y-2">
                                    {reportReasons.map((reason) => (
                                        <label
                                            key={reason.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedReason === reason.id
                                                    ? "border-[var(--primary)] bg-[var(--primary)]/5"
                                                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="reason"
                                                value={reason.id}
                                                checked={selectedReason === reason.id}
                                                onChange={(e) => setSelectedReason(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span>{reason.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Details */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    تفاصيل إضافية (اختياري)
                                </label>
                                <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    placeholder="أضف أي تفاصيل تساعدنا في مراجعة البلاغ..."
                                    className="input min-h-[100px] resize-none"
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                {!isSubmitted && (
                    <div className="flex gap-3 p-4 border-t border-[var(--border)]">
                        <button
                            onClick={handleClose}
                            className="btn btn-secondary flex-1"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedReason || isSubmitting}
                            className="btn btn-primary flex-1 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    جاري الإرسال...
                                </>
                            ) : (
                                "إرسال البلاغ"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
