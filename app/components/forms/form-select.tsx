"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  type BaseFieldProps,
  FieldShell,
} from "~/components/forms/field-shell";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export type SelectOption = {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
};

type FormSelectProps<TValues extends FieldValues> = BaseFieldProps & {
  name: FieldPath<TValues>;
  control?: Control<TValues>;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  /** Extra classes for the trigger. */
  className?: string;
};

/** `react-hook-form`-bound single-select built on the shadcn `Select`. */
export function FormSelect<TValues extends FieldValues>({
  name,
  control,
  label,
  description,
  fieldClassName,
  options,
  placeholder = "Select an option",
  disabled,
  className,
}: FormSelectProps<TValues>) {
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
          <Select
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              ref={field.ref}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid}
              className={className ?? "w-full"}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>
      )}
    />
  );
}
