import { CheckCircle2Icon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "~/lib/utils";

export type QuestionListItem = {
  id: string;
  label: string;
  status: "done" | "pending";
};

export function QuestionSidebar({
  total,
  items,
  activeId,
  onSelect,
}: {
  total: number;
  items: QuestionListItem[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="flex w-60 shrink-0 flex-col gap-4 border-r pr-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Question creation
        </h2>
        <ChevronRightIcon className="size-4 text-muted-foreground" />
      </div>

      <p className="text-xs text-muted-foreground">
        Total Questions : <span className="font-semibold">{total}</span>
      </p>

      <div className="flex flex-col gap-2 overflow-y-auto">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const isDone = item.status === "done";
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                isActive
                  ? "border-primary bg-primary/5 font-medium text-primary"
                  : "border-transparent bg-muted/40 text-muted-foreground hover:bg-muted",
              )}
            >
              <span className="flex items-center gap-2">
                {isDone ? (
                  <CheckCircle2Icon className="size-4 text-emerald-500" />
                ) : (
                  <CircleIcon className="size-4 text-muted-foreground/50" />
                )}
                {item.label}
              </span>
              <ChevronRightIcon className="size-4 opacity-60" />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
