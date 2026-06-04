import { LoginPage } from "~/pages/auth/login";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login · Preproute" },
    {
      name: "description",
      content: "Sign in to Preproute with your company-provided credentials.",
    },
  ];
}

export default function Login() {
  return <LoginPage />;
}
