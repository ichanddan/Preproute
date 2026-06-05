"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  type BaseFieldProps,
  FieldShell,
} from "~/components/forms/field-shell";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { cn } from "~/lib/utils";

export type RadioOption = {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
};

type FormRadioGroupProps<TValues extends FieldValues> = BaseFieldProps & {
  name: FieldPath<TValues>;
  control?: Control<TValues>;
  options: RadioOption[];
  /** Lay the options out in a row or a column. */
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  className?: string;
};

/** `react-hook-form`-bound single-choice radio group built on the shadcn `RadioGroup`. */
export function FormRadioGroup<TValues extends FieldValues>({
  name,
  control,
  label,
  description,
  fieldClassName,
  options,
  orientation = "vertical",
  disabled,
  className,
}: FormRadioGroupProps<TValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell
          htmlFor={name}
          label={label}
          description={description}
          fieldClassName={fieldClassName}
          error={fieldState.error}
        >
          <RadioGroup
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            className={cn(
              orientation === "horizontal"
                ? "flex flex-wrap items-center gap-x-8 gap-y-3"
                : "grid gap-3",
              className,
            )}
          >
            {options.map((option) => {
              const id = `${name}-${option.value}`;
              return (
                <label
                  key={option.value}
                  htmlFor={id}
                  className="flex items-center gap-2 text-sm font-medium has-disabled:cursor-not-allowed has-disabled:opacity-50"
                >
                  <RadioGroupItem
                    id={id}
                    value={option.value}
                    disabled={option.disabled}
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </RadioGroup>
        </FieldShell>
      )}
    />
  );
}
