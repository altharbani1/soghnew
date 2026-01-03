import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET - Fetch single category with subcategories
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                subcategories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true,
                        _count: {
                            select: { ads: true }
                        }
                    }
                },
                _count: {
                    select: { ads: true }
                }
            }
        })

        if (!category) {
            return NextResponse.json(
                { error: "القسم غير موجود" },
                { status: 404 }
            )
        }

        // Transform to include adCount
        const transformedCategory = {
            id: category.id,
            name: category.name,
            slug: category.slug,
            icon: category.icon,
            color: category.color,
            adCount: category._count.ads,
            subcategories: category.subcategories.map(sub => ({
                id: sub.id,
                name: sub.name,
                slug: sub.slug,
                icon: sub.icon,
                adCount: sub._count.ads
            }))
        }

        return NextResponse.json({ category: transformedCategory })

    } catch (error) {
        console.error("Error fetching category:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب القسم" },
            { status: 500 }
        )
    }
}
