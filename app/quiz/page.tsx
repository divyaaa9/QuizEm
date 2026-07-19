'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuizPage, type QuizData } from '@/components/quiz-page'

export default function Page() {
  const router = useRouter()
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('currentQuiz')
    if (stored) {
      try {
        setQuizData(JSON.parse(stored))
      } catch {
        setQuizData(null)
      }
    }
    setChecked(true)
  }, [])

  if (!checked) return null

  if (!quizData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg font-semibold">No quiz found.</p>
        <p className="text-muted-foreground">Generate one from the homepage first.</p>
        <button
          onClick={() => router.push('/')}
          className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground"
        >
          Go to homepage
        </button>
      </main>
    )
  }

  return <QuizPage quizData={quizData} />
}