"use client";

import { useState } from "react";
import Link from "next/link";

// Mock messages data
const mockConversations = [
    {
        id: "conv1",
        recipientId: "u1",
        recipientName: "أحمد محمد",
        recipientAvatar: "أ",
        lastMessage: "هل السيارة لا تزال متوفرة؟",
        lastMessageTime: "منذ 5 دقائق",
        unread: 2,
        adTitle: "كامري 2023 فل كامل",
    },
    {
        id: "conv2",
        recipientId: "u2",
        recipientName: "عقارات الخليج",
        recipientAvatar: "ع",
        lastMessage: "نعم الشقة متوفرة، متى تريد المعاينة؟",
        lastMessageTime: "منذ ساعة",
        unread: 0,
        adTitle: "شقة للإيجار - حي النرجس",
    },
    {
        id: "conv3",
        recipientId: "u3",
        recipientName: "متجر التقنية",
        recipientAvatar: "م",
        lastMessage: "تم الاتفاق، شكراً لك",
        lastMessageTime: "أمس",
        unread: 0,
        adTitle: "ايفون 15 برو ماكس",
    },
];

const mockMessages = [
    { id: "m1", senderId: "me", text: "السلام عليكم، هل السيارة متوفرة؟", time: "10:30 ص" },
    { id: "m2", senderId: "u1", text: "وعليكم السلام، نعم متوفرة", time: "10:32 ص" },
    { id: "m3", senderId: "me", text: "ممتاز! هل يمكنني المعاينة اليوم؟", time: "10:35 ص" },
    { id: "m4", senderId: "u1", text: "طبعاً، أي وقت يناسبك", time: "10:36 ص" },
    { id: "m5", senderId: "u1", text: "هل السيارة لا تزال متوفرة؟", time: "10:40 ص" },
];

interface Message {
    id: string;
    senderId: string;
    text: string;
    time: string;
}

interface Conversation {
    id: string;
    recipientId: string;
    recipientName: string;
    recipientAvatar: string;
    lastMessage: string;
    lastMessageTime: string;
    unread: number;
    adTitle: string;
}

export default function MessagesPanel() {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const newMsg: Message = {
            id: `m${Date.now()}`,
            senderId: "me",
            text: newMessage,
            time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages([...messages, newMsg]);
        setNewMessage("");
    };

    return (
        <div className="flex h-[600px] bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
            {/* Conversations List */}
            <div className={`w-full md:w-80 border-l border-[var(--border)] ${selectedConversation ? "hidden md:block" : ""}`}>
                <div className="p-4 border-b border-[var(--border)]">
                    <h2 className="font-bold text-lg">الرسائل</h2>
                </div>
                <div className="overflow-y-auto h-[calc(100%-60px)]">
                    {mockConversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedConversation(conv)}
                            className={`w-full p-4 flex gap-3 hover:bg-[var(--background-secondary)] transition-colors border-b border-[var(--border)] text-right ${selectedConversation?.id === conv.id ? "bg-[var(--background-secondary)]" : ""
                                }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold flex-shrink-0">
                                {conv.recipientAvatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium">{conv.recipientName}</span>
                                    <span className="text-xs text-[var(--foreground-muted)]">{conv.lastMessageTime}</span>
                                </div>
                                <p className="text-sm text-[var(--foreground-muted)] truncate">{conv.lastMessage}</p>
                                <p className="text-xs text-[var(--primary)] truncate mt-1">{conv.adTitle}</p>
                            </div>
                            {conv.unread > 0 && (
                                <div className="w-5 h-5 rounded-full bg-[var(--primary)] text-white text-xs flex items-center justify-center flex-shrink-0">
                                    {conv.unread}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {selectedConversation ? (
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
                        <button
                            onClick={() => setSelectedConversation(null)}
                            className="md:hidden p-2 hover:bg-[var(--background-secondary)] rounded-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold">
                            {selectedConversation.recipientAvatar}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium">{selectedConversation.recipientName}</h3>
                            <Link href={`/ads/1`} className="text-xs text-[var(--primary)] hover:underline">
                                {selectedConversation.adTitle}
                            </Link>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.senderId === "me" ? "justify-start" : "justify-end"}`}
                            >
                                <div
                                    className={`max-w-[75%] p-3 rounded-2xl ${msg.senderId === "me"
                                            ? "bg-[var(--primary)] text-white rounded-tr-sm"
                                            : "bg-[var(--background-secondary)] rounded-tl-sm"
                                        }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 ${msg.senderId === "me" ? "text-white/70" : "text-[var(--foreground-muted)]"}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-[var(--border)]">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="اكتب رسالتك..."
                                className="input flex-1"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className="btn btn-primary px-4 disabled:opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m22 2-7 20-4-9-9-4Z" />
                                    <path d="M22 2 11 13" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 hidden md:flex items-center justify-center text-[var(--foreground-muted)]">
                    <div className="text-center">
                        <div className="text-5xl mb-4">💬</div>
                        <h3 className="text-lg font-medium mb-1">اختر محادثة</h3>
                        <p className="text-sm">اختر محادثة من القائمة لعرض الرسائل</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Start Chat Button Component
interface StartChatButtonProps {
    sellerId: string;
    sellerName: string;
    adId: string;
    adTitle: string;
}

export function StartChatButton({ sellerName, adTitle }: StartChatButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSent(true);

        setTimeout(() => {
            setShowModal(false);
            setSent(false);
            setMessage("");
        }, 2000);
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="btn btn-secondary w-full"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                مراسلة البائع
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] w-full max-w-md p-6 animate-fadeIn">
                        {sent ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-[var(--secondary)]/10 flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">تم إرسال رسالتك!</h3>
                                <p className="text-[var(--foreground-muted)]">سيتم إشعارك عند رد البائع</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold">مراسلة {sellerName}</h2>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[var(--background-secondary)] rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <p className="text-sm text-[var(--foreground-muted)] mb-4">
                                    بخصوص: {adTitle}
                                </p>

                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="اكتب رسالتك هنا..."
                                    className="input min-h-[120px] resize-none mb-4"
                                />

                                <div className="flex gap-2">
                                    <button onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={!message.trim()}
                                        className="btn btn-primary flex-1 disabled:opacity-50"
                                    >
                                        إرسال
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
