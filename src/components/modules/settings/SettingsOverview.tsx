"use client";

import Link from "next/link";
import { Bell, Building2, ChevronRight, User, Wallet } from "lucide-react";

import { SettingsNav } from "@/components/modules/settings/SettingsNav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";

const sections = [
  {
    href: "/settings/business",
    title: "Business profile",
    description: "Company details, invoice defaults, and branding.",
    icon: Building2,
  },
  {
    href: "/settings/billing",
    title: "Billing & plan",
    description: "Subscription, usage limits, and Stripe portal.",
    icon: Wallet,
  },
  {
    href: "/settings/account",
    title: "Account & security",
    description: "Profile, password, sessions, and account deletion.",
    icon: User,
  },
  {
    href: "/settings/notifications",
    title: "Notifications",
    description: "In-app alerts for invoices, payments, and billing.",
    icon: Bell,
  },
] as const;

export function SettingsOverview() {
  const { user, plan } = useAuth();
  const { data: unreadData } = useUnreadNotificationCount();
  const unread = unreadData?.unreadCount ?? 0;

  return (
    <div className="space-y-6">
      <SettingsNav />

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>
            Signed in as {user?.email ?? "—"} on the {plan} plan.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const showUnread = section.href === "/settings/notifications" && unread > 0;

          return (
            <Link key={section.href} href={section.href} className="group block">
              <Card className="h-full transition-colors hover:border-brand/40 hover:bg-muted/20">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="rounded-lg bg-brand-muted p-2 text-brand">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {section.title}
                      {showUnread ? (
                        <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-brand-foreground">
                          {unread} unread
                        </span>
                      ) : null}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {section.description}
                    </CardDescription>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
