"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageMotion } from "@/components/layout/motion-wrapper";
import FaultyTerminal from "@/components/layout/faulty-terminal";
import FuzzyText from "@/components/fuzzy-text";
import { ArrowLeft, HomeIcon } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <PageMotion>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <FaultyTerminal
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.5}
            timeScale={0.8}
            pause={false}
            scanlineIntensity={0.5}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            curvature={0.1}
            tint="#1eff00"
            mouseReact
            mouseStrength={0.5}
            pageLoadAnimation
            brightness={0.6}
          />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center flex-col px-6">
          <div className="w-full max-w-xl rounded-2xl p-8 text-center">
            <div className="flex justify-center">
              <div className="flex flex-col items-center space-y-8">
                <FuzzyText
                  baseIntensity={0.2}
                  hoverIntensity={0.5}
                  enableHover
                  fontSize="180px"
                >
                  404
                </FuzzyText>

                <FuzzyText
                  baseIntensity={0.2}
                  hoverIntensity={0.5}
                  enableHover
                  fontSize="40px"
                >
                  Page not found
                </FuzzyText>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-center gap-8">
              <button
                onClick={() => router.back()}
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/60 backdrop-blur transition-all hover:border-primary hover:scale-110"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </button>

              <Link
                href="/platform"
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/60 backdrop-blur transition-all hover:border-primary hover:scale-110"
              >
                <HomeIcon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageMotion>
  );
}
