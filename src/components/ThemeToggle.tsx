"use client";

import { useTheme } from "@/lib/ThemeContext";

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else if (theme === "dark") {
            setTheme("system");
        } else {
            setTheme("light");
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
            title={theme === "system" ? "تلقائي" : theme === "dark" ? "داكن" : "فاتح"}
        >
            {resolvedTheme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                </svg>
            )}
            {theme === "system" && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--primary)]"></span>
            )}
        </button>
    );
}
