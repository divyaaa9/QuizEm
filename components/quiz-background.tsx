import {
  Pencil,
  Calculator,
  BookOpen,
  Compass,
  GraduationCap,
  Brain,
  FlaskConical,
  Library,
  PenTool,
  Sigma,
} from "lucide-react"

const icons = [
  { Icon: PenTool, left: "8%", size: 32, rotate: 12, dur: 27, delay: 0 },
  { Icon: Pencil, left: "16%", size: 28, rotate: -12, dur: 31, delay: 8 },
  { Icon: Compass, left: "24%", size: 28, rotate: 0, dur: 29, delay: 14 },
  { Icon: Calculator, left: "31%", size: 32, rotate: 0, dur: 33, delay: 4 },
  { Icon: BookOpen, left: "39%", size: 32, rotate: 0, dur: 28, delay: 11 },
  { Icon: GraduationCap, left: "47%", size: 32, rotate: 0, dur: 32, delay: 18 },
  { Icon: Sigma, left: "55%", size: 32, rotate: 0, dur: 30, delay: 3 },
  { Icon: Library, left: "63%", size: 32, rotate: 0, dur: 34, delay: 9 },
  { Icon: Brain, left: "71%", size: 32, rotate: 0, dur: 27, delay: 15 },
  { Icon: GraduationCap, left: "78%", size: 28, rotate: 0, dur: 31, delay: 6 },
  { Icon: BookOpen, left: "85%", size: 28, rotate: 0, dur: 29, delay: 13 },
  { Icon: Pencil, left: "92%", size: 28, rotate: 45, dur: 32, delay: 19 },
  { Icon: FlaskConical, left: "4%", size: 28, rotate: 0, dur: 30, delay: 10 },
  { Icon: Compass, left: "68%", size: 28, rotate: 12, dur: 33, delay: 16 },
  { Icon: Calculator, left: "35%", size: 28, rotate: 0, dur: 28, delay: 20 },
]

export function QuizBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* teal radial glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(45,212,191,0.10) 0%, rgba(45,212,191,0.04) 40%, transparent 70%)",
        }}
      />
      {/* icons rising from bottom to top */}
      {icons.map(({ Icon, left, size, rotate, dur, delay }, i) => (
        <span
          key={i}
          className="absolute bottom-0 [animation:quiz-rise_var(--dur)_linear_infinite]"
          style={
            {
              left,
              width: size,
              height: size,
              "--rot": `${rotate}deg`,
              "--dur": `${dur}s`,
              animationDelay: `-${delay}s`,
            } as React.CSSProperties
          }
        >
          <Icon className="size-full text-slate-300/30 [transform:translateZ(0)]" strokeWidth={2} />
        </span>
      ))}
      <style>{`
        @keyframes quiz-rise {
          0% { transform: translateY(60px) rotate(var(--rot)); opacity: 0; }
          12% { opacity: 0.9; }
          88% { opacity: 0.9; }
          100% { transform: translateY(calc(-100vh - 60px)) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
