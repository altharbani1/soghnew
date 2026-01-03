import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET - Fetch ads with filtering
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")
        const category = searchParams.get("category")
        const subcategory = searchParams.get("subcategory")
        const city = searchParams.get("city")
        const search = searchParams.get("search")
        const featured = searchParams.get("featured")
        const minPrice = searchParams.get("minPrice")
        const maxPrice = searchParams.get("maxPrice")
        const sortBy = searchParams.get("sortBy") || "createdAt"
        const sortOrder = searchParams.get("sortOrder") || "desc"

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {
            status: "active",
        }

        const userId = searchParams.get("userId")
        if (userId) {
            where.userId = userId
        }

        if (category) {
            where.category = { slug: category }
        }

        if (subcategory) {
            where.subcategory = { slug: subcategory }
        }

        if (city) {
            where.city = city
        }

        if (featured === "true") {
            where.isFeatured = true
        }

        if (minPrice) {
            where.price = { ...where.price, gte: parseFloat(minPrice) }
        }

        if (maxPrice) {
            where.price = { ...where.price, lte: parseFloat(maxPrice) }
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ]
        }

        // Build orderBy
        const orderBy: any = {}
        orderBy[sortBy] = sortOrder

        // Fetch ads
        const [ads, total] = await Promise.all([
            prisma.ad.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            avatar: true,
                            rating: true,
                            badges: true,
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
                        orderBy: { displayOrder: "asc" },
                        take: 1,
                    }
                }
            }),
            prisma.ad.count({ where })
        ])

        return NextResponse.json({
            ads,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            }
        })

    } catch (error) {
        console.error("Error fetching ads:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب الإعلانات" },
            { status: 500 }
        )
    }
}

// POST - Create new ad
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول لإضافة إعلان" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const {
            title,
            description,
            price,
            priceType,
            categorySlug,
            subcategorySlug,
            city,
            district,
            contactPhone,
            contactWhatsapp,
            images,
            dynamicFields,
        } = body

        // Validation
        if (!title || !description || price === undefined || !categorySlug || !city) {
            return NextResponse.json(
                { error: "يرجى ملء جميع الحقول المطلوبة" },
                { status: 400 }
            )
        }

        // Find category by slug
        const category = await prisma.category.findUnique({
            where: { slug: categorySlug }
        })

        if (!category) {
            return NextResponse.json(
                { error: "القسم غير موجود" },
                { status: 400 }
            )
        }

        // Find subcategory if provided
        let subcategoryId = null
        if (subcategorySlug) {
            const subcategory = await prisma.subcategory.findFirst({
                where: {
                    slug: subcategorySlug,
                    categoryId: category.id
                }
            })
            if (subcategory) {
                subcategoryId = subcategory.id
            }
        }

        // Get user's phone from session or use provided phone
        const phone = contactPhone || session.user.phone

        // Create slug
        const slug = `${title.replace(/\s+/g, "-")}-${Date.now()}`

        // Create ad
        const ad = await prisma.ad.create({
            data: {
                userId: session.user.id,
                title,
                description,
                slug,
                price: parseFloat(price),
                priceType: priceType || "fixed",
                categoryId: category.id,
                subcategoryId,
                city,
                district,
                contactPhone: phone,
                contactWhatsapp,
                publishedAt: new Date(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                images: images?.length ? {
                    create: images.map((img: any, index: number) => ({
                        imageUrl: img.imageUrl || img.url,
                        thumbnailUrl: img.thumbnailUrl || img.thumbnail,
                        isPrimary: img.isPrimary || index === 0,
                        displayOrder: img.displayOrder || index,
                    }))
                } : undefined,
                dynamicFields: dynamicFields?.length ? {
                    create: dynamicFields.map((field: any, index: number) => ({
                        fieldName: field.name,
                        fieldValue: field.value,
                        fieldType: field.type || "text",
                        displayOrder: index,
                    }))
                } : undefined,
            },
            include: {
                category: true,
                subcategory: true,
                images: true,
            }
        })

        // Update user stats
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                totalAds: { increment: 1 },
                activeAds: { increment: 1 },
            }
        })

        // Update category stats
        await prisma.category.update({
            where: { id: category.id },
            data: { totalAds: { increment: 1 } }
        })

        if (subcategoryId) {
            await prisma.subcategory.update({
                where: { id: subcategoryId },
                data: { totalAds: { increment: 1 } }
            })
        }

        return NextResponse.json({
            message: "تم إضافة الإعلان بنجاح",
            ad
        }, { status: 201 })

    } catch (error) {
        console.error("Error creating ad:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء إضافة الإعلان" },
            { status: 500 }
        )
    }
}
