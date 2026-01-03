"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Notification types
interface Notification {
    id: string;
    type: 'message' | 'offer' | 'alert' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
    link?: string;
    icon?: string;
}

// Notification Item Component
function NotificationItem({ notification, onRead }: { notification: Notification; onRead: (id: string) => void }) {
    const bgColors = {
        message: "bg-blue-500",
        offer: "bg-green-500",
        alert: "bg-yellow-500",
        system: "bg-gray-500"
    };

    const content = (
        <div
            className={`flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-[var(--background-secondary)] cursor-pointer ${!notification.read ? 'bg-[var(--primary)]/5' : ''
                }`}
            onClick={() => onRead(notification.id)}
        >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-full ${bgColors[notification.type]} flex items-center justify-center text-white text-lg flex-shrink-0`}>
                {notification.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${!notification.read ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}`}>
                        {notification.title}
                    </span>
                    {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                    )}
                </div>
                <p className="text-sm text-[var(--foreground-muted)] truncate">
                    {notification.message}
                </p>
                <span className="text-xs text-[var(--foreground-muted)]">
                    {notification.time}
                </span>
            </div>
        </div>
    );

    if (notification.link) {
        return <Link href={notification.link}>{content}</Link>;
    }
    return content;
}

// Notification Bell Component
export function NotificationBell() {
    const { status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Don't show notifications for unauthenticated users
    if (status !== "authenticated") {
        return null;
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const handleReadAll = () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        );
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-[var(--background-secondary)] transition-colors"
                aria-label="الإشعارات"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-colors ${isOpen ? 'text-[var(--primary)]' : ''}`}
                >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>

                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--error)] text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-[var(--background)] rounded-2xl border border-[var(--border)] shadow-2xl z-50 overflow-hidden animate-fadeIn">
                        {/* Header */}
                        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                🔔 الإشعارات
                                {unreadCount > 0 && (
                                    <span className="text-xs bg-[var(--primary)] text-white px-2 py-0.5 rounded-full">
                                        {unreadCount} جديد
                                    </span>
                                )}
                            </h3>
                            <div className="flex gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleReadAll}
                                        className="text-xs text-[var(--primary)] hover:underline"
                                    >
                                        قراءة الكل
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-[var(--border)]">
                                    {notifications.map(notification => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onRead={handleRead}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="text-4xl mb-3">🔕</div>
                                    <p className="text-[var(--foreground-muted)]">لا توجد إشعارات</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-[var(--border)] bg-[var(--background-secondary)]">
                                <button
                                    onClick={handleClearAll}
                                    className="w-full text-center text-sm text-[var(--foreground-muted)] hover:text-[var(--error)] transition-colors"
                                >
                                    مسح جميع الإشعارات
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default NotificationBell;
