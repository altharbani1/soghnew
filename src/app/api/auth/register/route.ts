import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/db"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, phone, password } = body

        // Validation
        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                { error: "جميع الحقول مطلوبة" },
                { status: 400 }
            )
        }

        // Validate phone format (Saudi format)
        const phoneRegex = /^05[0-9]{8}$/
        if (!phoneRegex.test(phone)) {
            return NextResponse.json(
                { error: "رقم الجوال غير صحيح" },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "البريد الإلكتروني غير صحيح" },
                { status: 400 }
            )
        }

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
            { error: `فشل التسجيل: ${error instanceof Error ? error.message : "خطأ غير معروف"}` },
            { status: 500 }
        )
    }
}
