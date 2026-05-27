import { create } from "zustand";

import type { AuthSessionPayload, WorkspaceMe } from "@/types";

type AuthState = {
  session: AuthSessionPayload | null;
  workspace: WorkspaceMe | null;
  isLoading: boolean;
  setSession: (session: AuthSessionPayload | null) => void;
  setWorkspace: (workspace: WorkspaceMe | null) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
  login: (input: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  workspace: null,
  isLoading: true,
  setSession: (session) => set({ session }),
  setWorkspace: (workspace) => set({ workspace }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ session: null, workspace: null, isLoading: false }),
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refresh: async () => {},
}));
