"use client";

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";

interface PhoneVerificationProps {
    phone?: string;
    onVerified?: () => void;
    onClose?: () => void;
}

export default function PhoneVerification({ phone = "", onVerified, onClose }: PhoneVerificationProps) {
    const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
    const [phoneNumber, setPhoneNumber] = useState(phone);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Auto-focus first OTP input when entering OTP step
    useEffect(() => {
        if (step === "otp" && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [step]);

    const handleSendOTP = () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            setError("يرجى إدخال رقم جوال صحيح");
            return;
        }
        setError("");
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setStep("otp");
            setCountdown(60);
        }, 1500);
    };

    const handleOtpChange = (index: number, value: string) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Take only last character
        setOtp(newOtp);
        setError("");

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all digits entered
        if (newOtp.every(digit => digit !== "") && newOtp.join("").length === 6) {
            verifyOTP(newOtp.join(""));
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pastedData.length === 6) {
            const newOtp = pastedData.split("");
            setOtp(newOtp);
            inputRefs.current[5]?.focus();
            verifyOTP(pastedData);
        }
    };

    const verifyOTP = (code: string) => {
        setIsLoading(true);

        // Simulate API verification (in reality, check against server)
        setTimeout(() => {
            setIsLoading(false);
            // Mock: any code starting with 1 is valid
            if (code.startsWith("1")) {
                setStep("success");
                setTimeout(() => {
                    onVerified?.();
                }, 2000);
            } else {
                setError("رمز التحقق غير صحيح");
                setOtp(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
            }
        }, 1500);
    };

    const handleResend = () => {
        setOtp(["", "", "", "", "", ""]);
        setCountdown(60);
        setError("");
        // Simulate resend
    };

    return (
        <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden max-w-md mx-auto">
            {/* Header */}
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    توثيق رقم الجوال
                </h3>
                {onClose && (
                    <button onClick={onClose} className="p-1 hover:bg-[var(--background-secondary)] rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="p-6">
                {/* Phone Input Step */}
                {step === "phone" && (
                    <div className="space-y-4">
                        <p className="text-center text-[var(--foreground-muted)]">
                            أدخل رقم جوالك لتلقي رمز التحقق
                        </p>

                        <div className="relative">
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[var(--foreground-muted)]">
                                <span className="text-lg">🇸🇦</span>
                                <span className="text-sm">+966</span>
                            </div>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => {
                                    setPhoneNumber(e.target.value.replace(/\D/g, ""));
                                    setError("");
                                }}
                                placeholder="5XXXXXXXX"
                                className="input pr-24 text-left"
                                dir="ltr"
                                maxLength={10}
                            />
                        </div>

                        {error && (
                            <p className="text-[var(--error)] text-sm text-center">{error}</p>
                        )}

                        <button
                            onClick={handleSendOTP}
                            disabled={isLoading || phoneNumber.length < 9}
                            className="btn btn-primary w-full"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    جاري الإرسال...
                                </span>
                            ) : (
                                "إرسال رمز التحقق"
                            )}
                        </button>
                    </div>
                )}

                {/* OTP Input Step */}
                {step === "otp" && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-[var(--foreground-muted)] mb-1">
                                تم إرسال رمز التحقق إلى
                            </p>
                            <p className="font-bold text-lg" dir="ltr">+966 {phoneNumber}</p>
                        </div>

                        {/* OTP Inputs */}
                        <div className="flex justify-center gap-2" dir="ltr">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all ${error
                                            ? "border-[var(--error)] bg-[var(--error)]/5"
                                            : digit
                                                ? "border-[var(--primary)] bg-[var(--primary)]/5"
                                                : "border-[var(--border)]"
                                        } focus:outline-none focus:border-[var(--primary)]`}
                                    maxLength={1}
                                    disabled={isLoading}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-[var(--error)] text-sm text-center">{error}</p>
                        )}

                        {isLoading && (
                            <div className="flex justify-center">
                                <span className="w-6 h-6 border-2 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin"></span>
                            </div>
                        )}

                        {/* Resend */}
                        <div className="text-center">
                            {countdown > 0 ? (
                                <p className="text-sm text-[var(--foreground-muted)]">
                                    إعادة الإرسال خلال <span className="font-bold text-[var(--primary)]">{countdown}</span> ثانية
                                </p>
                            ) : (
                                <button
                                    onClick={handleResend}
                                    className="text-sm text-[var(--primary)] hover:underline"
                                >
                                    إعادة إرسال الرمز
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => setStep("phone")}
                            className="btn btn-secondary w-full"
                        >
                            تغيير رقم الجوال
                        </button>
                    </div>
                )}

                {/* Success Step */}
                {step === "success" && (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 rounded-full bg-[var(--secondary)]/10 flex items-center justify-center text-4xl mx-auto mb-4 animate-fadeIn">
                            ✅
                        </div>
                        <h4 className="text-xl font-bold mb-2">تم التوثيق بنجاح!</h4>
                        <p className="text-[var(--foreground-muted)]">
                            تم توثيق رقم جوالك بنجاح
                        </p>
                        <div className="mt-4 p-3 rounded-xl bg-[var(--secondary)]/10 inline-flex items-center gap-2 text-[var(--secondary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
                            </svg>
                            <span className="font-bold" dir="ltr">+966 {phoneNumber}</span>
                            <span>موثق</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Benefits */}
            {step === "phone" && (
                <div className="px-6 pb-6">
                    <div className="p-4 rounded-xl bg-[var(--background-secondary)]">
                        <h4 className="font-semibold mb-2 text-sm">مميزات توثيق الجوال:</h4>
                        <ul className="text-sm text-[var(--foreground-muted)] space-y-1">
                            <li className="flex items-center gap-2">
                                <span className="text-[var(--secondary)]">✓</span>
                                شارة "جوال موثق" على ملفك الشخصي
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-[var(--secondary)]">✓</span>
                                زيادة ثقة المشترين بإعلاناتك
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-[var(--secondary)]">✓</span>
                                استعادة حسابك بسهولة
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
