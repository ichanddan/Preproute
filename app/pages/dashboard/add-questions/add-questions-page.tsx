"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { API } from "~/services";
import type { QuestionPayload, Test } from "~/types";

import { testToSummary } from "../_shared/test-summary";
import { TestSummaryCard } from "../_shared/test-summary-card";
import { QuestionEditor } from "./question-editor";
import {
  QuestionSidebar,
  type QuestionListItem,
} from "./question-sidebar";
import type { QuestionValues } from "./zod/question-schema";

function buildPayload(values: QuestionValues, test: Test): QuestionPayload {
  return {
    type: "mcq",
    question: values.question,
    option1: values.option1,
    option2: values.option2,
    option3: values.option3,
    option4: values.option4,
    correct_option: values.correctOption,
    explanation: values.explanation || undefined,
    difficulty: values.difficulty || test.difficulty,
    subject: test.subject,
    topic: values.topic || test.topics[0],
    sub_topic: values.subTopic || test.sub_topics[0],
    test_id: test.id,
  };
}

export function AddQuestionsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<QuestionValues[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [publishing, setPublishing] = useState(false);

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

  const total = test?.total_questions ?? 0;

  const items = useMemo<QuestionListItem[]>(
    () =>
      Array.from({ length: total }, (_, index) => ({
        id: `q-${index + 1}`,
        label: `Question ${index + 1}`,
        status: index < saved.length ? "done" : "pending",
      })),
    [total, saved.length],
  );

  const topicOptions = useMemo(
    () => (test?.topics ?? []).map((t) => ({ label: t, value: t })),
    [test],
  );
  const subTopicOptions = useMemo(
    () => (test?.sub_topics ?? []).map((s) => ({ label: s, value: s })),
    [test],
  );

  function handleSubmitQuestion(values: QuestionValues) {
    setSaved((prev) => {
      const next = [...prev];
      next[activeIndex] = values;
      return next;
    });
    toast.success(`Question ${activeIndex + 1} saved`);
    if (total === 0 || activeIndex < total - 1) {
      setActiveIndex((index) => index + 1);
    }
  }

  async function handlePublish() {
    if (!test) return;
    if (saved.length === 0) {
      toast.error("Add at least one question before publishing");
      return;
    }
    setPublishing(true);
    const payloads = saved.filter(Boolean).map((v) => buildPayload(v, test));
    const created = await API.BulkCreate(
      payloads,
      undefined,
      "Saving questions...",
    );
    if (!created) {
      setPublishing(false);
      return;
    }
    const ids = created.data.map((q) => q.id);
    await API.UpdateTest(test.id, {
      questions: ids,
      total_questions: ids.length,
      total_marks: ids.length * test.correct_marks,
    });
    toast.success(`${ids.length} question(s) saved to test`);
    navigate(`/dashboard/test-creation/publish?testId=${test.id}`);
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
          No test selected. Create a test first to add questions.
        </p>
        <Button type="button" onClick={() => navigate("/dashboard/test-creation")}>
          Create a Test
        </Button>
      </div>
    );
  }

  const activeItem = items[activeIndex];
  const activeLabel = activeItem?.label ?? `Question ${activeIndex + 1}`;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Test Creation</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/test-creation">
                Create Test
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{test.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          type="button"
          className="min-w-28"
          disabled={publishing}
          onClick={handlePublish}
        >
          {publishing ? <Spinner /> : "Publish"}
        </Button>
      </div>

      <div className="flex flex-1 gap-6">
        <QuestionSidebar
          total={total}
          items={items}
          activeId={activeItem?.id ?? ""}
          onSelect={(id) => {
            const index = items.findIndex((item) => item.id === id);
            if (index !== -1) setActiveIndex(index);
          }}
        />

        <div className="flex max-w-3xl flex-1 flex-col gap-6">
          <TestSummaryCard test={testToSummary(test)} />
          <QuestionEditor
            key={activeIndex}
            questionLabel={activeLabel}
            canPrev={activeIndex > 0}
            canNext={activeIndex < Math.max(total - 1, saved.length)}
            onPrev={() => setActiveIndex((index) => Math.max(index - 1, 0))}
            onNext={() => setActiveIndex((index) => index + 1)}
            onExit={() => navigate("/dashboard")}
            onSubmitQuestion={handleSubmitQuestion}
            topicOptions={topicOptions}
            subTopicOptions={subTopicOptions}
            initialValues={saved[activeIndex]}
          />
          <p className="text-xs text-muted-foreground">
            {saved.filter(Boolean).length} of {total} questions completed
          </p>
        </div>
      </div>
    </div>
  );
}
