interface ProductJsonLdProps {
    name: string;
    description: string;
    price: number;
    currency?: string;
    image?: string;
    url: string;
    sellerName: string;
    sellerRating?: number;
    sellerReviewCount?: number;
    location: string;
    category: string;
    datePosted: string;
}

export function ProductJsonLd({
    name,
    description,
    price,
    currency = 'SAR',
    image,
    url,
    sellerName,
    sellerRating,
    sellerReviewCount,
    location,
    category,
    datePosted,
}: ProductJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: name,
        description: description,
        image: image,
        url: url,
        category: category,
        offers: {
            '@type': 'Offer',
            price: price,
            priceCurrency: currency,
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Person',
                name: sellerName,
                ...(sellerRating && sellerReviewCount && {
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: sellerRating,
                        reviewCount: sellerReviewCount,
                    },
                }),
            },
            areaServed: {
                '@type': 'Place',
                name: location,
                address: {
                    '@type': 'PostalAddress',
                    addressCountry: 'SA',
                    addressLocality: location,
                },
            },
            validFrom: datePosted,
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

interface OrganizationJsonLdProps {
    name?: string;
    url?: string;
    logo?: string;
    description?: string;
}

export function OrganizationJsonLd({
    name = 'سوقه',
    url = 'https://souqah.sa',
    logo = 'https://souqah.sa/logo.png',
    description = 'منصة سوقه للإعلانات المبوبة - بيع واشتري بسهولة في المملكة العربية السعودية',
}: OrganizationJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: name,
        url: url,
        logo: logo,
        description: description,
        sameAs: [
            // Add social media URLs here
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: ['Arabic', 'English'],
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

interface WebsiteJsonLdProps {
    name?: string;
    url?: string;
}

export function WebsiteJsonLd({
    name = 'سوقه',
    url = 'https://souqah.sa',
}: WebsiteJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: name,
        url: url,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${url}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

interface BreadcrumbJsonLdProps {
    items: Array<{
        name: string;
        url: string;
    }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
