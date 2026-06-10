import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password cannot exceed 128 characters")
  .refine((val) => !/\s/.test(val), { message: "Password must not contain spaces" })
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter (a-z)",
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter (A-Z)",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Password must contain at least one number (0-9)",
  })
  .refine((val) => /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(val), {
    message: "Password must contain at least one special character (e.g. !@#$%^&*)",
  });

/** Auth — aligned with backend auth.validation */
export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name cannot exceed 80 characters")
      .regex(/^[\p{L}\p{N} .'-]+$/u, {
        message:
          "Name can only contain letters, numbers, spaces, dots, apostrophes and hyphens",
      }),
    email: z.string().trim().email("Enter a valid email"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const invoiceItemSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),
  quantity: z
    .number({ message: "Quantity must be a number" })
    .min(0.01, "Quantity must be greater than 0")
    .max(999999, "Quantity is too large"),
  rate: z
    .number({ message: "Rate must be a number" })
    .min(0, "Rate cannot be negative")
    .max(99999999, "Rate is too large"),
  unit: z.string().trim().max(30, "Unit is too long").optional(),
  taxable: z.boolean().optional(),
});

export const invoiceFormSchema = z
  .object({
    clientId: z.string().min(1, "Select a client"),
    issueDate: z.string().min(1, "Issue date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    taxRate: z
      .number({ message: "Tax rate must be a number" })
      .min(0, "Tax rate cannot be negative")
      .max(100, "Tax rate cannot exceed 100%"),
    discount: z
      .number({ message: "Discount must be a number" })
      .min(0, "Discount cannot be negative"),
    discountType: z.enum(["FIXED", "PERCENTAGE"]),
    currency: z.string().min(3, "Select a currency"),
    notes: z.string().trim().max(2000, "Notes cannot exceed 2000 characters"),
    terms: z.string().trim().max(2000, "Terms cannot exceed 2000 characters"),
    footer: z.string().trim().max(1000, "Footer cannot exceed 1000 characters"),
    items: z.array(invoiceItemSchema).min(1, "Add at least one line item"),
  })
  .superRefine((data, ctx) => {
    if (new Date(data.dueDate) < new Date(data.issueDate)) {
      ctx.addIssue({
        code: "custom",
        message: "Due date cannot be before issue date",
        path: ["dueDate"],
      });
    }
    if (data.discountType === "PERCENTAGE" && data.discount > 100) {
      ctx.addIssue({
        code: "custom",
        message: "Percentage discount cannot exceed 100%",
        path: ["discount"],
      });
    }
    if (data.discountType === "FIXED") {
      const subtotal = data.items.reduce(
        (sum, item) => sum + item.quantity * item.rate,
        0,
      );
      if (data.discount > subtotal) {
        ctx.addIssue({
          code: "custom",
          message: "Fixed discount cannot exceed subtotal",
          path: ["discount"],
        });
      }
    }
  });

export type InvoiceFormInput = z.infer<typeof invoiceFormSchema>;

const optionalTrimmedString = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} cannot exceed ${max} characters`);

const nullableUrl = z
  .string()
  .trim()
  .max(2048, "URL is too long")
  .refine((v) => v === "" || z.string().url().safeParse(v).success, {
    message: "Please provide a valid URL",
  });

const hexColor = z
  .string()
  .trim()
  .refine(
    (v) => v === "" || /^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(v),
    "Color must be a valid hex code (e.g. #4F46E5)",
  );

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (v) =>
      v === "" ||
      (/^[+\d][\d\s()-]*\d$/.test(v) && v.length >= 5 && v.length <= 25),
    "Enter a valid phone number",
  );

/** Business settings — aligned with backend business.validation */
export const businessFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Business name is required")
    .max(120, "Business name cannot exceed 120 characters"),
  logo: nullableUrl,
  email: z
    .string()
    .trim()
    .refine((v) => v === "" || z.string().email().safeParse(v).success, {
      message: "Enter a valid email address",
    }),
  phone: phoneSchema,
  website: nullableUrl,
  address: optionalTrimmedString(500, "Address"),
  city: optionalTrimmedString(120, "City"),
  state: optionalTrimmedString(120, "State"),
  country: optionalTrimmedString(120, "Country"),
  zipCode: optionalTrimmedString(20, "Zip code"),
  taxNumber: optionalTrimmedString(60, "Tax number"),
  vatNumber: optionalTrimmedString(60, "VAT number"),
  currency: z.string().min(3, "Select a currency"),
  taxRate: z
    .number({ message: "Tax rate must be a number" })
    .min(0, "Tax rate cannot be negative")
    .max(100, "Tax rate cannot exceed 100%"),
  invoicePrefix: z
    .string()
    .trim()
    .min(1, "Invoice prefix is required")
    .max(10, "Invoice prefix cannot exceed 10 characters")
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Prefix can only contain letters, numbers, dashes and underscores",
    ),
  nextNumber: z
    .number({ message: "Next number must be a whole number" })
    .int("Next number must be a whole number")
    .min(1, "Next number must be at least 1")
    .max(9_999_999, "Next number is too large"),
  defaultDueDays: z
    .number({ message: "Default due days must be a number" })
    .int("Default due days must be a whole number")
    .min(0, "Default due days cannot be negative")
    .max(365, "Default due days cannot exceed 365"),
  defaultNotes: optionalTrimmedString(2000, "Default notes"),
  defaultTerms: optionalTrimmedString(2000, "Default terms"),
  primaryColor: hexColor,
  accentColor: hexColor,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type BusinessFormInput = z.infer<typeof businessFormSchema>;

/** Clients — aligned with backend client.validation */
export const clientFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Client name is required")
    .max(120, "Client name cannot exceed 120 characters"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(254, "Email is too long"),
  company: z.string().trim().max(120, "Company cannot exceed 120 characters"),
  phone: z
    .string()
    .trim()
    .refine(
      (v) =>
        v === "" ||
        (/^[+\d][\d\s()-]*\d$/.test(v) && v.length >= 5 && v.length <= 25),
      "Enter a valid phone number",
    ),
  address: z.string().trim().max(500, "Address cannot exceed 500 characters"),
  city: z.string().trim().max(120, "City cannot exceed 120 characters"),
  state: z.string().trim().max(120, "State cannot exceed 120 characters"),
  country: z.string().trim().max(120, "Country cannot exceed 120 characters"),
  zipCode: z.string().trim().max(20, "Zip code cannot exceed 20 characters"),
  taxNumber: z.string().trim().max(60, "Tax number cannot exceed 60 characters"),
  currency: z.string(),
  notes: z.string().trim().max(2000, "Notes cannot exceed 2000 characters"),
  tags: z.string().trim().max(200, "Tags input is too long"),
  portalEnabled: z.boolean(),
});

export type ClientFormInput = z.infer<typeof clientFormSchema>;

/** Manual payment recording — aligned with backend payment.validation */
export const recordPaymentSchema = z.object({
  invoiceId: z.string().min(1, "Select an invoice"),
  amount: z
    .number({ message: "Amount is required" })
    .min(0.01, "Amount must be greater than zero"),
  method: z.enum(["BANK_TRANSFER", "CASH", "CHECK", "OTHER"], {
    message: "Select a payment method",
  }),
  note: z.string().trim().max(500, "Note cannot exceed 500 characters"),
  paidAt: z.string().optional(),
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

/** Account settings — aligned with backend auth.validation */
export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name cannot exceed 80 characters")
      .regex(/^[\p{L}\p{N} .'-]+$/u, {
        message:
          "Name can only contain letters, numbers, spaces, dots, apostrophes and hyphens",
      }),
    avatar: z
      .string()
      .trim()
      .url("Avatar must be a valid URL")
      .max(2048, "Avatar URL is too long")
      .or(z.literal("")),
  })
  .refine((data) => data.name.trim() !== "" || data.avatar !== undefined, {
    message: "Provide at least one field to update",
  });

export type UpdateProfileFormInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your new password"),
    revokeOtherSessions: z.boolean().optional(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ChangePasswordFormInput = z.infer<typeof changePasswordSchema>;

export const deleteAccountSchema = z.object({
  password: z.string().optional(),
  confirm: z.literal("DELETE", {
    message: 'Type "DELETE" to confirm account deletion',
  }),
});

export type DeleteAccountFormInput = z.infer<typeof deleteAccountSchema>;

/** Recurring schedules — aligned with backend recurring.validation */
export const recurringFormSchema = z.object({
  clientId: z.string().min(1, "Select a client"),
  frequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"], {
    message: "Select a frequency",
  }),
  nextRunAt: z.string().min(1, "Next run date is required"),
  isActive: z.boolean(),
});

export type RecurringFormInput = z.infer<typeof recurringFormSchema>;
