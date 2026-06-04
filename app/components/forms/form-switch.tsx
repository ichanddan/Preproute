"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  type BaseFieldProps,
  FieldShell,
} from "~/components/forms/field-shell";
import { Switch } from "~/components/ui/switch";

type FormSwitchProps<TValues extends FieldValues> = BaseFieldProps & {
  name: FieldPath<TValues>;
  control?: Control<TValues>;
  disabled?: boolean;
  className?: string;
};

/** `react-hook-form`-bound boolean toggle, laid out beside its label. */
export function FormSwitch<TValues extends FieldValues>({
  name,
  control,
  label,
  description,
  fieldClassName,
  disabled,
  className,
}: FormSwitchProps<TValues>) {
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
          orientation="horizontal"
          labelAfter
        >
          <Switch
            id={name}
            ref={field.ref}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            className={className}
          />
        </FieldShell>
      )}
    />
  );
}
