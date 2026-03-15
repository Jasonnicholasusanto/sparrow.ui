"use client";

import * as React from "react";
import type { ReactNode } from "react";

import Header from "@/components/layout/platform/header";
import Onboarding, { type OnboardingFormValues } from "./components/onboarding";
import { useUser } from "@/providers/user-provider";
import { toast } from "sonner";
import { createProfile, getUserProfile } from "@/lib/data/me";

type Props = {
  children: ReactNode;
};

export default function PlatformShell({ children }: Props) {
  const { user, setUser, authUser } = useUser();
  const [showOnboarding, setShowOnboarding] = React.useState(user === null);
  const [isSaving, setIsSaving] = React.useState(false);
  const authUserObj = authUser?.user_metadata;

  async function handleOnboardingSubmit(values: OnboardingFormValues) {
    try {
      setIsSaving(true);

      await toast.promise(
        (async () => {
          await createProfile({
            full_name: values.fullName,
            username: values.username,
            birth_date: values.dateOfBirth.toISOString().split("T")[0],
            phone_number: values.phoneNumber,
            email_address: authUserObj?.email || "",
          });

          const freshUser = await getUserProfile();
          setUser(freshUser);
          setShowOnboarding(false);
        })(),
        {
          loading: "Creating profile...",
          success: "Profile created successfully!",
          error: (err) => ({
            message: "Failed to create profile.",
            description: err?.message || "Please try again later.",
          }),
        },
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <Onboarding
        open={showOnboarding}
        isSubmitting={isSaving}
        onSubmit={handleOnboardingSubmit}
      />

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
