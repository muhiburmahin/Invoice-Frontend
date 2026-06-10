"use client";

import Link from "next/link";
import { Info, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PasswordInput } from "@/components/modules/auth/PasswordInput";
import { PasswordStrengthIndicator } from "@/components/modules/auth/PasswordStrengthIndicator";
import { SocialLoginButtons } from "@/components/modules/auth/SocialLoginButtons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { registerSchema, type RegisterInput } from "@/lib/validations";

type RegisterFormProps = {
  passwordHints?: { id: string; label: string }[];
  oauth?: { google: boolean; github: boolean };
};

export function RegisterForm({ passwordHints, oauth }: RegisterFormProps) {
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onBlur",
  });

  const passwordValue = form.watch("password");

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await registerUser(values);
      toast.success("Account created! Check your email to verify.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  const showOAuth = oauth?.google || oauth?.github;

  return (
    <div className="space-y-5">
      <div className="flex gap-2 rounded-lg border border-brand-secondary/50 bg-brand-secondary/15 px-3 py-2.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-brand" />
        <p>
          <strong className="font-medium text-foreground">Business registration only.</strong>{" "}
          Support and Super Admin accounts are created by a platform administrator — they cannot
          sign up here.{" "}
          <Link href="/auth/login" className="font-medium text-brand hover:underline">
            Staff? Sign in instead
          </Link>
        </p>
      </div>

      {showOAuth ? (
        <>
          <SocialLoginButtons
            google={oauth?.google}
            github={oauth?.github}
            showDivider={false}
          />
          <p className="text-center text-xs text-muted-foreground">or register with email</p>
        </>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              autoComplete="name"
              placeholder="Jane Smith"
              className="border-brand-secondary/60 pl-9 focus-visible:ring-brand"
              aria-invalid={form.formState.errors.name ? true : undefined}
              {...form.register("name")}
            />
          </div>
          {form.formState.errors.name ? (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
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
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
          <PasswordStrengthIndicator password={passwordValue} hints={passwordHints} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            error={form.formState.errors.confirmPassword?.message}
            {...form.register("confirmPassword")}
          />
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="acceptTerms"
            checked={form.watch("acceptTerms")}
            onCheckedChange={(checked) => form.setValue("acceptTerms", checked === true)}
          />
          <Label htmlFor="acceptTerms" className="text-sm font-normal leading-snug">
            I agree to the{" "}
            <Link href="/terms" className="font-medium text-brand hover:underline" target="_blank">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-brand hover:underline" target="_blank">
              Privacy Policy
            </Link>
          </Label>
        </div>
        {form.formState.errors.acceptTerms ? (
          <p className="text-sm text-destructive">{form.formState.errors.acceptTerms.message}</p>
        ) : null}

        <Button
          type="submit"
          className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account…" : "Create business account"}
        </Button>
      </form>
    </div>
  );
}
