"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BoldIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  PlusIcon,
  SigmaIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  Trash2Icon,
  UnderlineIcon,
  UploadIcon,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import {
  Form,
  FormSelect,
  FormTextarea,
  type SelectOption,
} from "~/components/forms";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

import { questionSchema, type QuestionValues } from "./zod/question-schema";

const DIFFICULTY_OPTIONS: SelectOption[] = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Difficult", value: "hard" },
];

const TOOLBAR_ICONS = [
  ItalicIcon,
  BoldIcon,
  UnderlineIcon,
  StrikethroughIcon,
  SuperscriptIcon,
  SubscriptIcon,
  ListIcon,
  ListOrderedIcon,
  ImageIcon,
  LinkIcon,
  SigmaIcon,
];

const OPTION_FIELDS = ["option1", "option2", "option3", "option4"] as const;

function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 bg-muted/40 px-2 py-1.5">
      {TOOLBAR_ICONS.map((Icon, index) => (
        <button
          key={index}
          type="button"
          tabIndex={-1}
          className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}

export function QuestionEditor({
  questionLabel,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onExit,
  onSubmitQuestion,
  topicOptions = [],
  subTopicOptions = [],
  initialValues,
}: {
  questionLabel: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
  onSubmitQuestion: (values: QuestionValues) => void;
  topicOptions?: SelectOption[];
  subTopicOptions?: SelectOption[];
  initialValues?: Partial<QuestionValues>;
}) {
  const form = useForm<QuestionValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctOption: "option1",
      explanation: "",
      difficulty: "",
      topic: "",
      subTopic: "",
      ...initialValues,
    },
  });

  return (
    <Form form={form} onSubmit={onSubmitQuestion} className="gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex rounded-md border border-primary/30 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
          {questionLabel}
        </span>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" className="gap-1.5">
            <PlusIcon className="size-4" />
            MCQ
          </Button>
          <Button type="button" variant="outline" size="sm" className="gap-1.5">
            <UploadIcon className="size-4" />
            CSV
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => form.reset()}
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-destructive hover:underline"
      >
        <Trash2Icon className="size-4" />
        Delete All Lists
      </button>

      <Controller
        control={form.control}
        name="question"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Toolbar />
            <textarea
              {...field}
              id="question"
              placeholder="Type here"
              aria-invalid={fieldState.invalid}
              className="min-h-32 w-full rounded-b-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive"
            />
            {fieldState.error ? (
              <p className="text-xs text-destructive">
                {fieldState.error.message}
              </p>
            ) : null}
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="correctOption"
        render={({ field: correctField }) => (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-foreground">
              Type the options below
            </h3>
            <RadioGroup
              value={correctField.value}
              onValueChange={correctField.onChange}
              className="grid gap-3"
            >
              {OPTION_FIELDS.map((optionName, index) => (
                <Controller
                  key={optionName}
                  control={form.control}
                  name={optionName}
                  render={({ field, fieldState }) => (
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value={optionName}
                        aria-label={`Mark option ${index + 1} correct`}
                      />
                      <Input
                        {...field}
                        placeholder="Type Option here"
                        aria-invalid={fieldState.invalid}
                        className="h-11 flex-1 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => field.onChange("")}
                        aria-label={`Clear option ${index + 1}`}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  )}
                />
              ))}
            </RadioGroup>
          </div>
        )}
      />

      <FormTextarea<QuestionValues>
        name="explanation"
        label="Add Solution"
        placeholder="Type here"
        className="min-h-28"
      />

      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Previous question"
          className="flex size-8 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          aria-label="Next question"
          className="flex size-8 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground">
          Question settings
        </h3>
        <div className="grid gap-5">
          <FormSelect<QuestionValues>
            name="difficulty"
            label="Level of Difficulty"
            placeholder="Select from Drop-down"
            options={DIFFICULTY_OPTIONS}
          />
          <FormSelect<QuestionValues>
            name="topic"
            label="Topic"
            placeholder="Select from Drop-down"
            options={topicOptions}
          />
          <FormSelect<QuestionValues>
            name="subTopic"
            label="Sub-topic"
            placeholder="Select from Drop-down"
            options={subTopicOptions}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onExit}
          className="border-destructive/40 bg-destructive/5 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Exit Test Creation
        </Button>
        <Button type="submit" size="lg" className="min-w-32">
          Next
        </Button>
      </div>
    </Form>
  );
}
