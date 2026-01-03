"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("system");
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem("souqah-theme") as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        const updateTheme = () => {
            let resolved: "light" | "dark" = "light";

            if (theme === "system") {
                resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            } else {
                resolved = theme;
            }

            setResolvedTheme(resolved);

            if (resolved === "dark") {
                root.classList.add("dark");
                root.style.colorScheme = "dark";
            } else {
                root.classList.remove("dark");
                root.style.colorScheme = "light";
            }
        };

        updateTheme();
        localStorage.setItem("souqah-theme", theme);

        // Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", updateTheme);

        return () => mediaQuery.removeEventListener("change", updateTheme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
