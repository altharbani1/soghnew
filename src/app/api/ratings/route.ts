import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// POST - Add a rating for a user
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { userId, rating, comment } = body

        if (!userId || !rating) {
            return NextResponse.json(
                { error: "البيانات المطلوبة غير مكتملة" },
                { status: 400 }
            )
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "التقييم يجب أن يكون بين 1 و 5" },
                { status: 400 }
            )
        }

        if (userId === session.user.id) {
            return NextResponse.json(
                { error: "لا يمكنك تقييم نفسك" },
                { status: 400 }
            )
        }

        // Check if user already rated this seller
        const existingRating = await prisma.rating.findUnique({
            where: {
                raterId_ratedId: {
                    raterId: session.user.id,
                    ratedId: userId
                }
            }
        })

        if (existingRating) {
            // Update existing rating
            await prisma.rating.update({
                where: { id: existingRating.id },
                data: { rating, comment }
            })
        } else {
            // Create new rating
            await prisma.rating.create({
                data: {
                    raterId: session.user.id,
                    ratedId: userId,
                    rating,
                    comment: comment || ""
                }
            })

            // Update user's total reviews count
            await prisma.user.update({
                where: { id: userId },
                data: { totalReviews: { increment: 1 } }
            })
        }

        // Recalculate average rating
        const allRatings = await prisma.rating.findMany({
            where: { ratedId: userId },
            select: { rating: true }
        })

        const avgRating = allRatings.length > 0
            ? allRatings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / allRatings.length
            : 0

        await prisma.user.update({
            where: { id: userId },
            data: { rating: avgRating }
        })

        return NextResponse.json({
            message: "تم إضافة التقييم بنجاح",
            averageRating: avgRating,
            totalReviews: allRatings.length
        })

    } catch (error) {
        console.error("Error adding rating:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء إضافة التقييم" },
            { status: 500 }
        )
    }
}

// GET - Get ratings for a user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")

        if (!userId) {
            return NextResponse.json(
                { error: "معرف المستخدم مطلوب" },
                { status: 400 }
            )
        }

        const ratings = await prisma.rating.findMany({
            where: { ratedId: userId },
            include: {
                rater: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { rating: true, totalReviews: true }
        })

        return NextResponse.json({
            ratings,
            averageRating: user?.rating || 0,
            totalReviews: user?.totalReviews || 0
        })

    } catch (error) {
        console.error("Error fetching ratings:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب التقييمات" },
            { status: 500 }
        )
    }
}
