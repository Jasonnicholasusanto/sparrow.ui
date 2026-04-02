"use client";

import Header from "@/components/layout/landing/header";
import LandingHero from "./components/landing-hero";
import { PageMotion } from "@/components/layout/motion-wrapper";

export default function LandingPage() {
  return (
    <PageMotion>
      <main className="relative min-h-screen overflow-hidden">
        <Header />
        <LandingHero />
      </main>
    </PageMotion>
  );
}
