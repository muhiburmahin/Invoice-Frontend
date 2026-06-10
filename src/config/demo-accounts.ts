import type { AuthAccountKind } from "@/components/modules/auth/AuthAccountTypeTabs";

export type DemoAccount = {
  kind: AuthAccountKind;
  label: string;
  email: string;
  password: string;
  hint: string;
};

/** Shown on the login page when demo mode is enabled (local dev or NEXT_PUBLIC_SHOW_DEMO_LOGIN). */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    kind: "staff",
    label: "Admin",
    email: "mdmahincse@gmail.com",
    password: "123456aA@",
    hint: "Super Admin — users, activity logs, scheduled jobs",
  },
  {
    kind: "business",
    label: "Business user",
    email: "muhiburmahin.edu@gmail.com",
    password: "123456aA@",
    hint: "Dashboard — clients, invoices, payments, settings",
  },
];

export function isDemoLoginEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_SHOW_DEMO_LOGIN === "true") return true;
  return process.env.NODE_ENV === "development";
}
