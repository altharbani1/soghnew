import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminClientLayout from "./AdminClientLayout";
import { ReactNode } from "react";

export const metadata = {
    title: "لوحة التحكم | سوقه",
    robots: "noindex, nofollow" // Extra security: don't index admin pages
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await auth();

    // 1. Check if logged in
    if (!session?.user) {
        redirect("/souqah-admin-portal");
    }

    // 2. Check if admin
    const role = (session.user as any)?.role;

    if (role !== "ADMIN") {
        // Redirect unauthorized users
        redirect("/");
    }

    return <AdminClientLayout>{children}</AdminClientLayout>;
}
