"use client";

import { useState } from "react";

type BadgeType = "verified" | "business" | "trusted" | "premium";

interface VerifiedBadgeProps {
    type: BadgeType;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
    tooltip?: boolean;
}

const badgeConfig: Record<BadgeType, { icon: string; label: string; color: string; bgColor: string; description: string }> = {
    verified: {
        icon: "✓",
        label: "موثق",
        color: "#3b82f6",
        bgColor: "rgba(59, 130, 246, 0.1)",
        description: "تم التحقق من هوية هذا المستخدم",
    },
    business: {
        icon: "🏢",
        label: "تاجر معتمد",
        color: "#8b5cf6",
        bgColor: "rgba(139, 92, 246, 0.1)",
        description: "حساب تجاري موثق برخصة تجارية",
    },
    trusted: {
        icon: "⭐",
        label: "بائع موثوق",
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
        description: "بائع ذو سمعة ممتازة وتقييمات عالية",
    },
    premium: {
        icon: "👑",
        label: "عضو مميز",
        color: "#ec4899",
        bgColor: "rgba(236, 72, 153, 0.1)",
        description: "عضوية مميزة مع مزايا حصرية",
    },
};

const sizes = {
    sm: { badge: "w-4 h-4 text-[10px]", label: "text-xs", icon: "text-[10px]" },
    md: { badge: "w-5 h-5 text-xs", label: "text-sm", icon: "text-xs" },
    lg: { badge: "w-6 h-6 text-sm", label: "text-base", icon: "text-sm" },
};

export default function VerifiedBadge({
    type,
    size = "md",
    showLabel = false,
    tooltip = true
}: VerifiedBadgeProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const config = badgeConfig[type];
    const sizeConfig = sizes[size];

    return (
        <div
            className="relative inline-flex items-center gap-1"
            onMouseEnter={() => tooltip && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div
                className={`${sizeConfig.badge} rounded-full flex items-center justify-center flex-shrink-0`}
                style={{ backgroundColor: config.bgColor, color: config.color }}
                title={config.description}
            >
                {type === "verified" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={sizeConfig.icon}>
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <span>{config.icon}</span>
                )}
            </div>

            {showLabel && (
                <span
                    className={`${sizeConfig.label} font-medium`}
                    style={{ color: config.color }}
                >
                    {config.label}
                </span>
            )}

            {/* Tooltip */}
            {tooltip && showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[var(--foreground)] text-[var(--background)] text-xs rounded-lg whitespace-nowrap z-50 animate-fadeIn">
                    <div className="font-semibold mb-0.5">{config.label}</div>
                    <div className="opacity-80">{config.description}</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--foreground)]"></div>
                </div>
            )}
        </div>
    );
}

// Badge group for users with multiple badges
interface BadgeGroupProps {
    badges: BadgeType[];
    size?: "sm" | "md" | "lg";
}

export function BadgeGroup({ badges, size = "sm" }: BadgeGroupProps) {
    if (badges.length === 0) return null;

    return (
        <div className="inline-flex items-center gap-0.5">
            {badges.map((badge, index) => (
                <VerifiedBadge key={index} type={badge} size={size} />
            ))}
        </div>
    );
}

// Verification request card for profile page
interface VerificationRequestCardProps {
    onClose?: () => void;
}

export function VerificationRequestCard({ onClose }: VerificationRequestCardProps) {
    const [step, setStep] = useState(1);
    const [verificationType, setVerificationType] = useState<"identity" | "business" | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setStep(3);
        }, 2000);
    };

    return (
        <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                    طلب التوثيق
                </h3>
                {onClose && (
                    <button onClick={onClose} className="p-1 hover:bg-[var(--background-secondary)] rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="p-5">
                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? "bg-[var(--primary)] text-white" : "bg-[var(--background-secondary)] text-[var(--foreground-muted)]"
                                }`}>
                                {step > s ? "✓" : s}
                            </div>
                            {s < 3 && <div className={`w-12 h-1 rounded ${step > s ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`} />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Choose Type */}
                {step === 1 && (
                    <div className="space-y-4">
                        <p className="text-center text-[var(--foreground-muted)] mb-4">اختر نوع التوثيق المناسب لك</p>

                        <button
                            onClick={() => setVerificationType("identity")}
                            className={`w-full p-4 rounded-xl border-2 text-right transition-all ${verificationType === "identity"
                                    ? "border-[var(--primary)] bg-[var(--primary)]/5"
                                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                                    🪪
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold flex items-center gap-2">
                                        توثيق الهوية
                                        <VerifiedBadge type="verified" size="sm" tooltip={false} />
                                    </div>
                                    <p className="text-sm text-[var(--foreground-muted)]">
                                        إثبات هويتك الشخصية برفع صورة الهوية الوطنية
                                    </p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => setVerificationType("business")}
                            className={`w-full p-4 rounded-xl border-2 text-right transition-all ${verificationType === "business"
                                    ? "border-[var(--primary)] bg-[var(--primary)]/5"
                                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl">
                                    🏢
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold flex items-center gap-2">
                                        توثيق تجاري
                                        <VerifiedBadge type="business" size="sm" tooltip={false} />
                                    </div>
                                    <p className="text-sm text-[var(--foreground-muted)]">
                                        إثبات نشاطك التجاري برفع السجل التجاري
                                    </p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => setStep(2)}
                            disabled={!verificationType}
                            className="btn btn-primary w-full mt-4"
                        >
                            التالي
                        </button>
                    </div>
                )}

                {/* Step 2: Upload Documents */}
                {step === 2 && (
                    <div className="space-y-4">
                        <p className="text-center text-[var(--foreground-muted)] mb-4">
                            {verificationType === "identity" ? "ارفع صورة الهوية الوطنية" : "ارفع صورة السجل التجاري"}
                        </p>

                        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-[var(--primary)] transition-colors cursor-pointer">
                            <div className="text-4xl mb-3">📄</div>
                            <p className="font-medium mb-1">اسحب الملف هنا أو اضغط للاختيار</p>
                            <p className="text-sm text-[var(--foreground-muted)]">JPG, PNG, PDF - حد أقصى 5MB</p>
                            <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" />
                        </div>

                        {verificationType === "identity" && (
                            <div className="p-4 rounded-xl bg-[var(--warning)]/10 text-[var(--warning)] text-sm">
                                <strong>⚠️ ملاحظة:</strong> تأكد من وضوح الصورة وظهور جميع البيانات
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button onClick={() => setStep(1)} className="btn btn-secondary flex-1">
                                رجوع
                            </button>
                            <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary flex-1">
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        جاري الإرسال...
                                    </span>
                                ) : (
                                    "إرسال الطلب"
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 rounded-full bg-[var(--secondary)]/10 flex items-center justify-center text-4xl mx-auto mb-4">
                            ✅
                        </div>
                        <h4 className="text-xl font-bold mb-2">تم إرسال طلبك بنجاح!</h4>
                        <p className="text-[var(--foreground-muted)] mb-4">
                            سيتم مراجعة طلبك خلال 24-48 ساعة وسنرسل لك إشعاراً بالنتيجة
                        </p>
                        <div className="p-4 rounded-xl bg-[var(--background-secondary)] text-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-[var(--foreground-muted)]">رقم الطلب:</span>
                                <span className="font-mono font-bold">#VER-2024-001</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--foreground-muted)]">الحالة:</span>
                                <span className="text-[var(--warning)] font-medium">قيد المراجعة</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Seller info with badges
interface SellerInfoProps {
    name: string;
    avatar?: string;
    badges: BadgeType[];
    rating?: number;
    adsCount?: number;
    memberSince?: string;
}

export function SellerInfo({ name, avatar, badges, rating, adsCount, memberSince }: SellerInfoProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-lg">
                {avatar ? <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" /> : name[0]}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-bold">{name}</span>
                    <BadgeGroup badges={badges} size="sm" />
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                    {rating && (
                        <span className="flex items-center gap-1">
                            <span className="text-[var(--accent)]">⭐</span> {rating}
                        </span>
                    )}
                    {adsCount && <span>{adsCount} إعلان</span>}
                    {memberSince && <span>عضو منذ {memberSince}</span>}
                </div>
            </div>
        </div>
    );
}
