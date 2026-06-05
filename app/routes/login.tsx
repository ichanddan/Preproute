import { redirect } from "react-router";

import { LoginPage } from "~/pages/auth/login";
import { getToken } from "~/services";
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

export function clientLoader() {
  if (getToken()) {
    throw redirect("/dashboard");
  }
  return null;
}

export default function Login() {
  return <LoginPage />;
}
