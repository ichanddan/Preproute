"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormInput } from "~/components/forms";
import { Button } from "~/components/ui/button";

import { loginSchema, type LoginValues } from "./zod/login-schema";

export function LoginForm() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userId: "", password: "" },
  });

  function onSubmit(values: LoginValues) {
    console.log("login", values);
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="gap-5">
      <FormInput<LoginValues>
        name="userId"
        label="User ID"
        placeholder="Enter User ID"
        autoComplete="username"
        className="h-11 rounded-xl"
      />

      <div className="flex flex-col gap-2">
        <FormInput<LoginValues>
          name="password"
          type="password"
          label="Password"
          placeholder="Enter Password"
          autoComplete="current-password"
          className="h-11 rounded-xl"
        />
        <a
          href="#"
          className="w-fit text-sm font-medium text-[#1b5def] hover:underline"
        >
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        className="h-11 rounded-xl bg-[#6c7cf0] text-base font-medium text-white hover:bg-[#5b6be0]"
      >
        Login
      </Button>
    </Form>
  );
}
