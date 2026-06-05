"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import {
  Form,
  FormInput,
  FormRadioGroup,
  FormSelect,
  FormStepper,
  type RadioOption,
  type SelectOption,
} from "~/components/forms";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { API } from "~/services";
import type { CreateTestPayload } from "~/types";

import {
  testCreationSchema,
  type TestCreationValues,
} from "./zod/test-creation-schema";

const DIFFICULTY_OPTIONS: RadioOption[] = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Difficult", value: "hard" },
];

const TABS = [
  { label: "Chapter Wise", value: "chapter-wise" },
  { label: "PYQ", value: "pyq" },
  { label: "Mock Test", value: "mock-test" },
] as const;

const TYPE_MAP: Record<TestCreationValues["testType"], string> = {
  "chapter-wise": "chapterwise",
  pyq: "pyq",
  "mock-test": "mock",
};

export function TestCreationForm() {
  const navigate = useNavigate();
  const form = useForm<TestCreationValues>({
    // `z.coerce` makes the schema's input type (`unknown`) differ from its
    // output (`number`), so align the resolver to the resolved value shape.
    resolver: zodResolver(
      testCreationSchema,
    ) as unknown as Resolver<TestCreationValues>,
    defaultValues: {
      testType: "chapter-wise",
      subject: "",
      topic: "",
      duration: undefined,
      nameOfTest: "",
      subTopic: "",
      difficulty: "easy",
      wrongAnswer: -1,
      unattempted: 0,
      correctAnswer: 5,
      noOfQuestions: undefined,
      totalMarks: undefined,
    },
  });

  const [subjectOptions, setSubjectOptions] = useState<SelectOption[]>([]);
  const [topicOptions, setTopicOptions] = useState<SelectOption[]>([]);
  const [subTopicOptions, setSubTopicOptions] = useState<SelectOption[]>([]);

  const testType = form.watch("testType");
  const subject = form.watch("subject");
  const topic = form.watch("topic");
  const correctAnswer = form.watch("correctAnswer");
  const noOfQuestions = form.watch("noOfQuestions");

  // Load subjects once.
  useEffect(() => {
    let active = true;
    API.GetSubjects().then((result) => {
      if (active && result) {
        setSubjectOptions(
          result.data.map((s) => ({ label: s.name, value: s.id })),
        );
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Load topics when the subject changes; reset downstream selections.
  useEffect(() => {
    setTopicOptions([]);
    setSubTopicOptions([]);
    form.setValue("topic", "");
    form.setValue("subTopic", "");
    if (!subject) return;
    let active = true;
    API.GetTopics(subject).then((result) => {
      if (active && result) {
        setTopicOptions(
          result.data.map((t) => ({ label: t.name, value: t.id })),
        );
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  // Load sub-topics when the topic changes.
  useEffect(() => {
    setSubTopicOptions([]);
    form.setValue("subTopic", "");
    if (!topic) return;
    let active = true;
    API.GetSubTopics(topic).then((result) => {
      if (active && result) {
        setSubTopicOptions(
          result.data.map((s) => ({ label: s.name, value: s.id })),
        );
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  // Total marks is derived: correct-answer weight × number of questions.
  useEffect(() => {
    const correct = Number(correctAnswer);
    const questions = Number(noOfQuestions);
    if (
      Number.isFinite(correct) &&
      Number.isFinite(questions) &&
      questions > 0
    ) {
      form.setValue("totalMarks", correct * questions);
    } else {
      form.setValue("totalMarks", undefined);
    }
  }, [correctAnswer, noOfQuestions, form]);

  async function onSubmit(values: TestCreationValues) {
    const payload: CreateTestPayload = {
      name: values.nameOfTest,
      type: TYPE_MAP[values.testType],
      subject: values.subject,
      topics: [values.topic],
      sub_topics: values.subTopic ? [values.subTopic] : [],
      correct_marks: Number(values.correctAnswer),
      wrong_marks: Number(values.wrongAnswer),
      unattempt_marks: Number(values.unattempted),
      difficulty: values.difficulty,
      total_time: Number(values.duration),
      total_marks: Number(values.totalMarks ?? 0),
      total_questions: Number(values.noOfQuestions),
      status: "draft",
    };

    const result = await API.CreateTest(
      payload,
      "Test saved as draft",
      "Creating test...",
    );
    if (!result) return;
    navigate(`/dashboard/test-creation/questions?testId=${result.data.id}`);
  }

  const { isSubmitting } = form.formState;

  return (
    <Form form={form} onSubmit={onSubmit} className="gap-8">
      <Tabs
        value={testType}
        onValueChange={(value) =>
          form.setValue("testType", value as TestCreationValues["testType"])
        }
      >
        <TabsList className="w-fit gap-1 rounded-xl border border-primary/15 bg-primary/[0.07] p-1 group-data-horizontal/tabs:h-auto">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-lg px-5 py-1.5 text-sm font-medium text-muted-foreground transition-colors data-active:bg-background data-active:font-semibold data-active:text-primary data-active:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
        <FormSelect<TestCreationValues>
          name="subject"
          label="Subject"
          placeholder="Choose from Drop-down"
          options={subjectOptions}
        />
        <FormInput<TestCreationValues>
          name="nameOfTest"
          label="Name of Test"
          placeholder="Enter name of Test"
        />
        <FormSelect<TestCreationValues>
          name="topic"
          label="Topic"
          placeholder={
            subject ? "Choose from Drop-down" : "Select a subject first"
          }
          options={topicOptions}
          disabled={!subject}
        />
        <FormSelect<TestCreationValues>
          name="subTopic"
          label="Sub Topic"
          placeholder={topic ? "Choose from Drop-down" : "Select a topic first"}
          options={subTopicOptions}
          disabled={!topic}
        />
        <FormInput<TestCreationValues>
          name="duration"
          type="number"
          label="Duration (Minutes)"
          placeholder="Enter the time"
        />
        <FormRadioGroup<TestCreationValues>
          name="difficulty"
          label="Test Difficulty Level"
          orientation="horizontal"
          options={DIFFICULTY_OPTIONS}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-foreground">Marking Scheme:</h2>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <FormStepper<TestCreationValues>
            name="wrongAnswer"
            label="Wrong Answer"
          />
          <FormStepper<TestCreationValues>
            name="unattempted"
            label="Unattempted"
          />
          <FormStepper<TestCreationValues>
            name="correctAnswer"
            label="Correct Answer"
          />
          <FormInput<TestCreationValues>
            name="noOfQuestions"
            type="number"
            label="No of Questions"
            placeholder="Ex:250 Marks"
          />
          <FormInput<TestCreationValues>
            name="totalMarks"
            type="number"
            label="Total Marks"
            placeholder="Ex:250 Marks"
            disabled
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="min-w-32 text-primary"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" className="min-w-32" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Next"}
        </Button>
      </div>
    </Form>
  );
}
