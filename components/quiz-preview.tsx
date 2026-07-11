"use client"

import { useState } from "react"
import { Check, Timer, Zap } from "lucide-react"

const OPTIONS = [
  { key: "A", text: "Bubble Sort", correct: false },
  { key: "B", text: "Merge Sort", correct: true },
  { key: "C", text: "Quick Sort", correct: false },
  { key: "D", text: "Selection Sort", correct: false },
]

export function QuizPreview() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <section id="preview" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-16">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">See it in action</h2>
        <p className="mt-2 text-muted-foreground">A taste of what every question feels like.</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl md:p-8">
        <div
          className="pointer-events-none absolute -left-16 -top-16 size-48 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--purple)" }}
        />

        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
            <Zap className="size-3.5 text-cyan" /> DSA · Question 3/10
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
            <Timer className="size-3.5 text-pink" /> 00:14
          </span>
        </div>

        <h3 className="relative mt-5 text-balance font-display text-xl font-bold leading-snug md:text-2xl">
          Which sorting algorithm has O(n log n) average complexity?
        </h3>

        <div className="relative mt-6 grid gap-3">
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.key
            const showState = selected !== null
            const isCorrect = opt.correct
            const wrongPick = isSelected && !isCorrect

            let stateClass =
              "border-border bg-background/40 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-background/70"
            if (showState && isCorrect) stateClass = "border-cyan/70 bg-cyan/10"
            else if (wrongPick) stateClass = "border-destructive/70 bg-destructive/10"

            return (
              <button
                key={opt.key}
                onClick={() => setSelected(opt.key)}
                className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${stateClass}`}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                    showState && isCorrect
                      ? "bg-cyan text-background"
                      : wrongPick
                        ? "bg-destructive text-background"
                        : "bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                  }`}
                >
                  {showState && isCorrect ? <Check className="size-5" /> : opt.key}
                </span>
                <span className="font-semibold">{opt.text}</span>
              </button>
            )
          })}
        </div>

        <div className="relative mt-5 min-h-6 text-sm font-medium">
          {selected !== null &&
            (selected === "B" ? (
              <p className="text-cyan">Correct! Merge Sort guarantees O(n log n) by always splitting in half.</p>
            ) : (
              <p className="text-muted-foreground">
                Not quite &mdash; the answer is <span className="font-bold text-cyan">Merge Sort</span>. Tap it to see why.
              </p>
            ))}
        </div>
      </div>
    </section>
  )
}
