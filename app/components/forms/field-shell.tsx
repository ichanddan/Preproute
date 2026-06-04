"use client";

import type { FieldError as RHFFieldError } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";

/**
 * Props shared by every `Form*` field component. Components extend this with
 * the native props of the control they wrap.
 */
export type BaseFieldProps = {
  /** Label rendered above (or beside) the control. */
  label?: React.ReactNode;
  /** Helper text rendered under the control. */
  description?: React.ReactNode;
  /** Extra classes for the surrounding `Field` wrapper. */
  fieldClassName?: string;
};

type FieldShellProps = BaseFieldProps & {
  htmlFor?: string;
  error?: RHFFieldError;
  orientation?: "vertical" | "horizontal" | "responsive";
  /** Render the label after the control (used by checkbox/switch). */
  labelAfter?: boolean;
  children: React.ReactNode;
};

/**
 * Presentational layout shared by all field components: label + control +
 * description + validation error, driven by the shadcn `Field` primitives.
 */
export function FieldShell({
  label,
  description,
  fieldClassName,
  htmlFor,
  error,
  orientation = "vertical",
  labelAfter = false,
  children,
}: FieldShellProps) {
  const labelEl = label ? (
    <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
  ) : null;

  return (
    <Field
      orientation={orientation}
      data-invalid={error ? true : undefined}
      className={fieldClassName}
    >
      {!labelAfter && labelEl}
      {children}
      {labelAfter && labelEl}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError errors={error ? [error] : undefined} />
    </Field>
  );
}
