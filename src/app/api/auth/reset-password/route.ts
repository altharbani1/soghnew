import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "البيانات غير مكتملة" }, { status: 400 });
        }

        // Verify token
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            return NextResponse.json({ error: "الرابط غير صالح أو منتهي الصلاحية" }, { status: 400 });
        }

        if (new Date() > verificationToken.expires) {
            await prisma.verificationToken.delete({ where: { token } });
            return NextResponse.json({ error: "الرابط منتهي الصلاحية" }, { status: 400 });
        }

        // Update user password
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { password: hashedPassword },
        });

        // Delete token
        await prisma.verificationToken.delete({ where: { token } });

        return NextResponse.json({ message: "تم إعادة تعيين كلمة المرور بنجاح" });

    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
    }
}
