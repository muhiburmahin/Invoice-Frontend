import Link from "next/link";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { marketingNavItems } from "@/config/marketing-nav";
import { AUTH_ROUTES } from "@/config/public-routes";

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-secondary/40 bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <BrandLogo showWordmark />
            <p className="max-w-sm text-sm text-muted-foreground">
              Invoice SaaS helps freelancers and teams send invoices, track payments, and give
              clients a secure portal to pay online.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Product</p>
            <ul className="mt-3 space-y-2">
              {marketingNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Account</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={AUTH_ROUTES.login}
                  className="text-sm text-muted-foreground hover:text-brand"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href={AUTH_ROUTES.register}
                  className="text-sm text-muted-foreground hover:text-brand"
                >
                  Create account
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-brand"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-brand-secondary/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">© {year} Invoice. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
