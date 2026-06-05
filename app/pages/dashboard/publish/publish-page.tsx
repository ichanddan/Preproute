"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, addWeeks, parse } from "date-fns";
import { CheckCircle2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";

import {
  Form,
  FormDatePicker,
  FormRadioGroup,
  FormSelect,
  type RadioOption,
  type SelectOption,
} from "~/components/forms";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { API } from "~/services";
import type { Test, UpdateTestPayload } from "~/types";
import { cn } from "~/lib/utils";

import { testToSummary } from "../_shared/test-summary";
import { TestSummaryCard } from "../_shared/test-summary-card";
import { publishSchema, type PublishValues } from "./zod/publish-schema";

const LIVE_UNTIL_OPTIONS: RadioOption[] = [
  { label: "Always Available", value: "always" },
  { label: "3 Weeks", value: "3-weeks" },
  { label: "1 Week", value: "1-week" },
  { label: "1 Month", value: "1-month" },
  { label: "2 Weeks", value: "2-weeks" },
  { label: "Custom Duration", value: "custom" },
];

const TIME_OPTIONS: SelectOption[] = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
  "08:00 PM",
].map((time) => ({ label: time, value: time }));

const MODES = [
  { label: "Publish Now", value: "now" },
  { label: "Schedule Publish", value: "schedule" },
] as const;

function combineDateTime(date?: string, time?: string): string | null {
  if (!date) return null;
  const parsed = parse(
    `${date} ${time ?? "12:00 AM"}`,
    "yyyy-MM-dd hh:mm a",
    new Date(),
  );
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function computeExpiry(
  base: Date,
  liveUntil: PublishValues["liveUntil"],
  endDate?: string,
  endTime?: string,
): string | null {
  switch (liveUntil) {
    case "1-week":
      return addWeeks(base, 1).toISOString();
    case "2-weeks":
      return addWeeks(base, 2).toISOString();
    case "3-weeks":
      return addWeeks(base, 3).toISOString();
    case "1-month":
      return addMonths(base, 1).toISOString();
    case "custom":
      return combineDateTime(endDate, endTime);
    default:
      return null;
  }
}

export function PublishPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<PublishValues>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      mode: "now",
      scheduleDate: "",
      scheduleTime: "",
      liveUntil: "always",
      endDate: "",
      endTime: "",
    },
  });

  useEffect(() => {
    if (!testId) {
      setLoading(false);
      return;
    }
    let active = true;
    API.GetTest(testId).then((result) => {
      if (!active) return;
      if (result) setTest(result.data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [testId]);

  const mode = form.watch("mode");
  const liveUntil = form.watch("liveUntil");
  const isCustom = liveUntil === "custom";

  async function onSubmit(values: PublishValues) {
    if (!test) return;

    const scheduledIso =
      values.mode === "schedule"
        ? combineDateTime(values.scheduleDate, values.scheduleTime)
        : null;
    const base = scheduledIso ? new Date(scheduledIso) : new Date();
    const expiry = computeExpiry(
      base,
      values.liveUntil,
      values.endDate,
      values.endTime,
    );

    const payload: UpdateTestPayload =
      values.mode === "schedule"
        ? {
            status: "scheduled",
            scheduled_date: scheduledIso,
            expiry_date: expiry,
          }
        : { status: "live", expiry_date: expiry };

    const result = await API.UpdateTest(
      test.id,
      payload,
      values.mode === "schedule"
        ? "Test scheduled for publishing"
        : "Test published successfully",
      "Publishing...",
    );
    if (!result) return;
    navigate("/dashboard");
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No test selected to publish.
        </p>
        <Button type="button" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const questionCount = test.questions?.length ?? test.total_questions;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-sm font-medium text-muted-foreground">
        Test creation
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-base font-semibold text-foreground">Test created</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <CheckCircle2Icon className="size-3.5" />
          All {questionCount} Questions done
        </span>
      </div>

      <TestSummaryCard test={testToSummary(test)} className="max-w-3xl" />

      <Form form={form} onSubmit={onSubmit} className="max-w-3xl gap-6">
        <div className="flex w-fit items-center gap-1 rounded-lg border bg-muted/40 p-1">
          {MODES.map((item) => {
            const isActive = mode === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => form.setValue("mode", item.value)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-background font-semibold text-foreground shadow-sm"
                    : "font-medium text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {mode === "schedule" ? (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">
              Select Date and Time
            </h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormDatePicker<PublishValues>
                name="scheduleDate"
                placeholder="Select Date"
              />
              <FormSelect<PublishValues>
                name="scheduleTime"
                placeholder="Select Time"
                options={TIME_OPTIONS}
              />
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold text-foreground">Live Until</h3>
          <p className="text-sm text-muted-foreground">
            Choose how long this test should remain available on the platform.
          </p>
          <FormRadioGroup<PublishValues>
            name="liveUntil"
            options={LIVE_UNTIL_OPTIONS}
            className="mt-3 gap-x-10 gap-y-4 sm:grid-cols-2"
          />
        </div>

        <div
          className={cn(
            "grid gap-5 sm:grid-cols-2",
            !isCustom && "pointer-events-none opacity-50",
          )}
        >
          <FormDatePicker<PublishValues>
            name="endDate"
            placeholder="Select End Date"
          />
          <FormSelect<PublishValues>
            name="endTime"
            placeholder="Select End Time"
            options={TIME_OPTIONS}
            disabled={!isCustom}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="min-w-28 text-primary"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            className="min-w-28"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? <Spinner /> : "Confirm"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
