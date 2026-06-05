import {
  BookOpenIcon,
  ClockIcon,
  ListChecksIcon,
  PencilIcon,
  TrophyIcon,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

export type TestSummary = {
  type: string;
  title: string;
  difficulty: string;
  subject: string;
  topics: string[];
  subTopics: string[];
  duration: number;
  questions: number;
  marks: number;
};

export const MOCK_TEST_SUMMARY: TestSummary = {
  type: "Chapter Wise",
  title: "Chapter 1",
  difficulty: "Easy",
  subject: "English",
  topics: ["Grammar", "Writing"],
  subTopics: ["Application"],
  duration: 60,
  questions: 50,
  marks: 250,
};

function Stat({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      {icon}
      {children}
    </span>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge
          key={item}
          variant="outline"
          className="rounded-md border-orange-300 bg-orange-50 px-2.5 py-0.5 font-medium text-orange-500"
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}

export function TestSummaryCard({
  test = MOCK_TEST_SUMMARY,
  onEdit,
  className,
}: {
  test?: TestSummary;
  onEdit?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-card p-5 shadow-sm",
        className,
      )}
    >
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit test details"
        className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-primary"
      >
        <PencilIcon className="size-4" />
      </button>

      <span className="inline-flex rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
        {test.type}
      </span>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <BookOpenIcon className="size-5 text-primary" />
          <span className="text-base font-semibold text-foreground">
            {test.title}
          </span>
          <Badge className="gap-1 rounded-full border-transparent bg-emerald-100 px-2.5 py-0.5 font-medium text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {test.difficulty}
          </Badge>
        </div>

        <div className="flex items-center gap-4 divide-x divide-border">
          <Stat icon={<ClockIcon className="size-4" />}>
            {test.duration} Min
          </Stat>
          <Stat icon={<ListChecksIcon className="ml-4 size-4" />}>
            {test.questions} Q's
          </Stat>
          <Stat icon={<TrophyIcon className="ml-4 size-4" />}>
            {test.marks} Marks
          </Stat>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm">
        <div className="flex items-center gap-3">
          <dt className="w-20 shrink-0 text-muted-foreground">Subject</dt>
          <span className="text-muted-foreground">:</span>
          <dd className="font-medium text-foreground">{test.subject}</dd>
        </div>
        <div className="flex items-center gap-3">
          <dt className="w-20 shrink-0 text-muted-foreground">Topic</dt>
          <span className="text-muted-foreground">:</span>
          <dd>
            <TagList items={test.topics} />
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <dt className="w-20 shrink-0 text-muted-foreground">Sub Topic</dt>
          <span className="text-muted-foreground">:</span>
          <dd>
            <TagList items={test.subTopics} />
          </dd>
        </div>
      </dl>
    </div>
  );
}
