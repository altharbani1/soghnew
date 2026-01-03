import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
    { name: "سيارات", slug: "cars", icon: "🚗", color: "#ef4444", displayOrder: 1 },
    { name: "عقارات", slug: "realestate", icon: "🏠", color: "#22c55e", displayOrder: 2 },
    { name: "الكترونيات", slug: "electronics", icon: "📱", color: "#3b82f6", displayOrder: 3 },
    { name: "أثاث ومفروشات", slug: "furniture", icon: "🛋️", color: "#f59e0b", displayOrder: 4 },
    { name: "أزياء وموضة", slug: "fashion", icon: "👔", color: "#ec4899", displayOrder: 5 },
    { name: "وظائف", slug: "jobs", icon: "💼", color: "#8b5cf6", displayOrder: 6 },
    { name: "خدمات", slug: "services", icon: "🔧", color: "#06b6d4", displayOrder: 7 },
    { name: "حيوانات", slug: "animals", icon: "🐾", color: "#84cc16", displayOrder: 8 },
    { name: "رياضة", slug: "sports", icon: "⚽", color: "#f97316", displayOrder: 9 },
    { name: "كتب وتعليم", slug: "books", icon: "📚", color: "#0ea5e9", displayOrder: 10 },
    { name: "طعام ومشروبات", slug: "food", icon: "🍽️", color: "#dc2626", displayOrder: 11 },
    { name: "أخرى", slug: "other", icon: "📦", color: "#6b7280", displayOrder: 12 },
]

const subcategories: { [key: string]: { name: string; slug: string; icon: string }[] } = {
    cars: [
        { name: "تويوتا", slug: "toyota", icon: "🚙" },
        { name: "لكزس", slug: "lexus", icon: "🏎️" },
        { name: "نيسان", slug: "nissan", icon: "🚘" },
        { name: "هيونداي", slug: "hyundai", icon: "🚐" },
        { name: "كيا", slug: "kia", icon: "🚕" },
        { name: "مرسيدس", slug: "mercedes", icon: "🚔" },
        { name: "بي ام دبليو", slug: "bmw", icon: "🏁" },
        { name: "قطع غيار", slug: "parts", icon: "🔧" },
    ],
    realestate: [
        { name: "شقق للإيجار", slug: "apartments-rent", icon: "🏢" },
        { name: "شقق للبيع", slug: "apartments-sale", icon: "🏬" },
        { name: "فلل للإيجار", slug: "villas-rent", icon: "🏡" },
        { name: "فلل للبيع", slug: "villas-sale", icon: "🏘️" },
        { name: "أراضي", slug: "lands", icon: "🌍" },
        { name: "محلات تجارية", slug: "shops", icon: "🏪" },
    ],
    electronics: [
        { name: "جوالات", slug: "phones", icon: "📲" },
        { name: "لابتوب", slug: "laptops", icon: "💻" },
        { name: "تابلت", slug: "tablets", icon: "📟" },
        { name: "شاشات وتلفزيونات", slug: "tvs", icon: "📺" },
        { name: "ألعاب فيديو", slug: "gaming", icon: "🎮" },
        { name: "كاميرات", slug: "cameras", icon: "📷" },
    ],
    furniture: [
        { name: "غرف نوم", slug: "bedrooms", icon: "🛏️" },
        { name: "غرف جلوس", slug: "living-rooms", icon: "🛋️" },
        { name: "مطابخ", slug: "kitchens", icon: "🍳" },
        { name: "أجهزة منزلية", slug: "appliances", icon: "🧊" },
    ],
    jobs: [
        { name: "تقنية المعلومات", slug: "it", icon: "💻" },
        { name: "هندسة", slug: "engineering", icon: "⚙️" },
        { name: "تسويق ومبيعات", slug: "marketing", icon: "📈" },
        { name: "محاسبة ومالية", slug: "accounting", icon: "🧮" },
    ],
}

async function main() {
    console.log('🌱 بدء تعبئة قاعدة البيانات...')

    // Clear existing data
    await prisma.message.deleteMany()
    await prisma.adFavorite.deleteMany()
    await prisma.adView.deleteMany()
    await prisma.adDynamicField.deleteMany()
    await prisma.adImage.deleteMany()
    await prisma.ad.deleteMany()
    await prisma.subcategory.deleteMany()
    await prisma.category.deleteMany()
    await prisma.userVerification.deleteMany()
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.user.deleteMany()

    console.log('✅ تم مسح البيانات القديمة')

    // Create categories
    for (const cat of categories) {
        const category = await prisma.category.create({
            data: cat,
        })
        console.log(`📁 تم إنشاء التصنيف: ${category.name}`)

        // Create subcategories
        const subs = subcategories[cat.slug]
        if (subs) {
            for (let i = 0; i < subs.length; i++) {
                await prisma.subcategory.create({
                    data: {
                        ...subs[i],
                        categoryId: category.id,
                        displayOrder: i + 1,
                    },
                })
            }
            console.log(`  ↳ تم إنشاء ${subs.length} تصنيف فرعي`)
        }
    }

    console.log('🎉 تم تعبئة قاعدة البيانات بنجاح!')
}

main()
    .catch((e) => {
        console.error('❌ حدث خطأ:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
