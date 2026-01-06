import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
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
