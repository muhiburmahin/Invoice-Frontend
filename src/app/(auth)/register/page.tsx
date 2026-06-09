import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/config/public-routes";

export default function RegisterRedirectPage() {
  redirect(AUTH_ROUTES.register);
}
