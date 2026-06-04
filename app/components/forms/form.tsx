"use client";

import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { FormProvider } from "react-hook-form";

import { cn } from "~/lib/utils";

type FormProps<TValues extends FieldValues> = Omit<
  React.ComponentProps<"form">,
  "onSubmit"
> & {
  /** The instance returned from `useForm()`. */
  form: UseFormReturn<TValues>;
  /** Called with validated values after `handleSubmit` passes. */
  onSubmit: SubmitHandler<TValues>;
};

/**
 * Thin wrapper that wires a `react-hook-form` instance into a native `<form>`
 * and exposes it through context so the `Form*` field components can read
 * `control` without prop drilling.
 *
 * @example
 * const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })
 * return (
 *   <Form form={form} onSubmit={(values) => login(values)}>
 *     <FormInput name="email" label="Email" />
 *     <Button type="submit">Sign in</Button>
 *   </Form>
 * )
 */
export function Form<TValues extends FieldValues>({
  form,
  onSubmit,
  className,
  children,
  ...props
}: FormProps<TValues>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        noValidate
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}
