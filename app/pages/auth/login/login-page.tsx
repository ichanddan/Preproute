import AuthSideIcon from "~/assists/auth/sideIcon";
import Logo from "~/assists/logo";

import { LoginForm } from "./login-form";

export function LoginPage() {
  return (
    <main className="min-h-svh w-full bg-white p-4 lg:p-6">
      <div className="grid min-h-[calc(100svh-2rem)] overflow-hidden rounded-3xl border border-[#e6eefc] lg:min-h-[calc(100svh-3rem)] lg:grid-cols-2">
        <aside className="hidden items-center justify-center bg-[#f3f8ff] p-12 lg:flex">
          <AuthSideIcon className="h-auto w-full max-w-md" />
        </aside>

        <section className="flex items-center justify-center bg-white px-6 py-12 sm:px-10">
          <div className="w-full max-w-sm">
            <Logo className="h-8 w-auto" />

            <div className="mt-10">
              <h1 className="text-2xl font-semibold text-foreground">Login</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Use your company provided Login credentials
              </p>
            </div>

            <div className="mt-7">
              <LoginForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
