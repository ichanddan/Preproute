import { TestListPage } from "~/pages/dashboard/test-list";
import type { Route } from "./+types/overview";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard · Preproute" },
    {
      name: "description",
      content: "Manage, preview, and publish your tests.",
    },
  ];
}

export default function DashboardOverviewRoute() {
  return <TestListPage />;
}
