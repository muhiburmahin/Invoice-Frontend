import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/config/public-routes";

export default function ForgotPasswordRedirectPage() {
  redirect(AUTH_ROUTES.forgotPassword);
}
