import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// Simple upload endpoint that returns a placeholder URL
// In production, this would upload to Cloudinary or similar
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json(
                { error: "يرجى اختيار ملف" },
                { status: 400 }
            )
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "نوع الملف غير مدعوم" },
                { status: 400 }
            )
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "حجم الملف كبير جداً (الحد الأقصى 5 ميجابايت)" },
                { status: 400 }
            )
        }

        // In production with Cloudinary:
        // const cloudinary = require('cloudinary').v2
        // cloudinary.config({
        //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        //   api_key: process.env.CLOUDINARY_API_KEY,
        //   api_secret: process.env.CLOUDINARY_API_SECRET
        // })
        // 
        // const bytes = await file.arrayBuffer()
        // const buffer = Buffer.from(bytes)
        // 
        // const result = await new Promise((resolve, reject) => {
        //   cloudinary.uploader.upload_stream(
        //     { folder: 'souqah' },
        //     (error, result) => {
        //       if (error) reject(error)
        //       else resolve(result)
        //     }
        //   ).end(buffer)
        // })
        // 
        // return NextResponse.json({
        //   url: result.secure_url,
        //   thumbnail: cloudinary.url(result.public_id, { width: 200, crop: 'scale' })
        // })

        // For now, return a placeholder (in development)
        const timestamp = Date.now()
        const fileName = `${timestamp}-${file.name}`

        return NextResponse.json({
            message: "تم رفع الملف بنجاح",
            url: `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800`,
            thumbnail: `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200`,
            fileName,
            note: "هذا رابط مؤقت. قم بإعداد Cloudinary للتخزين الحقيقي"
        }, { status: 201 })

    } catch (error) {
        console.error("Error uploading file:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء رفع الملف" },
            { status: 500 }
        )
    }
}
