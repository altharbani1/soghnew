import { MetadataRoute } from 'next';
import prisma from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://souqah.sa';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/ads`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    // Dynamic category pages
    let categoryPages: MetadataRoute.Sitemap = [];
    try {
        const categories = await prisma.category.findMany({
            select: { slug: true, updatedAt: true },
        });
        categoryPages = categories.map((category) => ({
            url: `${baseUrl}/categories/${category.slug}`,
            lastModified: category.updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.error('Error fetching categories for sitemap:', error);
    }

    // Dynamic ad pages (limit to recent 1000 active ads)
    let adPages: MetadataRoute.Sitemap = [];
    try {
        const ads = await prisma.ad.findMany({
            where: { status: 'active' },
            select: { id: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 1000,
        });
        adPages = ads.map((ad) => ({
            url: `${baseUrl}/ads/${ad.id}`,
            lastModified: ad.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Error fetching ads for sitemap:', error);
    }

    return [...staticPages, ...categoryPages, ...adPages];
}
