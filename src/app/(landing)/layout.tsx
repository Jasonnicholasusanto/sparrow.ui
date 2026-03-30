import Dither from "@/components/layout/landing/dither";
import "../../styles/globals.css";
import FadeContent from "@/components/fade-content";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FadeContent blur={true} duration={3000} initialOpacity={0}>
      <div className="fixed inset-0 -z-10 pointer-events-auto min-h-screen">
        <Dither
          waveColor={[0.02, 0.71, 0.83]}
          disableAnimation={false}
          enableMouseInteraction
          mouseRadius={0.1}
          colorNum={10}
          waveAmplitude={0.25}
          waveFrequency={2}
          waveSpeed={0.05}
        />
      </div>
      {children}
    </FadeContent>
  );
}
