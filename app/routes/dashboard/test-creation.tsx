import { TestCreationPage } from "~/pages/dashboard/test-creation";
import type { Route } from "./+types/test-creation";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Test · Preproute" },
    {
      name: "description",
      content: "Create a new chapter-wise, PYQ, or mock test.",
    },
  ];
}

export default function TestCreation() {
  return <TestCreationPage />;
}
