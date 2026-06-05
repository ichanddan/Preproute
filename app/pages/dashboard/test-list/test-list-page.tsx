"use client";

import { format } from "date-fns";
import {
  EyeIcon,
  ListPlusIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { API, toCapitalized } from "~/services";
import type { Test, TestStatus } from "~/types";
import { cn } from "~/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  live: "border-transparent bg-emerald-100 text-emerald-700",
  draft: "border-transparent bg-muted text-muted-foreground",
  scheduled: "border-transparent bg-amber-100 text-amber-700",
  expired: "border-transparent bg-red-100 text-red-700",
  unpublished: "border-transparent bg-slate-100 text-slate-600",
};

function StatusBadge({ status }: { status: TestStatus | null }) {
  const key = status ?? "draft";
  return (
    <Badge className={cn("rounded-full capitalize", STATUS_STYLES[key])}>
      {key}
    </Badge>
  );
}

export function TestListPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Test | null>(null);

  useEffect(() => {
    let active = true;
    API.GetTests().then((result) => {
      if (!active) return;
      if (result) setTests(result.data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tests;
    return tests.filter(
      (test) =>
        test.name.toLowerCase().includes(q) ||
        test.subject.toLowerCase().includes(q),
    );
  }, [tests, query]);

  async function handleDelete() {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    const result = await API.DeleteTest(
      target.id,
      "Test deleted",
      "Deleting...",
    );
    if (result !== null) {
      setTests((prev) => prev.filter((t) => t.id !== target.id));
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Tests</h1>
          <p className="text-sm text-muted-foreground">
            Manage, preview, and publish your tests.
          </p>
        </div>
        <Button
          type="button"
          className="gap-1.5"
          onClick={() => navigate("/dashboard/test-creation")}
        >
          <PlusIcon className="size-4" />
          Create New Test
        </Button>
      </div>

      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or subject"
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Questions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <Spinner className="mx-auto size-5 text-primary" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  {tests.length === 0
                    ? "No tests yet. Create your first test."
                    : "No tests match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {test.subject}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {toCapitalized(test.type)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={test.status} />
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {test.questions?.length ?? 0}/{test.total_questions}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {test.created_at
                      ? format(new Date(test.created_at), "dd MMM yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Preview test"
                        onClick={() =>
                          navigate(
                            `/dashboard/test-creation/publish?testId=${test.id}`,
                          )
                        }
                      >
                        <EyeIcon className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Add questions"
                        onClick={() =>
                          navigate(
                            `/dashboard/test-creation/questions?testId=${test.id}`,
                          )
                        }
                      >
                        <ListPlusIcon className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Delete test"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setPendingDelete(test)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this test?</AlertDialogTitle>
            <AlertDialogDescription>
              "{pendingDelete?.name}" and all its questions will be permanently
              deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
