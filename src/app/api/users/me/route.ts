import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET - Get current user profile
export async function GET() {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                bio: true,
                city: true,
                emailVerified: true,
                phoneVerified: true,
                badges: true,
                totalAds: true,
                activeAds: true,
                soldAds: true,
                rating: true,
                totalReviews: true,
                createdAt: true,
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: "المستخدم غير موجود" },
                { status: 404 }
            )
        }

        return NextResponse.json({ user })

    } catch (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب بيانات المستخدم" },
            { status: 500 }
        )
    }
}

// PUT - Update current user profile
export async function PUT(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { name, bio, city, avatar } = body

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                bio,
                city,
                avatar,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                bio: true,
                city: true,
                badges: true,
            }
        })

        return NextResponse.json({
            message: "تم تحديث الملف الشخصي بنجاح",
            user
        })

    } catch (error) {
        console.error("Error updating user:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء تحديث البيانات" },
            { status: 500 }
        )
    }
}
