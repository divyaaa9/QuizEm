import { AnimatedBackground } from "@/components/animated-background"
import { SiteHeader } from "@/components/site-header"
import { HeroQuizCreator } from "@/components/hero-quiz-creator"
import { FeatureCards } from "@/components/feature-cards"
import { QuizPreview } from "@/components/quiz-preview"

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      <SiteHeader />
      <HeroQuizCreator />
      <FeatureCards />
      <QuizPreview />

      <footer className="mx-auto max-w-6xl px-5 pb-10 pt-6 text-center text-sm text-muted-foreground">
        Built for curious minds. Quiz &rsquo;em on anything with{" "}
        <span className="font-display font-bold text-foreground">QuizEm</span>.
      </footer>
    </main>
  )
}
