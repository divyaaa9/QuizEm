'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Trash2, Play, Clock3 } from 'lucide-react'

type HistoryItem = {
  id: string
  topic: string
  difficulty: string
  mode: string
  score: number
  total: number
  quiz_data: any
  created_at: string
}

type SavedItem = {
  id: string
  topic: string
  difficulty: string
  mode: string
  quiz_data: any
  created_at: string
}

export default function ProfilePage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [tab, setTab] = useState<'recent' | 'saved'>('recent')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [saved, setSaved] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (!isSignedIn) return
    async function load() {
      const [histRes, savedRes] = await Promise.all([
        fetch('/api/quiz-history'),
        fetch('/api/saved-quizzes'),
      ])
      const histData = await histRes.json()
      const savedData = await savedRes.json()
      setHistory(histData.history ?? [])
      setSaved(savedData.saved ?? [])
      setLoading(false)
    }
    load()
  }, [isSignedIn])

  const retake = (quizData: any) => {
    sessionStorage.setItem('currentQuiz', JSON.stringify(quizData))
    router.push('/quiz')
  }

  const unsave = async (id: string) => {
    await fetch('/api/saved-quizzes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSaved((current) => current.filter((s) => s.id !== id))
  }

  if (!isLoaded || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-14 md:px-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">My Quizzes</h1>
      <p className="mt-2 text-muted-foreground">Your recent attempts and saved quizzes, all in one place.</p>

      <div className="mt-6 flex w-fit gap-2 rounded-full border border-border bg-card/50 p-1.5">
        <button
          onClick={() => setTab('recent')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            tab === 'recent' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          Recent (last 5)
        </button>
        <button
          onClick={() => setTab('saved')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            tab === 'saved' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          Saved quizzes
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {tab === 'recent' &&
          (history.length === 0 ? (
            <p className="text-muted-foreground">No quizzes taken yet — go generate one!</p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{item.topic}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.difficulty} · {item.mode} · Score: {item.score}/{item.total}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="size-3 shrink-0" /> {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => retake(item.quiz_data)}
                  className="flex shrink-0 items-center justify-center gap-1.5 self-start rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground sm:self-auto"
                >
                  <Play className="size-3.5" /> Retake
                </button>
              </div>
            ))
          ))}

        {tab === 'saved' &&
          (saved.length === 0 ? (
            <p className="text-muted-foreground">No saved quizzes yet.</p>
          ) : (
            saved.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{item.topic}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.difficulty} · {item.mode}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => retake(item.quiz_data)}
                    className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
                  >
                    <Play className="size-3.5" /> Take
                  </button>
                  <button
                    onClick={() => unsave(item.id)}
                    className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))
          ))}
      </div>
    </main>
  )
}
