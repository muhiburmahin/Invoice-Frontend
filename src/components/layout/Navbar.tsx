"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  CreditCard,
  FileText,
  Home,
  Keyboard,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Shield,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import {
  AUTH_ROUTES,
  DASHBOARD_HOME,
  isProtectedRoute,
} from "@/config/public-routes";
import { getBreadcrumbs, getPageTitle } from "@/config/navigation";
import { marketingNavItems } from "@/config/marketing-nav";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { isStaff } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/types";

const quickCreateLinks = [
  { href: "/invoices/new", label: "New invoice", icon: FileText },
  { href: "/clients", label: "Add client", icon: Users },
  { href: "/recurring/new", label: "Recurring invoice", icon: CreditCard },
];

const appSearchRoutes = [
  { href: "/", label: "Website home", keywords: "marketing landing homepage public" },
  { href: DASHBOARD_HOME, label: "Dashboard", keywords: "home overview" },
  { href: "/clients", label: "Clients", keywords: "customers" },
  { href: "/invoices", label: "Invoices", keywords: "bills" },
  { href: "/invoices/new", label: "New invoice", keywords: "create" },
  { href: "/payments", label: "Payments", keywords: "money" },
  { href: "/settings", label: "Settings", keywords: "account business" },
];

function useNavbarMode() {
  const pathname = usePathname();
  const isPortal = pathname.startsWith("/portal");
  const isApp =
    isProtectedRoute(pathname) && !isPortal && !pathname.startsWith("/admin");
  return { isApp, isPortal, pathname };
}

function getInitials(name?: string | null) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?"
  );
}

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-brand-foreground"
    >
      Skip to content
    </a>
  );
}

function AppNavbarShell({
  children,
  scrolled,
}: {
  children: ReactNode;
  scrolled: boolean;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-all duration-300",
        scrolled
          ? "border-brand-secondary/30 bg-background/98 shadow-md backdrop-blur-lg"
          : "border-brand-secondary/40 bg-background/90 backdrop-blur-md",
      )}
    >
      <SkipLink />
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-2 px-3 sm:px-4 md:px-6">
        {children}
      </div>
    </header>
  );
}

function ProfileMenu({
  align = "end",
  showName = false,
  compact = false,
  onBrand = false,
}: {
  align?: "start" | "end";
  showName?: boolean;
  compact?: boolean;
  onBrand?: boolean;
}) {
  const router = useRouter();
  const { user, logout, plan } = useAuth();
  const staff = isStaff(user?.role);
  const initials = getInitials(user?.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className={cn(
              "min-h-11 min-w-11 gap-2 rounded-full px-1.5",
              showName && "pr-3",
              compact && "px-1",
              onBrand && "text-white hover:bg-white/20 hover:text-white",
              onBrand && "border-2 border-white/40",
            )}
          >
            <Avatar className={cn("size-9 ring-2", onBrand ? "ring-white/50" : "ring-brand-secondary/80")}>
              <AvatarFallback className="bg-brand-secondary text-xs font-semibold text-brand-secondary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            {showName ? (
              <span className="hidden max-w-[120px] truncate text-sm font-medium lg:inline">
                {user?.name}
              </span>
            ) : null}
          </Button>
        }
      />
      <DropdownMenuContent align={align} className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1.5 py-0.5">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user?.email}
              </span>
              <Badge variant="secondary" className="w-fit text-[10px] uppercase tracking-wide">
                {plan} plan
              </Badge>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/")}>
          <Home className="size-4" />
          Website home
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(DASHBOARD_HOME)}>
          <LayoutDashboard className="size-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings/billing")}>
          <CreditCard className="size-4" />
          Billing & plan
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings/account")}>
          <User className="size-4" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>
        {staff ? (
          <DropdownMenuItem onClick={() => router.push("/admin")}>
            <Shield className="size-4" />
            Admin console
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => void logout()}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AuthButtons({
  stacked = false,
  scrolled = false,
}: {
  stacked?: boolean;
  scrolled?: boolean;
}) {
  return (
    <div className={cn("flex gap-2", stacked ? "flex-col" : "items-center")}>
      <Link
        href={AUTH_ROUTES.login}
        className={cn(
          buttonVariants({ variant: "ghost", size: stacked ? "lg" : "default" }),
          "min-h-11 rounded-full font-bold",
          stacked && "h-12 w-full justify-center",
          scrolled
            ? "text-white hover:bg-white/20 hover:text-white"
            : "text-foreground hover:bg-brand-secondary/60",
        )}
      >
        Sign in
      </Link>
      <Link
        href={AUTH_ROUTES.register}
        className={cn(
          buttonVariants({ size: stacked ? "lg" : "default" }),
          "min-h-11 rounded-full px-6 font-bold shadow-lg",
          stacked && "h-12 w-full justify-center",
          scrolled
            ? "bg-white text-brand hover:bg-brand-secondary"
            : "bg-brand text-brand-foreground hover:bg-brand/90",
        )}
      >
        Get started
      </Link>
    </div>
  );
}

function AuthSection({
  stacked,
  scrolled = false,
  onBrand = false,
}: {
  stacked?: boolean;
  scrolled?: boolean;
  onBrand?: boolean;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton
          className={cn("hidden h-11 w-16 rounded-full md:block", onBrand && "bg-white/20")}
        />
        <Skeleton className={cn("h-11 w-28 rounded-full", onBrand && "bg-white/20")} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <ProfileMenu showName={!stacked} onBrand={onBrand} />;
  }

  return <AuthButtons stacked={stacked} scrolled={scrolled} />;
}

function NavbarSearch({ mode }: { mode: "app" | "marketing" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const routes = mode === "app" ? appSearchRoutes : marketingNavItems.map((m) => ({
    href: m.href,
    label: m.label,
    keywords: m.label,
  }));

  const results = query.trim()
    ? routes.filter(
        (r) =>
          r.label.toLowerCase().includes(query.toLowerCase()) ||
          r.keywords.toLowerCase().includes(query.toLowerCase()),
      )
    : routes.slice(0, 5);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-11 shrink-0 md:hidden"
        aria-label="Search"
        onClick={() => setOpen(true)}
      >
        <Search className="size-5" />
      </Button>

      <div className="relative hidden md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search…"
          className="h-10 w-48 border-brand-secondary/50 bg-muted/40 pl-9 lg:w-64"
          aria-label="Search"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border bg-background px-1.5 text-[10px] text-muted-foreground lg:inline">
          ⌘K
        </kbd>
        {open && query ? (
          <div className="absolute top-full z-50 mt-1 w-full min-w-[16rem] rounded-lg border bg-popover p-1 shadow-lg">
            {results.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">No results</p>
            ) : (
              results.map((r) => (
                <button
                  key={r.href}
                  type="button"
                  className="flex w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => go(r.href)}
                >
                  {r.label}
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 p-4 pt-20 md:hidden">
          <div
            className="w-full max-w-lg rounded-xl border bg-background p-4 shadow-xl"
            role="dialog"
            aria-label="Search"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages…"
                className="h-12 pl-10"
              />
            </div>
            <ul className="mt-2 max-h-60 overflow-y-auto">
              {results.map((r) => (
                <li key={r.href}>
                  <button
                    type="button"
                    className="flex w-full rounded-lg px-3 py-3 text-left text-base font-medium hover:bg-muted"
                    onClick={() => go(r.href)}
                  >
                    {r.label}
                  </button>
                </li>
              ))}
            </ul>
            <Button variant="ghost" className="mt-2 w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function HelpMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="hidden size-11 shrink-0 md:inline-flex"
            aria-label="Help"
          >
            <CircleHelp className="size-5" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Help</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.open("/faq", "_self")}>
          <CircleHelp className="size-4" />
          FAQ
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open("/contact", "_self")}>
          Help center
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Keyboard className="size-4" />
          ⌘K Search
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationBell({
  notifications,
  unread,
  onBrand = false,
}: {
  notifications: NotificationItem[];
  unread: number;
  onBrand?: boolean;
}) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative size-11 shrink-0 rounded-full",
              onBrand && "text-white hover:bg-white/20 hover:text-white",
            )}
            aria-label={unread > 0 ? `${unread} unread notifications` : "Notifications"}
          >
            <Bell className="size-5" />
            {unread > 0 ? (
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white",
                  onBrand ? "bg-red-500" : "bg-brand text-brand-foreground",
                )}
              >
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            Notifications
            {unread > 0 ? (
              <Badge variant="secondary" className="text-[10px]">
                {unread} new
              </Badge>
            ) : null}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            You&apos;re all caught up
          </p>
        ) : (
          notifications.slice(0, 5).map((n) => (
            <DropdownMenuItem
              key={n.id}
              className="flex flex-col items-start gap-0.5 py-2"
              onClick={() => router.push("/settings/notifications")}
            >
              <span className="font-medium">{n.title}</span>
              <span className="line-clamp-2 text-xs text-muted-foreground">{n.message}</span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/settings/notifications")}>
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const PUBLIC_NAV = [
  { href: "/", label: "Home", icon: Home },
  ...marketingNavItems,
];

function PublicNavbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { scrolled, mounted } = useNavbarScroll();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: dashboard } = useDashboard({ enabled: isAuthenticated });
  const unread =
    dashboard?.unreadCount ?? 0;
  const notifications = dashboard?.notifications ?? [];

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (!mounted) {
    return (
      <>
        <div className="fixed top-0 z-50 h-20 w-full bg-transparent pt-[env(safe-area-inset-top)]" />
        <div className="h-20 shrink-0" aria-hidden />
      </>
    );
  }

  return (
    <>
      <nav
        aria-label="Global navigation"
        className={cn(
          "fixed top-0 z-50 w-full pt-[env(safe-area-inset-top)] transition-all duration-500 ease-out",
          scrolled
            ? "bg-brand shadow-lg shadow-brand/20"
            : "bg-transparent",
        )}
      >
        <SkipLink />
        <div
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-500 md:px-8",
            scrolled ? "h-14" : "h-20",
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-10">
            <BrandLogo scrolled={scrolled} />

            <div className="hidden items-center gap-1 lg:flex">
              {PUBLIC_NAV.map((link) => {
                const isActive = pathname === link.href;
                const Icon = "icon" in link ? link.icon : null;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-bold transition-colors duration-300",
                      scrolled
                        ? isActive
                          ? "text-white"
                          : "text-brand-secondary hover:text-white"
                        : isActive
                          ? "text-brand"
                          : "text-muted-foreground hover:text-brand",
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      {Icon ? <Icon className="size-4 opacity-80" /> : null}
                      {link.label}
                    </span>
                    {isActive ? (
                      <span
                        className={cn(
                          "absolute inset-0 rounded-full transition-colors",
                          scrolled ? "bg-white/20" : "bg-brand-secondary/70",
                        )}
                      />
                    ) : null}
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <Link
                  href={DASHBOARD_HOME}
                  className={cn(
                    "relative px-4 py-2 text-sm font-bold transition-colors",
                    scrolled ? "text-brand-secondary hover:text-white" : "text-muted-foreground hover:text-brand",
                    pathname.startsWith("/dashboard") && (scrolled ? "text-white" : "text-brand"),
                  )}
                >
                  Dashboard
                </Link>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="hidden sm:block">
              <NavbarSearch mode="marketing" />
            </div>
            <ThemeToggle onBrand={scrolled} className="hidden sm:inline-flex" />

            {isAuthenticated ? (
              <div className="hidden items-center gap-1 md:flex">
                <NotificationBell
                  notifications={notifications}
                  unread={unread}
                  onBrand={scrolled}
                />
                <AuthSection onBrand={scrolled} />
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <AuthSection scrolled={scrolled} onBrand={scrolled} />
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="icon"
              className={cn(
                "size-11 rounded-full lg:hidden",
                scrolled
                  ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
                  : "border-brand-secondary/50 bg-background/80",
              )}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out lg:hidden",
            menuOpen ? "max-h-[85dvh] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div
            className={cn(
              "border-t px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2",
              scrolled
                ? "border-white/15 bg-brand"
                : "border-brand-secondary/40 bg-background shadow-xl",
            )}
          >
            <div className="flex flex-col gap-1">
              {PUBLIC_NAV.map((link) => {
                const Icon = "icon" in link ? link.icon : null;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-bold transition-colors",
                      scrolled
                        ? isActive
                          ? "bg-white/20 text-white"
                          : "text-brand-secondary active:bg-white/10"
                        : isActive
                          ? "bg-brand-secondary/80 text-brand"
                          : "text-foreground active:bg-muted",
                    )}
                  >
                    {Icon ? <Icon className="size-5 shrink-0" /> : null}
                    {link.label}
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <Link
                  href={DASHBOARD_HOME}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-bold",
                    scrolled ? "text-brand-secondary" : "text-foreground",
                  )}
                >
                  <LayoutDashboard className="size-5" />
                  Dashboard
                </Link>
              ) : null}
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
              <div className="flex justify-center sm:hidden">
                <ThemeToggle onBrand={scrolled} />
              </div>
              {isAuthenticated ? (
                <div className="flex items-center justify-between gap-2">
                  <NotificationBell
                    notifications={notifications}
                    unread={unread}
                    onBrand={scrolled}
                  />
                  <div className="flex-1">
                    <AuthSection onBrand={scrolled} />
                  </div>
                </div>
              ) : (
                <AuthSection stacked scrolled={scrolled} onBrand={scrolled} />
              )}
            </div>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "shrink-0 transition-[height] duration-500 ease-out",
          scrolled ? "h-14" : "h-20",
        )}
        aria-hidden
      />
    </>
  );
}

function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrolled } = useNavbarScroll();
  const { workspace } = useAuth();
  const { data: dashboard } = useDashboard();

  const unread =
    dashboard?.unreadCount ?? workspace?.unreadNotificationCount ?? 0;
  const notifications = dashboard?.notifications ?? [];
  const breadcrumbs = getBreadcrumbs(pathname);
  const pageTitle = getPageTitle(pathname);

  return (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
        <MobileSidebar />

        <div className="min-w-0 flex-1 md:hidden">
          <h1 className="truncate text-base font-semibold leading-tight">{pageTitle}</h1>
        </div>

        <div className="hidden min-w-0 flex-1 flex-col justify-center md:flex">
          <nav
            className="flex items-center gap-1 text-xs text-muted-foreground"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex min-w-0 items-center gap-1">
                {i > 0 ? <ChevronRight className="size-3 shrink-0 opacity-60" /> : null}
                {i === breadcrumbs.length - 1 ? (
                  <span className="truncate font-medium text-foreground">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="truncate transition-colors hover:text-brand"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
          <h1 className="truncate text-base font-semibold">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <NavbarSearch mode="app" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                size="sm"
                className="hidden min-h-11 gap-1.5 bg-brand px-3 text-brand-foreground shadow-sm shadow-brand/20 hover:bg-brand/90 sm:inline-flex"
              >
                <Plus className="size-4" />
                <span className="hidden lg:inline">New</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Quick create</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {quickCreateLinks.map((item) => (
              <DropdownMenuItem key={item.href} onClick={() => router.push(item.href)}>
                <item.icon className="size-4" />
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <HelpMenu />
        <ThemeToggle className="hidden sm:inline-flex" />
        <NotificationBell notifications={notifications} unread={unread} />
        <ProfileMenu showName compact />
      </div>
    </>
  );
}

export function Navbar() {
  const { isApp, isPortal } = useNavbarMode();
  const { scrolled } = useNavbarScroll();

  if (isPortal) {
    return (
      <AppNavbarShell scrolled={scrolled}>
        <BrandLogo href="/" size="sm" />
        <span className="ml-2 hidden truncate text-sm text-muted-foreground sm:inline">
          Client portal
        </span>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <AuthSection />
        </div>
      </AppNavbarShell>
    );
  }

  if (isApp) {
    return (
      <AppNavbarShell scrolled={scrolled}>
        <AppNavbar />
      </AppNavbarShell>
    );
  }

  return <PublicNavbar />;
}
