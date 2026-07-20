'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QuizBackground } from '@/components/quiz-background'
import { QuizFunFacts } from '@/components/quiz-fun-facts'

function GeneratingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  const topic = searchParams.get('topic') ?? ''
  const difficulty = searchParams.get('difficulty') ?? 'Medium'
  const count = Number(searchParams.get('count') ?? 10)
  const mode = searchParams.get('mode') ?? 'Classic'
  const timeLimit = searchParams.get('timeLimit') ? Number(searchParams.get('timeLimit')) : undefined

  useEffect(() => {
    if (!topic) {
      router.replace('/')
      return
    }

    let cancelled = false

    async function generate() {
      try {
        const res = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, difficulty, count }),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `Request failed: ${res.status}`)
        }

        const data = await res.json()

        const questions = data.questions.map((q: any, i: number) => ({
          id: i + 1,
          prompt: q.question,
          type: 'single' as const,
          options: q.options,
          correctAnswer: [q.options[q.answer]],
          reason: q.explanation ?? '',
        }))

        const quizPayload = {
          topic,
          difficulty,
          count,
          mode,
          timeLimit,
          questions,
        }

        if (!cancelled) {
          sessionStorage.setItem('currentQuiz', JSON.stringify(quizPayload))
          router.replace('/quiz')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong generating your quiz.')
        }
      }
    }

    generate()
    return () => {
      cancelled = true
    }
  }, [topic, difficulty, count, mode, timeLimit, router])

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <QuizBackground />

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
          <span>Gener</span>
          <span className="bg-gradient-to-r from-slate-200 to-yellow-300 bg-clip-text text-transparent">ating</span>
          <span> Quiz</span>
        </h1>

        {error ? (
          <div className="mt-8 max-w-md rounded-2xl border border-destructive/40 bg-destructive/10 px-6 py-5">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-card/70"
            >
              Back to homepage
            </button>
          </div>
        ) : (
          <>
            <div className="mt-10 size-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <QuizFunFacts />
          </>
        )}
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GeneratingContent />
    </Suspense>
  )
}