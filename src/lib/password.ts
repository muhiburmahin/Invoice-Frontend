export type PasswordRequirement = {
  id: string;
  label: string;
  met: boolean;
};

const PASSWORD_MAX_LENGTH = 128;

/** IDs align with backend `passwordRequirements` for signup hints. */
export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    {
      id: "min",
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      id: "max",
      label: `No more than ${PASSWORD_MAX_LENGTH} characters`,
      met: password.length <= PASSWORD_MAX_LENGTH,
    },
    {
      id: "lower",
      label: "At least one lowercase letter (a-z)",
      met: /[a-z]/.test(password),
    },
    {
      id: "upper",
      label: "At least one uppercase letter (A-Z)",
      met: /[A-Z]/.test(password),
    },
    {
      id: "number",
      label: "At least one number (0-9)",
      met: /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "At least one special character (e.g. !@#$%^&*)",
      met: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(password),
    },
    {
      id: "no-space",
      label: "No spaces",
      met: password.length === 0 || !/\s/.test(password),
    },
  ];
}

export function passwordStrengthPercent(requirements: PasswordRequirement[]): number {
  if (requirements.length === 0) return 0;
  const met = requirements.filter((r) => r.met).length;
  return Math.round((met / requirements.length) * 100);
}

export function passwordStrengthLabel(percent: number): string {
  if (percent === 0) return "Enter a password";
  if (percent < 50) return "Weak";
  if (percent < 85) return "Fair";
  if (percent < 100) return "Good";
  return "Strong";
}
