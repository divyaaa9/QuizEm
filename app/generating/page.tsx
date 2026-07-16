import { QuizBackground } from "@/components/quiz-background"
import { QuizFunFacts } from "@/components/quiz-fun-facts"

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0e16] text-slate-100">
      <QuizBackground />

      <div className="relative z-10 flex flex-col items-center">
        {/* Heading with gradient on the center letters (matching the "master" style) */}
        <h1 className="text-balance text-center text-5xl font-extrabold tracking-tight md:text-6xl">
          <span>Gener</span>
          <span className="bg-gradient-to-r from-slate-400 via-amber-200 to-emerald-300 bg-clip-text text-transparent">
            ating Qui
          </span>
          <span>z</span>
        </h1>

        {/* Loading circle */}
        <div className="mt-10" role="status" aria-label="Loading">
          <div className="size-12 animate-spin rounded-full border-4 border-slate-700 border-t-teal-400 [animation-duration:1.2s]" />
          <span className="sr-only">Generating your quiz…</span>
        </div>

        {/* Random quiz fun facts */}
        <QuizFunFacts />
      </div>
    </main>
  )
}
