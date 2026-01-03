import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET - Fetch all categories with subcategories
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const withSubcategories = searchParams.get("subcategories") === "true"

        const categories = await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: "asc" },
            include: withSubcategories ? {
                subcategories: {
                    where: { isActive: true },
                    orderBy: { displayOrder: "asc" }
                }
            } : undefined
        })

        return NextResponse.json({ categories })

    } catch (error) {
        console.error("Error fetching categories:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب التصنيفات" },
            { status: 500 }
        )
    }
}
