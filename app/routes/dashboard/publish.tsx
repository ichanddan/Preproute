import { PublishPage } from "~/pages/dashboard/publish";
import type { Route } from "./+types/publish";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Preview & Publish · Preproute" },
    {
      name: "description",
      content: "Preview your test and publish or schedule it to go live.",
    },
  ];
}

export default function Publish() {
  return <PublishPage />;
}
