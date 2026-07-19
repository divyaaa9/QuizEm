"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Sparkles, Wand2, ChevronDown } from "lucide-react"

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Insane"] as const
const COUNTS = [5, 10, 15, 20] as const
const MODES = ["Classic", "Timed", "Survival"] as const
const SURVIVAL_LIMITS = [3, 5, 10] as const

const TOPICS = [
  { emoji: "🔥", label: "AI", color: "var(--pink)" },
  { emoji: "🐍", label: "Python", color: "var(--cyan)" },
  { emoji: "💻", label: "DSA", color: "var(--blue)" },
  { emoji: "⚛️", label: "React", color: "var(--cyan)" },
  { emoji: "🌎", label: "Geography", color: "var(--blue)" },
  { emoji: "⚽", label: "Football", color: "var(--purple)" },
  { emoji: "🧠", label: "Biology", color: "var(--pink)" },
  { emoji: "📚", label: "History", color: "var(--purple)" },
]

function Pill<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[]
  value: T
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1.5 rounded-full border border-border bg-background/40 p-1.5">
        {options.map((opt) => (
          <button
            key={String(opt)}
            onClick={() => onChange(opt)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
              value === opt
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export function HeroQuizCreator() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("Medium")
  const [count, setCount] = useState<(typeof COUNTS)[number]>(10)
  const [mode, setMode] = useState<(typeof MODES)[number]>("Classic")
  const [survivalMinutes, setSurvivalMinutes] = useState<(typeof SURVIVAL_LIMITS)[number]>(5)
  const router = useRouter()

  const handleGenerate = () => {
    if (!topic.trim()) return
    const params = new URLSearchParams({
      topic: topic.trim(),
      difficulty,
      count: String(count),
      mode,
    })
    if (mode === "Survival") {
      params.set("timeLimit", String(survivalMinutes))
    }
    router.push(`/generating?${params.toString()}`)
  }

  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center px-5 pb-8 pt-10 text-center md:pt-16">
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur">
        <Sparkles className="size-4 text-pink" />
        Quiz &rsquo;em on anything.
      </span>

      <h1 className="text-balance font-display text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
        What do you want to{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(90deg, var(--purple), var(--pink), var(--cyan))" }}
        >
          master
        </span>{" "}
        today?
      </h1>

      <div className="group mt-9 w-full">
        <div className="relative rounded-3xl border border-border bg-card/70 p-2.5 shadow-2xl shadow-primary/10 backdrop-blur-xl transition-all focus-within:border-primary/70 focus-within:shadow-primary/30">
          <div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 blur transition-opacity duration-500 group-focus-within:opacity-40"
            style={{ background: "linear-gradient(90deg, var(--purple), var(--pink), var(--cyan))" }}
          />
          <div className="relative flex flex-col items-stretch gap-2 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-3 px-4">
              <Wand2 className="size-6 shrink-0 text-primary" />
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Try React, World War II, DBMS, Python..."
                className="w-full bg-transparent py-4 text-lg font-medium outline-none placeholder:text-muted-foreground md:text-xl"
                aria-label="Quiz topic"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!topic.trim()}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/40 transition-all hover:scale-[1.03] hover:shadow-primary/60 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              <Sparkles className="size-5" />
              Generate Quiz
            </button>
          </div>
        </div>
      </div>

      <div className="mt-7 flex w-full flex-col flex-wrap items-center justify-center gap-5 sm:flex-row sm:items-end">
        <Pill label="Difficulty" options={DIFFICULTIES} value={difficulty} onChange={setDifficulty} />
        <Pill label="Questions" options={COUNTS} value={count} onChange={setCount} />
        <Pill label="Mode" options={MODES} value={mode} onChange={setMode} />
      </div>

      {mode === "Survival" && (
        <div className="mt-5 flex flex-col items-center gap-2">
          <span className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Time limit
          </span>
          <div className="flex flex-wrap gap-1.5 rounded-full border border-border bg-background/40 p-1.5">
            {SURVIVAL_LIMITS.map((min) => (
              <button
                key={min}
                onClick={() => setSurvivalMinutes(min)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
                  survivalMinutes === min
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {min} min
              </button>
            ))}
          </div>
        </div>
      )}

      <div id="trending" className="mt-14 w-full scroll-mt-24">
        <p className="mb-5 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="text-pink">🔥</span> Trending topics
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {TOPICS.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTopic(t.label)}
              className="animate-float rounded-full border border-border bg-card/60 px-4 py-2.5 text-sm font-semibold backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/60"
              style={{ animationDelay: `${(i % 6) * 0.4}s` }}
            >
              <span className="mr-1.5">{t.emoji}</span>
              <span style={{ color: t.color }}>{t.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <ChevronDown className="size-3.5" /> tap a topic to drop it in the box
        </p>
      </div>
    </section>
  )
}
