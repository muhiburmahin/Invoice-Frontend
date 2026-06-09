import type { AuthUser } from "@/types";

export type UserSession = {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  isCurrent: boolean;
};

export type UpdateProfileResponse = {
  user: AuthUser;
  role: AuthUser["role"];
  isVerified: boolean;
  isActive: boolean;
};
