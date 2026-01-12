import { z } from "zod";

export const RegisterSchema = z.object({
    name: z
        .string()
        .min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" })
        .max(50, { message: "الاسم يجب ألا يتجاوز 50 حرفاً" })
        .regex(/^[\p{L}\s]+$/u, { message: "الاسم يجب أن يحتوي على أحرف فقط" }),

    email: z
        .string()
        .email({ message: "البريد الإلكتروني غير صحيح" }),

    phone: z
        .string()
        .regex(/^05\d{8}$/, { message: "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام" }),

    password: z
        .string()
        .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" })
        .regex(/[A-Z]/, { message: "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل" })
        .regex(/[0-9]/, { message: "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل" })
        .regex(/[^A-Za-z0-9]/, { message: "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل" }),

    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
        message: "يجب الموافقة على الشروط والأحكام",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
});

export const LoginSchema = z.object({
    identifier: z
        .string()
        .min(1, { message: "يرجى إدخال البريد الإلكتروني أو رقم الجوال" }),
    password: z
        .string()
        .min(1, { message: "يرجى إدخال كلمة المرور" }),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
});

export const ResetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" })
        .regex(/[A-Z]/, { message: "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل" })
        .regex(/[0-9]/, { message: "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل" })
        .regex(/[^A-Za-z0-9]/, { message: "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
});
