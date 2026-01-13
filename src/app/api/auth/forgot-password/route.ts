import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";
import { randomBytes } from "crypto";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rateLimit";

export async function POST(req: Request) {
    // Rate limiting - 3 password reset requests per hour per IP
    const clientIP = getClientIP(req);
    const rateLimitResult = checkRateLimit(
        `password-reset:${clientIP}`,
        RATE_LIMITS.PASSWORD_RESET
    );

    if (!rateLimitResult.allowed) {
        return NextResponse.json(
            { error: "لقد تجاوزت الحد المسموح. يرجى المحاولة لاحقاً" },
            { status: 429 }
        );
    }
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Return success even if user not found to prevent enumeration attacks
            return NextResponse.json({ message: "تم إرسال رابط إعادة التعيين إذا كان البريد مسجلاً" });
        }

        // Generate token
        const token = randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

        // Save token
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        });

        // Send email
        const sent = await sendPasswordResetEmail(email, token);

        if (!sent) {
            return NextResponse.json({ error: "فشل إرسال البريد الإلكتروني" }, { status: 500 });
        }

        return NextResponse.json({ message: "تم إرسال رابط إعادة التعيين بنجاح" });

    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
    }
}
