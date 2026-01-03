import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET - Fetch single ad
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const ad = await prisma.ad.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                        rating: true,
                        totalReviews: true,
                        badges: true,
                        createdAt: true,
                        totalAds: true,
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
                subcategory: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                },
                images: {
                    orderBy: { displayOrder: "asc" }
                },
                dynamicFields: {
                    orderBy: { displayOrder: "asc" }
                }
            }
        })

        if (!ad) {
            return NextResponse.json(
                { error: "الإعلان غير موجود" },
                { status: 404 }
            )
        }

        // Increment view count
        await prisma.ad.update({
            where: { id },
            data: { viewsCount: { increment: 1 } }
        })

        // Record view
        const session = await auth()
        await prisma.adView.create({
            data: {
                adId: id,
                userId: session?.user?.id || null,
            }
        })

        return NextResponse.json({ ad })

    } catch (error) {
        console.error("Error fetching ad:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب الإعلان" },
            { status: 500 }
        )
    }
}

// PUT - Update ad
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
                { status: 401 }
            )
        }

        const { id } = await params

        // Check if ad exists and belongs to user
        const existingAd = await prisma.ad.findUnique({
            where: { id }
        })

        if (!existingAd) {
            return NextResponse.json(
                { error: "الإعلان غير موجود" },
                { status: 404 }
            )
        }

        if (existingAd.userId !== session.user.id) {
            return NextResponse.json(
                { error: "غير مصرح لك بتعديل هذا الإعلان" },
                { status: 403 }
            )
        }

        const body = await request.json()
        const {
            title,
            description,
            price,
            priceType,
            city,
            district,
            contactPhone,
            contactWhatsapp,
            status,
        } = body

        const ad = await prisma.ad.update({
            where: { id },
            data: {
                title,
                description,
                price,
                priceType,
                city,
                district,
                contactPhone,
                contactWhatsapp,
                status,
                soldAt: status === "sold" ? new Date() : undefined,
            },
            include: {
                category: true,
                subcategory: true,
                images: true,
            }
        })

        return NextResponse.json({
            message: "تم تحديث الإعلان بنجاح",
            ad
        })

    } catch (error) {
        console.error("Error updating ad:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء تحديث الإعلان" },
            { status: 500 }
        )
    }
}

// DELETE - Delete ad
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
                { status: 401 }
            )
        }

        const { id } = await params

        // Check if ad exists and belongs to user
        const existingAd = await prisma.ad.findUnique({
            where: { id }
        })

        if (!existingAd) {
            return NextResponse.json(
                { error: "الإعلان غير موجود" },
                { status: 404 }
            )
        }

        if (existingAd.userId !== session.user.id) {
            return NextResponse.json(
                { error: "غير مصرح لك بحذف هذا الإعلان" },
                { status: 403 }
            )
        }

        // Soft delete
        await prisma.ad.update({
            where: { id },
            data: { status: "deleted" }
        })

        // Update user stats
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                activeAds: { decrement: existingAd.status === "active" ? 1 : 0 },
            }
        })

        return NextResponse.json({
            message: "تم حذف الإعلان بنجاح"
        })

    } catch (error) {
        console.error("Error deleting ad:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء حذف الإعلان" },
            { status: 500 }
        )
    }
}
