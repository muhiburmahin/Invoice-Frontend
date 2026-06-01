import type { Metadata } from "next";

import { AuthRouteGuard } from "@/components/modules/auth/auth-route-guard";

export const metadata: Metadata = {
  title: "Account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthRouteGuard>{children}</AuthRouteGuard>;
}
