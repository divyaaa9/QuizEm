"use client"

import { useMemo } from "react"
import {
  GraduationCap,
  BookOpen,
  Pencil,
  FlaskConical,
  Calculator,
  Globe2,
  Atom,
  Ruler,
  Lightbulb,
  Compass,
  Sigma,
  Microscope,
  Binary,
  PenTool,
  Library,
  Brain,
} from "lucide-react"

const ICONS = [
  GraduationCap,
  BookOpen,
  Pencil,
  FlaskConical,
  Calculator,
  Globe2,
  Atom,
  Ruler,
  Lightbulb,
  Compass,
  Sigma,
  Microscope,
  Binary,
  PenTool,
  Library,
  Brain,
]

export function AnimatedBackground() {
  // Deterministic set so server/client render match.
  const items = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280
        const rnd = seed / 233280
        const rnd2 = ((i * 4096 + 150889) % 714025) / 714025
        return {
          Icon: ICONS[i % ICONS.length],
          left: `${(rnd * 100).toFixed(2)}%`,
          size: 22 + Math.round(rnd2 * 30),
          delay: `${(rnd2 * 24).toFixed(2)}s`,
          duration: `${(26 + rnd * 20).toFixed(2)}s`,
        }
      }),
    [],
  )

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Calm base gradient, slowly shifting */}
      <div
        className="absolute inset-0 opacity-90 animate-gradient"
        style={{
          background:
            "linear-gradient(140deg, oklch(0.17 0.02 250), oklch(0.2 0.025 235), oklch(0.18 0.02 260), oklch(0.17 0.02 250))",
          backgroundSize: "300% 300%",
        }}
      />

      {/* Subtle grid, like ruled paper / blackboard */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Two soft, low-saturation glows for depth */}
      <div
        className="absolute -left-40 top-[-10%] h-[30rem] w-[30rem] rounded-full blur-3xl opacity-20 animate-blob"
        style={{ background: "radial-gradient(circle, var(--blue), transparent 70%)" }}
      />
      <div
        className="absolute right-[-10rem] bottom-[-12%] h-[28rem] w-[28rem] rounded-full blur-3xl opacity-[0.14] animate-blob"
        style={{ background: "radial-gradient(circle, var(--pink), transparent 70%)", animationDelay: "-8s" }}
      />

      {/* Drifting educational icons */}
      {items.map(({ Icon, ...p }, i) => (
        <span
          key={i}
          className="absolute bottom-0 animate-drift text-foreground/25"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          <Icon style={{ width: p.size, height: p.size }} strokeWidth={1.4} />
        </span>
      ))}

      {/* Vignette to keep text readable */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 40%, transparent 45%, oklch(0.14 0.02 250 / 0.7))" }}
      />
    </div>
  )
}
