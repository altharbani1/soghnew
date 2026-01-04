import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // Correct type for Next.js 15
) {
    try {
        const session = await auth();
        // Check admin logic

        const { id } = await context.params;
        const body = await request.json();
        const { action } = body; // action: ban, unban, suspend, activate, verify

        const updateData: any = {};

        switch (action) {
            case "ban":
                updateData.isBanned = true;
                updateData.isActive = false;
                break;
            case "unban":
                updateData.isBanned = false;
                updateData.isActive = true;
                break;
            case "suspend":
                updateData.isActive = false;
                break;
            case "activate":
                updateData.isActive = true;
                updateData.isBanned = false;
                break;
            case "verify":
                updateData.emailVerified = true;
                updateData.phoneVerified = true;
                break;
            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            message: "User updated successfully",
            user: {
                id: updatedUser.id,
                status: updatedUser.isBanned ? "banned" : (!updatedUser.isActive ? "suspended" : "active"),
                verified: updatedUser.emailVerified || updatedUser.phoneVerified
            }
        });

    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}
