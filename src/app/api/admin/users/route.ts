import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        // Check admin logic here if needed (e.g. session.user.role === 'ADMIN')

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const filter = searchParams.get("filter") || "all"; // all, verified, unverified, suspended, banned
        const search = searchParams.get("search") || "";
        const skip = (page - 1) * limit;

        const whereClause: any = {};

        // Search Filter
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
            ];
        }

        // Status Filter
        if (filter === "verified") {
            whereClause.OR = [{ emailVerified: true }, { phoneVerified: true }];
        } else if (filter === "unverified") {
            whereClause.AND = [{ emailVerified: false }, { phoneVerified: false }];
        } else if (filter === "banned") {
            whereClause.isBanned = true;
        } else if (filter === "suspended") {
            whereClause.isActive = false;
        }

        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                    totalAds: true,
                    rating: true,
                    emailVerified: true,
                    phoneVerified: true,
                    isBanned: true,
                    isActive: true,
                },
            }),
            prisma.user.count({ where: whereClause }),
        ]);

        return NextResponse.json({
            users: users.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                phone: u.phone,
                joinDate: u.createdAt,
                adsCount: u.totalAds,
                rating: u.rating,
                verified: u.emailVerified || u.phoneVerified,
                status: u.isBanned ? "banned" : (!u.isActive ? "suspended" : "active")
            })),
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                current: page
            }
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
