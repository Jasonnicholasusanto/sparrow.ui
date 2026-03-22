"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { loginAction, loginGoogle, LoginState } from "@/lib/auth/authActions";
import { useActionState } from "react";
import { Spinner } from "@/components/ui/spinner";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner data-icon="inline-start" /> : "Sign in"}
    </Button>
  );
}

function LoginGoogleButton() {
  async function handleGoogleLogin() {
    const res = await loginGoogle();
    if (res?.url) {
      window.location.href = res.url;
    } else if (res?.error) {
      console.error(res.error);
      alert("Google login failed: " + res.error);
    }
  }

  return (
    <Button variant="secondary" className="w-full" onClick={handleGoogleLogin}>
      <FaGoogle />
      Login with Google
    </Button>
  );
}

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction] = useActionState<LoginState, FormData>(
    loginAction,
    { error: null },
  );
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-12",
        className,
      )}
      {...props}
    >
      <Card
        className="relative overflow-hidden rounded-2xl
                border-0 bg-black/50 backdrop-blur-xl
                shadow-xl w-md"
      >
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-white">Welcome back</CardTitle>
          <CardDescription className="text-zinc-400">
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <LoginGoogleButton />
              </div>
              <div className="relative text-center text-sm flex items-center">
                <div className="grow border-t border-zinc-400"></div>
                <span className="text-zinc-400 relative z-10 px-2">
                  Or continue with
                </span>
                <div className="grow border-t border-zinc-400"></div>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email" className="text-zinc-400">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="someone@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-zinc-400">
                      Password
                    </Label>
                    <a
                      href="/auth/forgot-password"
                      className="text-zinc-400 ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    placeholder="********"
                  />
                </div>
                {state.error && (
                  <p className="text-sm text-red-500 text-center">
                    {state.error}
                  </p>
                )}
                <SubmitButton />
              </div>
              <div className="text-center text-sm text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
