import { NextResponse } from "next/server";

export async function GET() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    return NextResponse.json({
        CLOUDINARY_CLOUD_NAME: {
            exists: !!cloudName,
            length: cloudName?.length || 0,
            value_preview: cloudName ? `${cloudName.substring(0, 3)}...` : "MISSING"
        },
        CLOUDINARY_API_KEY: {
            exists: !!apiKey,
            length: apiKey?.length || 0,
            value_preview: apiKey ? `${apiKey.substring(0, 3)}...` : "MISSING"
        },
        CLOUDINARY_API_SECRET: {
            exists: !!apiSecret,
            length: apiSecret?.length || 0,
            status: apiSecret ? "PRESENT (Hidden)" : "MISSING"
        },
        NODE_ENV: process.env.NODE_ENV
    });
}
