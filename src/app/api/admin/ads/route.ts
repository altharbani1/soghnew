import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        // Check admin logic

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const filter = searchParams.get("filter") || "all";
        const search = searchParams.get("search") || "";
        const skip = (page - 1) * limit;

        const whereClause: any = {};

        // Search Filter
        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { user: { name: { contains: search, mode: "insensitive" } } },
            ];
        }

        // Status Filter
        if (filter !== "all") {
            whereClause.status = filter;
        }

        const [ads, total] = await prisma.$transaction([
            prisma.ad.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { name: true } },
                    category: { select: { name: true } }
                }
            }),
            prisma.ad.count({ where: whereClause }),
        ]);

        return NextResponse.json({
            ads: ads.map(ad => ({
                id: ad.id,
                title: ad.title,
                category: ad.category.name,
                price: parseFloat(ad.price.toString()),
                user: ad.user.name,
                status: ad.status,
                views: ad.viewsCount,
                date: ad.createdAt,
                featured: ad.isFeatured
            })),
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                current: page
            },
            pendingCount: await prisma.ad.count({ where: { status: "pending" } })
        });

    } catch (error) {
        console.error("Error fetching admin ads:", error);
        return NextResponse.json(
            { error: "Failed to fetch ads" },
            { status: 500 }
        );
    }
}
