"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { registerSchema, type RegisterInput } from "@/lib/validations";

type RegisterFormProps = {
  passwordHints?: { id: string; label: string }[];
};

export function RegisterForm({ passwordHints }: RegisterFormProps) {
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
  });

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

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" autoComplete="name" {...form.register("name")} />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...form.register("password")}
        />
        {passwordHints?.length ? (
          <ul className="list-inside list-disc text-xs text-muted-foreground">
            {passwordHints.map((hint) => (
              <li key={hint.id}>{hint.label}</li>
            ))}
          </ul>
        ) : null}
        {form.formState.errors.password ? (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="acceptTerms"
          checked={form.watch("acceptTerms")}
          onCheckedChange={(checked) => form.setValue("acceptTerms", checked === true)}
        />
        <Label htmlFor="acceptTerms" className="text-sm font-normal leading-snug">
          I agree to the terms of service and privacy policy
        </Label>
      </div>
      {form.formState.errors.acceptTerms ? (
        <p className="text-sm text-destructive">{form.formState.errors.acceptTerms.message}</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
