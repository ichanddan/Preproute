"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  type BaseFieldProps,
  FieldShell,
} from "~/components/forms/field-shell";
import { cn } from "~/lib/utils";

type FormStepperProps<TValues extends FieldValues> = BaseFieldProps & {
  name: FieldPath<TValues>;
  control?: Control<TValues>;
  /** Increment/decrement applied by the chevron buttons. */
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
};

/**
 * `react-hook-form`-bound numeric input with stacked increment/decrement
 * controls. Stores its value as a `number` (or `undefined` when cleared).
 */
export function FormStepper<TValues extends FieldValues>({
  name,
  control,
  label,
  description,
  fieldClassName,
  step = 1,
  min,
  max,
  disabled,
  className,
}: FormStepperProps<TValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const current = Number.isFinite(Number(field.value))
          ? Number(field.value)
          : 0;

        const clamp = (next: number) => {
          if (min !== undefined && next < min) return min;
          if (max !== undefined && next > max) return max;
          return next;
        };

        return (
          <FieldShell
            htmlFor={name}
            label={label}
            description={description}
            fieldClassName={fieldClassName}
            error={fieldState.error}
          >
            <div
              data-invalid={fieldState.invalid || undefined}
              className={cn(
                "flex h-11 items-stretch overflow-hidden rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-disabled:opacity-50 data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20",
                className,
              )}
            >
              <input
                id={name}
                type="number"
                inputMode="numeric"
                step={step}
                min={min}
                max={max}
                disabled={disabled}
                aria-invalid={fieldState.invalid}
                ref={field.ref}
                name={field.name}
                value={field.value ?? ""}
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange(
                    event.target.value === ""
                      ? undefined
                      : event.target.valueAsNumber,
                  )
                }
                className="w-full min-w-0 bg-transparent px-3 text-sm outline-none disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <div className="flex flex-col border-l border-input">
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Increase"
                  disabled={disabled}
                  onClick={() => field.onChange(clamp(current + step))}
                  className="flex flex-1 items-center justify-center px-2 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed"
                >
                  <ChevronUpIcon className="size-3.5" />
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Decrease"
                  disabled={disabled}
                  onClick={() => field.onChange(clamp(current - step))}
                  className="flex flex-1 items-center justify-center border-t border-input px-2 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed"
                >
                  <ChevronDownIcon className="size-3.5" />
                </button>
              </div>
            </div>
          </FieldShell>
        );
      }}
    />
  );
}
