"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  type BaseFieldProps,
  FieldShell,
} from "~/components/forms/field-shell";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

type FormDatePickerProps<TValues extends FieldValues> = BaseFieldProps & {
  name: FieldPath<TValues>;
  control?: Control<TValues>;
  placeholder?: string;
};

/**
 * `react-hook-form`-bound date picker. Stores the value as a `yyyy-MM-dd`
 * string so it serializes cleanly into FormData and the backend `new Date()`.
 */
export function FormDatePicker<TValues extends FieldValues>({
  name,
  control,
  label,
  description,
  fieldClassName,
  placeholder = "Pick a date",
}: FormDatePickerProps<TValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const date = field.value ? new Date(field.value as string) : undefined;
        return (
          <FieldShell
            htmlFor={name}
            label={label}
            description={description}
            fieldClassName={fieldClassName}
            error={fieldState.error}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  id={name}
                  variant="outline"
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="size-4" />
                  {date ? format(date, "PPP") : placeholder}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(value) =>
                    field.onChange(value ? format(value, "yyyy-MM-dd") : "")
                  }
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </FieldShell>
        );
      }}
    />
  );
}
