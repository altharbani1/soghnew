import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { AdDetailClient } from "./AdDetailClient";

interface Props {
    params: Promise<{ id: string }>;
}

async function getAd(id: string) {
    try {
        // Update view count
        await prisma.ad.update({
            where: { id },
            data: { viewsCount: { increment: 1 } }
        }).catch(() => { });

        const ad = await prisma.ad.findUnique({
            where: { id },
            include: {
                category: { select: { name: true, slug: true } },
                subcategory: { select: { name: true } },
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                        rating: true,
                        totalReviews: true
                    }
                },
                images: {
                    orderBy: { isPrimary: 'desc' }
                }
            }
        });

        return ad;
    } catch (error) {
        console.error("Error fetching ad:", error);
        return null;
    }
}

export default async function AdDetailPage({ params }: Props) {
    const { id } = await params;
    const ad = await getAd(id);

    if (!ad) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background-secondary)]">
                <Header />
                <main className="flex-1 flex items-center justify-center py-12">
                    <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-8 max-w-md mx-4 text-center">
                        <div className="text-6xl mb-4">😕</div>
                        <h1 className="text-2xl font-bold mb-2">الإعلان غير موجود</h1>
                        <p className="text-[var(--foreground-muted)] mb-6">قد يكون الإعلان محذوفاً أو منتهي الصلاحية</p>
                        <Link href="/" className="btn btn-primary">
                            العودة للرئيسية
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Serialize the ad data for client component
    const adData = {
        id: ad.id,
        title: ad.title,
        slug: ad.slug,
        description: ad.description,
        price: Number(ad.price),
        priceType: ad.priceType,
        city: ad.city,
        district: ad.district,
        contactPhone: ad.contactPhone,
        contactWhatsapp: ad.contactWhatsapp,
        viewsCount: ad.viewsCount,
        isFeatured: ad.isFeatured,
        createdAt: ad.createdAt.toISOString(),
        userId: ad.userId,
        category: ad.category,
        subcategory: ad.subcategory,
        user: {
            id: ad.user.id,
            name: ad.user.name,
            phone: ad.user.phone,
            avatar: ad.user.avatar,
            rating: ad.user.rating,
            totalReviews: ad.user.totalReviews
        },
        images: ad.images.map(img => ({
            id: img.id,
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary
        }))
    };

    return <AdDetailClient ad={adData} />;
}
