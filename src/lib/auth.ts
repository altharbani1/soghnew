import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/db"
import { LoginSchema } from "@/lib/validations/auth"

import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            name: "credentials",
            credentials: {
                phone: { label: "رقم الجوال أو البريد", type: "text" },
                password: { label: "كلمة المرور", type: "password" },
                email: { label: "البريد الإلكتروني", type: "email" }
            },
            async authorize(credentials) {
                const parsedCredentials = LoginSchema.safeParse(credentials);

                if (!parsedCredentials.success) {
                    throw new Error("يرجى إدخال بيانات الدخول الصحيحة");
                }

                const { identifier, password } = parsedCredentials.data;

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

                if (!user.password) {
                    // Should act as if "password invalid" or separate error for OAuth users trying to login with password
                    throw new Error("يرجى تسجيل الدخول عبر Google")
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
                    phone: user.phone || "", // Handle optional phone
                    image: user.avatar,
                    role: user.role || "USER",
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id
                token.phone = user.phone
                token.role = user.role
                token.picture = user.image // Capture image from user object (mapped from Google)
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.phone = token.phone as string // might be undefined/null
                session.user.role = token.role as string
                // session.user.image is already handled by default
            }
            return session
        },
        async signIn({ user, account, profile }) {
            // Optional: Custom logic on sign in
            return true;
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
