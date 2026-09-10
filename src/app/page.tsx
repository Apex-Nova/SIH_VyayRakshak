import { Hero } from "@/components/home/hero";
import { Metrics } from "@/components/home/metrics";
import { Problem } from "@/components/home/problem";
import { Process } from "@/components/home/process";
import { AIModules } from "@/components/home/ai-modules";
import { RiskScoring } from "@/components/home/risk-scoring";
import { PreviewBand, ClosingCTA } from "@/components/home/preview-band";
import { MotionBand } from "@/components/home/motion-band";
import { ExplainerEmbed } from "@/components/home/explainer-embed";
import { Roadmap } from "@/components/home/roadmap";
import { FAQ } from "@/components/home/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Metrics />
      <Problem />
      <Process />
      <AIModules />
      <RiskScoring />
      <PreviewBand />
      <MotionBand />
      <Roadmap />
      <FAQ />
      <ExplainerEmbed />
      <ClosingCTA />
    </>
  );
}
