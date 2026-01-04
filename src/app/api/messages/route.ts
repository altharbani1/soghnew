import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET - Get user's messages (conversations or specific chat)
export async function GET(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const adId = searchParams.get("adId")
        const otherUserId = searchParams.get("otherUserId")

        // If params provided, fetch specific chat messages
        if (adId && otherUserId) {
            const messages = await prisma.message.findMany({
                where: {
                    adId,
                    OR: [
                        { senderId: session.user.id, receiverId: otherUserId },
                        { senderId: otherUserId, receiverId: session.user.id }
                    ]
                },
                orderBy: { createdAt: "asc" },
                include: {
                    sender: { select: { id: true, name: true, avatar: true } },
                    receiver: { select: { id: true, name: true, avatar: true } }
                }
            });

            // Mark as read
            await prisma.message.updateMany({
                where: {
                    adId,
                    senderId: otherUserId,
                    receiverId: session.user.id,
                    isRead: false
                },
                data: { isRead: true, readAt: new Date() }
            });

            return NextResponse.json({ messages });
        }

        // Otherwise, Get all conversations (grouped by ad and other user)
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: session.user.id },
                    { receiverId: session.user.id }
                ]
            },
            include: {
                ad: {
                    select: {
                        id: true,
                        title: true,
                        images: { take: 1 }
                    }
                },
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        // Group messages by conversation (ad + other user)
        const conversations: any = {}

        messages.forEach(msg => {
            const otherUserId = msg.senderId === session.user!.id ? msg.receiverId : msg.senderId
            const key = `${msg.adId}-${otherUserId}`

            if (!conversations[key]) {
                const otherUser = msg.senderId === session.user!.id ? msg.receiver : msg.sender
                conversations[key] = {
                    key, // Unique key for frontend
                    adId: msg.adId,
                    ad: msg.ad,
                    otherUser,
                    lastMessage: msg,
                    unreadCount: 0,
                }
            }

            if (!msg.isRead && msg.receiverId === session.user!.id) {
                conversations[key].unreadCount++
            }
        })

        return NextResponse.json({
            conversations: Object.values(conversations)
        })

    } catch (error) {
        console.error("Error fetching messages:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب الرسائل" },
            { status: 500 }
        )
    }
}

// POST - Send a new message
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
                { status: 401 }
            )
        }

        const { adId, receiverId, message } = await request.json()

        if (!adId || !receiverId || !message) {
            return NextResponse.json(
                { error: "جميع الحقول مطلوبة" },
                { status: 400 }
            )
        }

        // Can't message yourself
        if (receiverId === session.user.id) {
            return NextResponse.json(
                { error: "لا يمكنك مراسلة نفسك" },
                { status: 400 }
            )
        }

        const newMessage = await prisma.message.create({
            data: {
                adId,
                senderId: session.user.id,
                receiverId,
                message,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    }
                }
            }
        })

        // Update ad messages count
        await prisma.ad.update({
            where: { id: adId },
            data: { messagesCount: { increment: 1 } }
        })

        return NextResponse.json({
            message: "تم إرسال الرسالة",
            data: newMessage
        }, { status: 201 })

    } catch (error) {
        console.error("Error sending message:", error)
        return NextResponse.json(
            { error: "حدث خطأ أثناء إرسال الرسالة" },
            { status: 500 }
        )
    }
}
