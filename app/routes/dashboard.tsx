import { redirect } from "react-router";

import { DashboardLayout } from "~/pages/dashboard";
import { Spinner } from "~/components/ui/spinner";
import { getToken } from "~/services";

export function clientLoader() {
  if (!getToken()) {
    throw redirect("/");
  }
  return null;
}

export function HydrateFallback() {
  return (
    <div className="flex h-svh items-center justify-center">
      <Spinner className="size-6 text-primary" />
    </div>
  );
}

export default function Dashboard() {
  return <DashboardLayout />;
}
