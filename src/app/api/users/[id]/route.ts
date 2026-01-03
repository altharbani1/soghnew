import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET - Fetch single user profile
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                avatar: true,
                city: true,
                bio: true,
                rating: true,
                totalReviews: true,
                totalAds: true,
                badges: true,
                createdAt: true,
                _count: {
                    select: { ads: true }
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: "المستخدم غير موجود" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            user: {
                ...user,
                totalAds: user._count.ads
            }
        })

    } catch (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب بيانات المستخدم" },
            { status: 500 }
        )
    }
}
