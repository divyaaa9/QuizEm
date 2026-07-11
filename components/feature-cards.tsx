import { Target, Brain, Trophy } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const FEATURES: {
  icon: LucideIcon
  emoji: string
  title: string
  desc: string
  color: string
}[] = [
  {
    icon: Target,
    emoji: "🎯",
    title: "Challenge Yourself",
    desc: "Beat the timer and push your streak higher every single round.",
    color: "var(--pink)",
  },
  {
    icon: Brain,
    emoji: "🧠",
    title: "Learn Faster",
    desc: "Every answer comes with a clear explanation so it actually sticks.",
    color: "var(--cyan)",
  },
  {
    icon: Trophy,
    emoji: "🏆",
    title: "Improve Daily",
    desc: "Track your progress and watch your knowledge level up over time.",
    color: "var(--purple)",
  },
]

export function FeatureCards() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16">
      <div className="grid gap-5 md:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon
          return (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl transition-all hover:-translate-y-1.5 hover:border-primary/50"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                style={{ background: f.color }}
              />
              <div
                className="mb-5 flex size-14 items-center justify-center rounded-2xl text-2xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: `color-mix(in oklch, ${f.color} 22%, transparent)` }}
              >
                <Icon className="size-7" style={{ color: f.color }} />
              </div>
              <h3 className="font-display text-xl font-bold">
                <span className="mr-1.5">{f.emoji}</span>
                {f.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
