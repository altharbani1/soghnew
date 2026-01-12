import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
    password: string;
}

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
    const getStrength = (pass: string) => {
        let score = 0;
        if (!pass) return 0;
        if (pass.length > 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score;
    };

    const score = getStrength(password);

    return (
        <div className="flex gap-1 mt-2 h-1">
            {[1, 2, 3, 4].map((level) => (
                <div
                    key={level}
                    className={cn(
                        "h-full flex-1 rounded-full transition-all duration-300",
                        score >= level
                            ? score <= 1
                                ? "bg-red-500"
                                : score === 2
                                    ? "bg-yellow-500"
                                    : score === 3
                                        ? "bg-blue-500"
                                        : "bg-green-500"
                            : "bg-gray-200 dark:bg-gray-700"
                    )}
                />
            ))}
        </div>
    );
};
