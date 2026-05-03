"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FaEnvelope } from "react-icons/fa";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-12",
        className,
      )}
      {...props}
    >
      {success ? (
        <Card
          className="
                relative overflow-hidden rounded-2xl
                border border-white/15 bg-black/50 backdrop-blur-xl
                shadow-xl w-md
                /* TOP SHINY LINE */
                before:content-[''] before:pointer-events-none
                before:absolute before:inset-x-6 before:top-0 before:h-px
                before:bg-gradient-to-r
                before:from-transparent before:via-white/80 before:to-transparent
                before:opacity-90
                /* BOTTOM SHINY LINE */
                after:content-[''] after:pointer-events-none
                after:absolute after:inset-x-6 after:bottom-0 after:h-px
                after:bg-gradient-to-r
                after:from-transparent after:via-white/80 after:to-transparent
                after:opacity-90
            "
        >
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex flex-col items-center justify-center gap-5">
              <FaEnvelope size={32} className="text-primary" />
              <span>Check your email</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm pb-5">
              If you registered using this email, you will receive a password
              reset email. Please check your inbox and spam folder.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              href="/auth/sign-in"
              className="underline underline-offset-4 text-sm hover:text-primary"
            >
              Back to login
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <Card
          className="
                relative overflow-hidden rounded-2xl
                border border-white/15 bg-black/50 backdrop-blur-xl
                shadow-xl w-md
                /* TOP SHINY LINE */
                before:content-[''] before:pointer-events-none
                before:absolute before:inset-x-6 before:top-0 before:h-px
                before:bg-gradient-to-r
                before:from-transparent before:via-white/80 before:to-transparent
                before:opacity-90
                /* BOTTOM SHINY LINE */
                after:content-[''] after:pointer-events-none
                after:absolute after:inset-x-6 after:bottom-0 after:h-px
                after:bg-gradient-to-r
                after:from-transparent after:via-white/80 after:to-transparent
                after:opacity-90
            "
        >
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Forgot your password?</CardTitle>
            <CardDescription>
              Enter your email to receive a reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="someone@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>

              <div className="text-center text-sm">
                Remembered it?{" "}
                <Link
                  href="/auth/sign-in"
                  className="underline underline-offset-4"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
