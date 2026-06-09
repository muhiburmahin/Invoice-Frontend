import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/config/public-routes";

export default function LoginRedirectPage() {
  redirect(AUTH_ROUTES.login);
}
