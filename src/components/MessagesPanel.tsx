"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Message {
    id: string;
    senderId: string;
    message: string;
    createdAt: string;
}

interface Conversation {
    key: string;
    adId: string;
    ad: {
        id: string;
        title: string;
        images: { imageUrl: string }[];
    };
    otherUser: {
        id: string;
        name: string;
        avatar: string | null;
    };
    lastMessage: {
        message: string;
        createdAt: string;
    };
    unreadCount: number;
}

export default function MessagesPanel() {
    const { data: session, status } = useSession();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch Conversations
    useEffect(() => {
        const fetchConversations = async () => {
            if (status === "authenticated") {
                try {
                    const res = await fetch("/api/messages");
                    if (res.ok) {
                        const data = await res.json();
                        setConversations(data.conversations || []);
                    }
                } catch (error) {
                    console.error("Error fetching conversations:", error);
                }
            }
            setLoading(false);
        };

        fetchConversations();

        // Polling for new conversations every 10 seconds
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, [status]);

    // Fetch Messages when conversation is selected
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedConversation) return;

            try {
                const query = new URLSearchParams({
                    adId: selectedConversation.adId,
                    otherUserId: selectedConversation.otherUser.id
                });
                const res = await fetch(`/api/messages?${query}`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data.messages || []);
                    // Update unsread count locally
                    setConversations(prev => prev.map(c =>
                        c.key === selectedConversation.key ? { ...c, unreadCount: 0 } : c
                    ));
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        // Polling for messages in active chat every 3 seconds
        let interval: NodeJS.Timeout;
        if (selectedConversation) {
            interval = setInterval(fetchMessages, 3000);
        }
        return () => clearInterval(interval);

    }, [selectedConversation]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const tempId = `temp-${Date.now()}`;
        const msgText = newMessage;

        // Optimistic update
        const optimisticMsg: Message = {
            id: tempId,
            senderId: session?.user?.id || "me",
            message: msgText,
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage("");

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adId: selectedConversation.adId,
                    receiverId: selectedConversation.otherUser.id,
                    message: msgText
                }),
            });

            if (res.ok) {
                const data = await res.json();
                // Replace temp message with real one
                setMessages(prev => prev.map(m => m.id === tempId ? data.data : m));

                // Update conversation last message
                setConversations(prev => prev.map(c =>
                    c.key === selectedConversation.key ? {
                        ...c,
                        lastMessage: { message: msgText, createdAt: new Date().toISOString() }
                    } : c
                ));
            } else {
                console.error("Failed to send message");
                // Revert on failure? Or show error.
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleDeleteConversation = (convId: string) => {
        if (!confirm("هل أنت متأكد من حذف هذه المحادثة؟")) return;
        // API delete logic not implemented yet in backend as strictly required, 
        // but we can hide it from frontend for now or add DELETE endpoint later.
        alert("خاصية الحذف غير مفعلة حالياً");
    };

    if (status === "unauthenticated") {
        return (
            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-12 text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-lg font-semibold mb-2">يجب تسجيل الدخول</h3>
                <p className="text-[var(--foreground-muted)] mb-4">
                    لعرض رسائلك، يرجى تسجيل الدخول
                </p>
                <Link href="/auth/login" className="btn btn-primary">
                    تسجيل الدخول
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex h-[600px] bg-[var(--background)] rounded-2xl border border-[var(--border)] items-center justify-center">
                <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-12 text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-lg font-semibold mb-2">لا توجد رسائل</h3>
                <p className="text-[var(--foreground-muted)] mb-4">
                    ابدأ بالتواصل مع البائعين عبر الضغط على "مراسلة" في صفحة الإعلان
                </p>
                <Link href="/" className="btn btn-primary">
                    تصفح الإعلانات
                </Link>
            </div>
        );
    }

    return (
        <div className="flex h-[600px] bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden">
            {/* Conversations List */}
            <div className={`w-full md:w-80 border-l border-[var(--border)] flex flex-col ${selectedConversation ? "hidden md:flex" : ""}`}>
                <div className="p-4 border-b border-[var(--border)]">
                    <h2 className="font-bold text-lg">الرسائل ({conversations.length})</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((conv) => (
                        <button
                            key={conv.key}
                            onClick={() => setSelectedConversation(conv)}
                            className={`w-full p-4 flex gap-3 hover:bg-[var(--background-secondary)] transition-colors border-b border-[var(--border)] text-right ${selectedConversation?.key === conv.key ? "bg-[var(--background-secondary)]" : ""
                                }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold flex-shrink-0 overflow-hidden">
                                {conv.otherUser.avatar ? (
                                    <img src={conv.otherUser.avatar} alt={conv.otherUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    conv.otherUser.name[0]
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm">{conv.otherUser.name}</span>
                                    <span className="text-xs text-[var(--foreground-muted)]">
                                        {new Date(conv.lastMessage.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className={`text-sm truncate ${conv.unreadCount > 0 ? "font-bold text-[var(--foreground)]" : "text-[var(--foreground-muted)]"}`}>
                                    {conv.lastMessage.message}
                                </p>
                                <p className="text-xs text-[var(--primary)] truncate mt-1">{conv.ad.title}</p>
                            </div>
                            {conv.unreadCount > 0 && (
                                <div className="w-5 h-5 rounded-full bg-[var(--primary)] text-white text-xs flex items-center justify-center flex-shrink-0 self-center">
                                    {conv.unreadCount}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {selectedConversation ? (
                <div className="flex-1 flex flex-col bg-[var(--background-secondary)]/30">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center gap-3">
                        <button
                            onClick={() => setSelectedConversation(null)}
                            className="md:hidden p-2 hover:bg-[var(--background-secondary)] rounded-lg"
                        >
                            →
                        </button>
                        <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold overflow-hidden">
                            {selectedConversation.otherUser.avatar ? (
                                <img src={selectedConversation.otherUser.avatar} alt={selectedConversation.otherUser.name} className="w-full h-full object-cover" />
                            ) : (
                                selectedConversation.otherUser.name[0]
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium">{selectedConversation.otherUser.name}</h3>
                            <Link href={`/ads/${selectedConversation.adId}`} className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1">
                                <span>🏷️</span>
                                {selectedConversation.ad.title}
                            </Link>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg) => {
                            const isMe = msg.senderId === session?.user?.id;
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isMe ? "justify-start" : "justify-end"}`}
                                >
                                    <div
                                        className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${isMe
                                            ? "bg-[var(--primary)] text-white rounded-tr-sm"
                                            : "bg-[var(--background)] border border-[var(--border)] rounded-tl-sm"
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                        <p className={`text-[10px] mt-1 text-left ${isMe ? "text-white/70" : "text-[var(--foreground-muted)]"}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-[var(--background)] border-t border-[var(--border)]">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="اكتب رسالتك..."
                                className="input flex-1 bg-[var(--background-secondary)]"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className="btn btn-primary px-4 disabled:opacity-50 min-w-[50px]"
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 hidden md:flex items-center justify-center text-[var(--foreground-muted)]">
                    <div className="text-center">
                        <div className="text-6xl mb-4 opacity-20">💬</div>
                        <h3 className="text-lg font-medium mb-1">اختر محادثة</h3>
                        <p className="text-sm">اختر محادثة من القائمة لعرض الرسائل والتواصل مع المعلنين</p>
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

export function StartChatButton({ sellerId, sellerName, adId, adTitle }: StartChatButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;
        setLoading(true);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adId,
                    receiverId: sellerId,
                    message: message
                }),
            });

            if (res.ok) {
                setSent(true);
                setTimeout(() => {
                    setShowModal(false);
                    setSent(false);
                    setMessage("");
                }, 2000);
            } else {
                alert("فشل إرسال الرسالة، يرجى المحاولة لاحقاً");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("حدث خطأ في الاتصال");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="btn btn-secondary w-full transition-all hover:bg-[var(--primary)] hover:text-white"
            >
                💬 مراسلة البائع
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-[var(--background)] rounded-2xl border border-[var(--border)] w-full max-w-md p-6 animate-fadeIn shadow-2xl">
                        {sent ? (
                            <div className="text-center py-8">
                                <div className="text-5xl mb-4 text-[var(--secondary)]">✓</div>
                                <h3 className="text-lg font-semibold mb-2">تم إرسال رسالتك!</h3>
                                <p className="text-[var(--foreground-muted)] mb-4">سيتم إشعارك عند رد البائع</p>
                                <Link href="/messages" className="btn btn-primary w-full">
                                    الذهاب للرسائل
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold">مراسلة {sellerName}</h2>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[var(--background-secondary)] rounded-lg">
                                        ✕
                                    </button>
                                </div>

                                <p className="text-sm text-[var(--foreground-muted)] mb-4 bg-[var(--background-secondary)] p-3 rounded-lg">
                                    بخصوص: <strong>{adTitle}</strong>
                                </p>

                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="اكتب رسالتك هنا..."
                                    className="input min-h-[120px] resize-none mb-4 w-full"
                                    autoFocus
                                />

                                <div className="flex gap-2">
                                    <button onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={!message.trim() || loading}
                                        className="btn btn-primary flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "إرسال"}
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
