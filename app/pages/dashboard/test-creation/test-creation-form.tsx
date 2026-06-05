"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { type Resolver, useForm } from "react-hook-form";

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
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

import {
  testCreationSchema,
  type TestCreationValues,
} from "./zod/test-creation-schema";

const SUBJECT_OPTIONS: SelectOption[] = [
  { label: "Physics", value: "physics" },
  { label: "Chemistry", value: "chemistry" },
  { label: "Mathematics", value: "mathematics" },
  { label: "Biology", value: "biology" },
];

const TOPIC_OPTIONS: SelectOption[] = [
  { label: "Mechanics", value: "mechanics" },
  { label: "Thermodynamics", value: "thermodynamics" },
  { label: "Optics", value: "optics" },
];

const SUB_TOPIC_OPTIONS: SelectOption[] = [
  { label: "Kinematics", value: "kinematics" },
  { label: "Work & Energy", value: "work-energy" },
  { label: "Rotational Motion", value: "rotational-motion" },
];

const DIFFICULTY_OPTIONS: RadioOption[] = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Difficult", value: "difficult" },
];

const TABS = [
  { label: "Chapter Wise", value: "chapter-wise" },
  { label: "PYQ", value: "pyq" },
  { label: "Mock Test", value: "mock-test" },
] as const;

export function TestCreationForm() {
  const form = useForm<TestCreationValues>({
    // `z.coerce` makes the schema's input type (`unknown`) differ from its
    // output (`number`), so align the resolver to the resolved value shape.
    resolver: zodResolver(testCreationSchema) as unknown as Resolver<TestCreationValues>,
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

  const testType = form.watch("testType");
  const correctAnswer = form.watch("correctAnswer");
  const noOfQuestions = form.watch("noOfQuestions");

  // Total marks is derived: correct-answer weight × number of questions.
  useEffect(() => {
    const correct = Number(correctAnswer);
    const questions = Number(noOfQuestions);
    if (Number.isFinite(correct) && Number.isFinite(questions) && questions > 0) {
      form.setValue("totalMarks", correct * questions);
    } else {
      form.setValue("totalMarks", undefined);
    }
  }, [correctAnswer, noOfQuestions, form]);

  function onSubmit(values: TestCreationValues) {
    console.log("test-creation", values);
  }

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
          options={SUBJECT_OPTIONS}
        />
        <FormInput<TestCreationValues>
          name="nameOfTest"
          label="Name of Test"
          placeholder="Enter name of Test"
        />
        <FormSelect<TestCreationValues>
          name="topic"
          label="Topic"
          placeholder="Choose from Drop-down"
          options={TOPIC_OPTIONS}
        />
        <FormSelect<TestCreationValues>
          name="subTopic"
          label="Sub Topic"
          placeholder="Choose from Drop-down"
          options={SUB_TOPIC_OPTIONS}
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
          onClick={() => form.reset()}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" className="min-w-32">
          Next
        </Button>
      </div>
    </Form>
  );
}
