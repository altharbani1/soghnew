import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/db"
import { RegisterSchema } from "@/lib/validations/auth"
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rateLimit"

export async function POST(request: NextRequest) {
    try {
        // Rate limiting - 5 registrations per 15 minutes per IP
        const clientIP = getClientIP(request);
        const rateLimitResult = checkRateLimit(
            `register:${clientIP}`,
            RATE_LIMITS.AUTH
        );

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: "لقد تجاوزت الحد المسموح. يرجى المحاولة لاحقاً" },
                { status: 429 }
            );
        }
        const body = await request.json()

        // Server-side validation using Zod
        const result = RegisterSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, email, phone, password } = result.data

        // Check if phone already exists
        const existingPhone = await prisma.user.findUnique({
            where: { phone }
        })

        if (existingPhone) {
            return NextResponse.json(
                { error: "رقم الجوال مسجل مسبقاً" },
                { status: 400 }
            )
        }

        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email }
        })

        if (existingEmail) {
            return NextResponse.json(
                { error: "البريد الإلكتروني مسجل مسبقاً" },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                // Add default empty badges array if not present in schema default
                badges: [],
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
            }
        })

        return NextResponse.json({
            message: "تم إنشاء الحساب بنجاح",
            user
        }, { status: 201 })

    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "حدث خطأ غير متوقع أثناء التسجيل" },
            { status: 500 }
        )
    }
}
