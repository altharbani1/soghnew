"use client";

import { InputHTMLAttributes, ReactNode } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: ReactNode;
}

export default function AuthInput({ label, error, icon, className = "", ...props }: AuthInputProps) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="block text-sm font-medium text-slate-700">
                {label}
            </label>
            <div className="relative group">
                <input
                    className={`
            w-full px-4 py-3 bg-white border outline-none rounded-xl text-slate-900 text-sm transition-all
            placeholder:text-slate-400
            ${icon ? "pr-11" : ""}
            ${error
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300"
                        }
          `}
                    {...props}
                />
                {icon && (
                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${error ? "text-red-400" : "text-slate-400 group-focus-within:text-indigo-500"}`}>
                        {icon}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-600 font-medium animate-fadeIn">{error}</p>
            )}
        </div>
    );
}
