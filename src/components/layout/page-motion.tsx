"use client";

import FadeContent from "../fade-content";

export function PageMotion({ children }: { children: React.ReactNode }) {
  return (
    <FadeContent blur={true} duration={1200} ease="ease-out" initialOpacity={0}>
      {children}
    </FadeContent>
  );
}
