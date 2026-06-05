import type { Test } from "~/types";

import type { TestSummary } from "./test-summary-card";

const TYPE_LABELS: Record<string, string> = {
  chapterwise: "Chapter Wise",
  pyq: "PYQ",
  mock: "Mock Test",
};

function capitalize(value: string): string {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Maps an API `Test` (subject/topics are names on read) to the card's view model. */
export function testToSummary(test: Test): TestSummary {
  return {
    type: TYPE_LABELS[test.type] ?? capitalize(test.type),
    title: test.name,
    difficulty: capitalize(test.difficulty),
    subject: test.subject,
    topics: test.topics ?? [],
    subTopics: test.sub_topics ?? [],
    duration: test.total_time,
    questions: test.total_questions,
    marks: test.total_marks,
  };
}
