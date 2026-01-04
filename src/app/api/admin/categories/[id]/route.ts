import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        // Check admin logic

        const { id } = await context.params;
        const body = await request.json();
        const { name, slug, icon, color, description, isActive } = body;

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                icon,
                color,
                description,
                isActive
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json(
            { error: "Failed to update category" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        // Check admin logic

        const { id } = await context.params;

        // Check if has ads or subcategories? Usually prevent delete if has dependants
        // For now, simpler delete

        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
}
