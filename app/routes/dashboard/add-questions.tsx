import { AddQuestionsPage } from "~/pages/dashboard/add-questions";
import type { Route } from "./+types/add-questions";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Add Questions · Preproute" },
    {
      name: "description",
      content: "Add multiple-choice questions to your test.",
    },
  ];
}

export default function AddQuestions() {
  return <AddQuestionsPage />;
}
