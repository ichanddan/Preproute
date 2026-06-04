import { DashboardOverview } from "~/pages/dashboard";
import type { Route } from "./+types/overview";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard · Preproute" },
    {
      name: "description",
      content: "Your Preproute workspace overview and activity.",
    },
  ];
}

export default function DashboardOverviewRoute() {
  return <DashboardOverview />;
}
