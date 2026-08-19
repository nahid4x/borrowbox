import { z } from "zod";

const diuEmail = z
    .string()
    .email("Enter a valid email address")
    .toLowerCase()
    .refine((val) => val.endsWith("@diu.edu.bd"), {
    message: "Only @diu.edu.bd email addresses are allowed",
});
const flexibleUrl = z
    .string()
    .refine((val) => val.startsWith("/") || /^https?:\/\//.test(val), {
    message: "Invalid image URL",
});

const phoneNumber = z
    .string()
    .min(1, "Phone number is required.")
    .max(20, "Phone number must be at most 20 characters")
    .refine((val) => val.replace(/\D/g, "").length >= 10, {
        message: "Phone number must have at least 10 digits",
    });

const socialUrl = z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val));

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(80),
    email: diuEmail,
    studentId: z.string().min(3, "Student ID is required").max(30),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
});
export const itemCreateSchema = z.object({
    name: z.string().min(2).max(120),
    description: z.string().min(5).max(2000),
    categoryId: z.string().uuid(),
    condition: z.enum(["NEW", "GOOD", "FAIR", "WORN"]),
    imageUrl: flexibleUrl.optional().nullable(),
    phoneNumber,
    socialUrl: socialUrl.optional().nullable(),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1").max(999, "Quantity seems too high"),
});

export const itemUpdateSchema = itemCreateSchema.partial().extend({
    isAvailable: z.boolean().optional(),
});
export const requestCreateSchema = z.object({
    itemId: z.string().uuid(),
    note: z.string().max(500).optional(),
});
export const requestActionSchema = z.object({
    action: z.enum(["approve", "reject", "mark_borrowed", "mark_returned", "cancel"]),
});
export const profileUpdateSchema = z.object({
    name: z.string().min(2).max(80).optional(),
    email: diuEmail.optional(),
    studentId: z.string().min(3, "Student ID must be at least 3 characters").max(30).optional().nullable(),
    avatarUrl: flexibleUrl.optional().nullable(),
});
export const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
});
export const categoryCreateSchema = z.object({
    name: z.string().min(2).max(60),
    icon: z.string().max(10).optional(),
});
export const reportCreateSchema = z.object({
    category: z.enum([
        "BUG_REPORT", "APP_CRASH", "UI_DISPLAY_ISSUE", "FEATURE_REQUEST",
        "PERFORMANCE_ISSUE", "LOGIN_PROBLEM", "BORROW_REQUEST_ISSUE",
        "ITEM_LISTING_ISSUE", "NOTIFICATION_ISSUE", "SCAM_OR_FRAUD",
        "FAKE_LISTING", "HARASSMENT_OR_ABUSE", "INAPPROPRIATE_CONTENT",
        "SPAM", "ACCOUNT_ISSUE", "SECURITY_CONCERN", "PRIVACY_CONCERN",
        "PAYMENT_ISSUE", "OTHER",
    ]),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
    description: z.string().min(20, "Please describe the issue in at least 20 characters").max(3000),
    email: z.string().email("Enter a valid email address"),
    relatedItemId: z.string().uuid().optional().nullable(),
    attachments: z.array(z.string()).max(10, "Maximum 10 files").optional().default([]),
});

export const reportUpdateSchema = z.object({
    status: z.enum(["RECEIVED", "UNDER_REVIEW", "NEED_MORE_INFO", "RESOLVED", "CLOSED", "REJECTED"]),
    adminReply: z.string().max(3000).optional(),
});