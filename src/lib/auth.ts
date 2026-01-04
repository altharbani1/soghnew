import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                phone: { label: "رقم الجوال أو البريد", type: "text" },
                password: { label: "كلمة المرور", type: "password" },
                email: { label: "البريد الإلكتروني", type: "email" }
            },
            async authorize(credentials) {
                const identifier = (credentials?.phone || credentials?.email) as string;
                const password = credentials?.password as string;

                if (!identifier || !password) {
                    throw new Error("يرجى إدخال بيانات الدخول")
                }

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { phone: identifier },
                            { email: identifier }
                        ]
                    }
                })

                if (!user) {
                    throw new Error("الحساب غير مسجل")
                }

                const isPasswordValid = await bcrypt.compare(
                    password,
                    user.password
                )

                if (!isPasswordValid) {
                    throw new Error("كلمة المرور غير صحيحة")
                }

                if (user.isBanned) {
                    throw new Error("تم حظر هذا الحساب")
                }

                // Update last login
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() }
                })

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    image: user.avatar,
                    role: (user as any).role || "USER",
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.phone = user.phone
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.phone = token.phone
                session.user.role = token.role
            }
            return session
        }
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true,
})
