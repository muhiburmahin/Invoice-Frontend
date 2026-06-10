"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  AuthAccountTypeTabs,
  type AuthAccountKind,
} from "@/components/modules/auth/AuthAccountTypeTabs";
import { DemoLoginPanel } from "@/components/modules/auth/DemoLoginPanel";
import { PasswordInput } from "@/components/modules/auth/PasswordInput";
import { isDemoLoginEnabled } from "@/config/demo-accounts";
import { SocialLoginButtons } from "@/components/modules/auth/SocialLoginButtons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { loginSchema, type LoginInput } from "@/lib/validations";

type LoginFormProps = {
  oauth?: { google: boolean; github: boolean };
};

export function LoginForm({ oauth }: LoginFormProps) {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountKind, setAccountKind] = useState<AuthAccountKind>("business");

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await login(values);
      toast.success(
        accountKind === "staff" ? "Welcome back, team member!" : "Welcome back!",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  const showOAuth = oauth?.google || oauth?.github;
  const showDemoLogin = isDemoLoginEnabled();

  const prefillCredentials = (email: string, password: string) => {
    form.setValue("email", email);
    form.setValue("password", password);
  };

  return (
    <div className="space-y-5">
      {showDemoLogin ? (
        <DemoLoginPanel
          accountKind={accountKind}
          onAccountKindChange={setAccountKind}
          onPrefill={prefillCredentials}
        />
      ) : null}

      <AuthAccountTypeTabs value={accountKind} onChange={setAccountKind} />

      {showOAuth ? (
        <>
          <SocialLoginButtons
            google={oauth?.google}
            github={oauth?.github}
            showDivider={false}
          />
          <p className="text-center text-xs text-muted-foreground">or sign in with email</p>
        </>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={
                accountKind === "staff"
                  ? "admin-assigned@company.com"
                  : "you@company.com"
              }
              className="border-brand-secondary/60 pl-9 focus-visible:ring-brand"
              aria-invalid={form.formState.errors.email ? true : undefined}
              {...form.register("email")}
            />
          </div>
          {form.formState.errors.email ? (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-brand hover:text-brand/80"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            checked={form.watch("rememberMe") ?? false}
            onCheckedChange={(checked) => form.setValue("rememberMe", checked === true)}
          />
          <Label htmlFor="rememberMe" className="text-sm font-normal">
            Keep me signed in on this device
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
