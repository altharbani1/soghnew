import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                phone: { label: "رقم الجوال", type: "tel" },
                password: { label: "كلمة المرور", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.password) {
                    throw new Error("يرجى إدخال رقم الجوال وكلمة المرور")
                }

                const user = await prisma.user.findUnique({
                    where: { phone: credentials.phone as string }
                })

                if (!user) {
                    throw new Error("رقم الجوال غير مسجل")
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
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
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.phone = (user as any).phone
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                (session.user as any).phone = token.phone
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
})
