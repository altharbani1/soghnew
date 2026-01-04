import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

// Update Status (Approve/Reject/Feature)
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        // Check admin logic

        const { id } = await context.params;
        const body = await request.json();
        const { action } = body;

        const updateData: any = {};

        switch (action) {
            case "approve":
                updateData.status = "active";
                updateData.isApproved = true;
                updateData.publishedAt = new Date();
                break;
            case "reject":
                updateData.status = "rejected";
                updateData.isApproved = false;
                break;
            case "toggleFeatured":
                // We need to fetch current state first or toggle based on input
                const currentAd = await prisma.ad.findUnique({ where: { id }, select: { isFeatured: true } });
                updateData.isFeatured = !currentAd?.isFeatured;
                break;
            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const updatedAd = await prisma.ad.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            message: "Ad updated successfully",
            ad: {
                id: updatedAd.id,
                status: updatedAd.status,
                featured: updatedAd.isFeatured
            }
        });
    } catch (error) {
        console.error("Error updating ad:", error);
        return NextResponse.json(
            { error: "Failed to update ad" },
            { status: 500 }
        );
    }
}

// Delete Ad
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        // Check admin logic

        const { id } = await context.params;

        await prisma.ad.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Ad deleted successfully" });

    } catch (error) {
        console.error("Error deleting ad:", error);
        return NextResponse.json(
            { error: "Failed to delete ad" },
            { status: 500 }
        );
    }
}
