"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  type BaseFieldProps,
  FieldShell,
} from "~/components/forms/field-shell";
import { Input } from "~/components/ui/input";

type FormInputProps<TValues extends FieldValues> = BaseFieldProps &
  Omit<React.ComponentProps<typeof Input>, "name" | "defaultValue"> & {
    /** Field key — type-checked against the form's value shape. */
    name: FieldPath<TValues>;
    /** Optional explicit control; falls back to `<Form>` context. */
    control?: Control<TValues>;
  };

/** `react-hook-form`-bound text input. Pass `type` for email/password/number/etc. */
export function FormInput<TValues extends FieldValues>({
  name,
  control,
  label,
  description,
  fieldClassName,
  ...inputProps
}: FormInputProps<TValues>) {
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
          <Input
            id={name}
            aria-invalid={fieldState.invalid}
            {...inputProps}
            {...field}
            value={field.value ?? ""}
          />
        </FieldShell>
      )}
    />
  );
}
