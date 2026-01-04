import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        // Optional: Check for admin role here if you have roles
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "غير مصرح" },
                { status: 401 }
            );
        }

        const [
            usersCount,
            adsCount,
            activeAdsCount,
            recentAds,
            categories
        ] = await prisma.$transaction([
            prisma.user.count(),
            prisma.ad.count(),
            prisma.ad.count({ where: { status: "active" } }),
            prisma.ad.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { name: true } }
                }
            }),
            prisma.category.findMany({
                include: {
                    _count: {
                        select: { ads: true }
                    }
                }
            })
        ]);

        // Format stats
        const stats = {
            users: usersCount,
            totalAds: adsCount,
            activeAds: activeAdsCount,
            recentAds: recentAds.map(ad => ({
                id: ad.id,
                title: ad.title,
                user: ad.user.name,
                status: ad.status,
                date: ad.createdAt
            })),
            categoryDistribution: categories.map(cat => ({
                name: cat.name,
                count: cat._count.ads,
                color: cat.color || "#cccccc" // Fallback color
            }))
        };

        return NextResponse.json(stats);

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
