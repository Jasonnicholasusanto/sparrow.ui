"use client";

import { useEffect, useState, type ReactNode } from "react";

import Header from "@/components/layout/platform/header";
import Onboarding, { type OnboardingFormValues } from "./components/onboarding";
import { useUser } from "@/providers/user-provider";
import { toast } from "sonner";
import { SidebarPanel } from "@/components/layout/platform/sidebar-panel";
import { createProfile } from "@/lib/actions/me";

type Props = {
  children: ReactNode;
};

const HEADER_OFFSET = 80;
const MIN = 300;
const MAX = 500;
const DEFAULT = 380;

export default function PlatformShell({ children }: Props) {
  const { user, authUser, refreshUser } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(user === null);
  const [isSaving, setIsSaving] = useState(false);
  const authUserObj = authUser?.user_metadata;
  const [width, setWidth] = useState(DEFAULT);
  const [dragging, setDragging] = useState(false);

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

          await refreshUser();
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

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-width");
    if (saved) setWidth(Number(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-width", width.toString());
  }, [width]);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragging) return;

      const next = window.innerWidth - e.clientX - 16;
      const clamped = Math.max(MIN, Math.min(MAX, next));
      setWidth(clamped);
    }

    function onUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  return (
    <div className="min-h-screen bg-background px-11 text-foreground">
      <Header />

      <Onboarding
        open={showOnboarding}
        isSubmitting={isSaving}
        onSubmit={handleOnboardingSubmit}
      />

      <div className="mt-6 hidden xl:flex gap-6">
        {/* Main Application Content */}
        <main
          className="min-w-0 flex-1"
          style={{
            width: `calc(100% - ${width}px - 1rem)`,
          }}
        >
          {children}
        </main>

        {/* Right Panel Sidebar */}
        <div className="relative shrink-0" style={{ width }}>
          {/* Resizable Handle */}
          <div
            onMouseDown={() => setDragging(true)}
            className="absolute left-0 top-0 h-full w-2 -translate-x-1/2 cursor-col-resize z-20"
          />

          {/* Sticky Sidebar */}
          <aside
            className="sticky self-start"
            style={{
              top: `${HEADER_OFFSET + 24}px`,
              height: `calc(100vh - ${HEADER_OFFSET}px - 2.5rem)`,
            }}
          >
            <SidebarPanel />
          </aside>
        </div>
      </div>
    </div>
  );
}
