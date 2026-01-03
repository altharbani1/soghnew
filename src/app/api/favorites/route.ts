import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET - Get user's favorites
export async function GET() {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
                { status: 401 }
            )
        }

        const favorites = await prisma.adFavorite.findMany({
            where: { userId: session.user.id },
            include: {
                ad: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                            }
                        },
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                icon: true,
                            }
                        },
                        images: {
                            take: 1,
                            orderBy: { displayOrder: "asc" }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json({ favorites })

    } catch (error) {
        console.error("Error fetching favorites:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب المفضلة" },
            { status: 500 }
        )
    }
}

// POST - Add to favorites
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
                { status: 401 }
            )
        }

        const { adId } = await request.json()

        if (!adId) {
            return NextResponse.json(
                { error: "معرف الإعلان مطلوب" },
                { status: 400 }
            )
        }

        // Check if already favorited
        const existing = await prisma.adFavorite.findUnique({
            where: {
                adId_userId: {
                    adId,
                    userId: session.user.id
                }
            }
        })

        if (existing) {
            return NextResponse.json(
                { error: "الإعلان موجود بالفعل في المفضلة" },
                { status: 400 }
            )
        }

        const favorite = await prisma.adFavorite.create({
            data: {
                adId,
                userId: session.user.id
            }
        })

        // Update ad favorites count
        await prisma.ad.update({
            where: { id: adId },
            data: { favoritesCount: { increment: 1 } }
        })

        return NextResponse.json({
            message: "تم إضافة الإعلان للمفضلة",
            favorite
        }, { status: 201 })

    } catch (error) {
        console.error("Error adding favorite:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء إضافة المفضلة" },
            { status: 500 }
        )
    }
}

// DELETE - Remove from favorites
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const adId = searchParams.get("adId")

        if (!adId) {
            return NextResponse.json(
                { error: "معرف الإعلان مطلوب" },
                { status: 400 }
            )
        }

        await prisma.adFavorite.delete({
            where: {
                adId_userId: {
                    adId,
                    userId: session.user.id
                }
            }
        })

        // Update ad favorites count
        await prisma.ad.update({
            where: { id: adId },
            data: { favoritesCount: { decrement: 1 } }
        })

        return NextResponse.json({
            message: "تم إزالة الإعلان من المفضلة"
        })

    } catch (error) {
        console.error("Error removing favorite:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء إزالة المفضلة" },
            { status: 500 }
        )
    }
}
