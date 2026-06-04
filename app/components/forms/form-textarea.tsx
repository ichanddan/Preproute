"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  type BaseFieldProps,
  FieldShell,
} from "~/components/forms/field-shell";
import { Textarea } from "~/components/ui/textarea";

type FormTextareaProps<TValues extends FieldValues> = BaseFieldProps &
  Omit<React.ComponentProps<typeof Textarea>, "name" | "defaultValue"> & {
    name: FieldPath<TValues>;
    control?: Control<TValues>;
  };

/** `react-hook-form`-bound multi-line text input. */
export function FormTextarea<TValues extends FieldValues>({
  name,
  control,
  label,
  description,
  fieldClassName,
  ...textareaProps
}: FormTextareaProps<TValues>) {
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
          <Textarea
            id={name}
            aria-invalid={fieldState.invalid}
            {...textareaProps}
            {...field}
            value={field.value ?? ""}
          />
        </FieldShell>
      )}
    />
  );
}
