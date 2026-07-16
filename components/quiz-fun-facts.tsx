"use client"

import { useEffect, useState } from "react"
import { Lightbulb } from "lucide-react"

const FACTS = [
  "Taking a quiz helps you learn better than re-reading — it's called the 'testing effect'.",
  "Quizzing yourself strengthens memory recall far more than passively reviewing notes.",
  "Regular low-stakes quizzes can reduce test anxiety and boost real exam scores.",
  "Getting a quiz question wrong actually helps — the correction sticks longer in memory.",
  "Spacing quizzes out over time can improve long-term retention by up to 200%.",
  "Quizzes force active recall, which builds stronger neural pathways than highlighting.",
  "A quick quiz after learning helps 'lock in' new information before you forget it.",
  "Quizzing reveals exactly what you don't know yet, so you can focus your study time.",
  "Retrieval practice through quizzes makes knowledge easier to apply in new situations.",
  "Frequent quizzing turns studying into a habit and keeps motivation high.",
]

export function QuizFunFacts() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const interval = setInterval(() => {
      setVisible(false)
      timeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % FACTS.length)
        setVisible(true)
      }, 700)
    }, 5000)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="mt-10 flex min-h-12 max-w-md items-start justify-center px-6 text-center">
      <p
        className={`flex items-start gap-1.5 text-pretty text-sm leading-relaxed text-slate-400 transition-all duration-700 ease-in-out ${
          visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-1 opacity-0 blur-[2px]"
        }`}
      >
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-teal-400" strokeWidth={2} />
        <span>
          <span className="mr-1 font-medium text-teal-400">Did you know?</span>
          {FACTS[index]}
        </span>
      </p>
    </div>
  )
}
