'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  Atom,
  Beaker,
  BookOpen,
  Calculator,
  Check,
  Clock3,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Pencil,
  RotateCcw,
  Ruler,
  Save,
  Send,
  Sparkles,
  Timer,
  Trophy,
  X,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

type Question = {
  id: number
  prompt: string
  type: 'single' | 'multiple'
  options: string[]
  correctAnswer: string[] // one or more correct option strings
  reason: string // shown under the question once submitted
}

const questions: Question[] = [
  {
    id: 1,
    prompt: 'Which keyword is used to define a function in Python?',
    type: 'single',
    options: ['func', 'def', 'function', 'define'],
    correctAnswer: ['def'],
    reason: "Python functions are declared with the `def` keyword, followed by the function name and parentheses.",
  },
  {
    id: 2,
    prompt: 'Which of these are mutable Python data types?',
    type: 'multiple',
    options: ['List', 'Tuple', 'Dictionary', 'Set'],
    correctAnswer: ['List', 'Dictionary', 'Set'],
    reason: 'Lists, dictionaries, and sets can be changed after creation. Tuples are immutable — once created, their contents can\u2019t change.',
  },
  {
    id: 3,
    prompt: 'What does the len() function return?',
    type: 'single',
    options: ['The data type', 'The memory size', 'The number of items', 'The final item'],
    correctAnswer: ['The number of items'],
    reason: '`len()` returns the number of items in a sequence or collection, such as characters in a string or elements in a list.',
  },
  {
    id: 4,
    prompt: 'Which operators can compare two values in Python?',
    type: 'multiple',
    options: ['==', '!=', '>=', 'and'],
    correctAnswer: ['==', '!=', '>='],
    reason: '`==`, `!=`, and `>=` are comparison operators. `and` is a logical operator used to combine boolean expressions, not to compare two values directly.',
  },
  {
    id: 5,
    prompt: 'What is the output of print(2 ** 3)?',
    type: 'single',
    options: ['6', '8', '9', '23'],
    correctAnswer: ['8'],
    reason: '`**` is the exponentiation operator, so `2 ** 3` computes 2 to the power of 3, which is 8.',
  },
  {
    id: 6,
    prompt: 'Which statement is used to handle an exception?',
    type: 'single',
    options: ['catch', 'except', 'error', 'rescue'],
    correctAnswer: ['except'],
    reason: 'Python uses `try`/`except` blocks to catch and handle exceptions. `catch` and `rescue` are keywords from other languages.',
  },
  {
    id: 7,
    prompt: 'Which values evaluate to False in Python?',
    type: 'multiple',
    options: ['0', 'None', 'An empty list', 'A non-empty string'],
    correctAnswer: ['0', 'None', 'An empty list'],
    reason: '`0`, `None`, and empty collections (like `[]`) are all falsy. Any non-empty string is truthy.',
  },
  {
    id: 8,
    prompt: 'What does a Python dictionary store?',
    type: 'single',
    options: ['Only numbers', 'Ordered characters', 'Key-value pairs', 'Unique values only'],
    correctAnswer: ['Key-value pairs'],
    reason: 'A dictionary stores data as key-value pairs, letting you look up a value quickly using its associated key.',
  },
  {
    id: 9,
    prompt: 'Which tools are commonly used to install Python packages?',
    type: 'multiple',
    options: ['pip', 'poetry', 'npm', 'conda'],
    correctAnswer: ['pip', 'poetry', 'conda'],
    reason: '`pip`, `poetry`, and `conda` are Python package managers. `npm` is the package manager for Node.js/JavaScript.',
  },
  {
    id: 10,
    prompt: 'Which symbol begins a single-line comment in Python?',
    type: 'single',
    options: ['//', '#', '--', '/*'],
    correctAnswer: ['#'],
    reason: 'Python uses `#` to start a single-line comment. `//`, `--`, and `/* */` are comment syntax from other languages.',
  },
]

type Answers = Record<number, string[]>

function arraysEqualAsSets(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  const setB = new Set(b)
  return a.every((item) => setB.has(item))
}

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2" aria-label="QuizEm home">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_var(--glow)]">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <span className="text-xl font-extrabold tracking-tight">QuizEm</span>
    </a>
  )
}

const floatingIcons = [
  { Icon: GraduationCap, className: 'left-[4%] top-[10%] -rotate-12' },
  { Icon: Calculator, className: 'left-[24%] top-[7%] rotate-6' },
  { Icon: BookOpen, className: 'right-[25%] top-[12%] rotate-3' },
  { Icon: Atom, className: 'right-[5%] top-[8%] -rotate-6' },
  { Icon: Pencil, className: 'left-[10%] top-[26%] -rotate-12' },
  { Icon: Beaker, className: 'left-[38%] top-[22%] rotate-6' },
  { Icon: Ruler, className: 'right-[34%] top-[29%] rotate-12' },
  { Icon: Lightbulb, className: 'right-[8%] top-[25%] -rotate-6' },
  { Icon: FlaskConical, className: 'left-[3%] top-[43%] rotate-6' },
  { Icon: GraduationCap, className: 'left-[29%] top-[39%] rotate-12' },
  { Icon: Calculator, className: 'right-[29%] top-[45%] -rotate-6' },
  { Icon: BookOpen, className: 'right-[4%] top-[41%] rotate-6' },
  { Icon: Atom, className: 'left-[8%] top-[61%] rotate-3' },
  { Icon: Pencil, className: 'left-[39%] top-[58%] -rotate-12' },
  { Icon: Beaker, className: 'right-[36%] top-[64%] rotate-6' },
  { Icon: Ruler, className: 'right-[7%] top-[59%] rotate-12' },
  { Icon: Lightbulb, className: 'left-[4%] top-[80%] -rotate-6' },
  { Icon: FlaskConical, className: 'left-[27%] top-[76%] rotate-6' },
  { Icon: GraduationCap, className: 'right-[27%] top-[83%] -rotate-12' },
  { Icon: Calculator, className: 'right-[5%] top-[78%] rotate-6' },
  { Icon: BookOpen, className: 'left-[15%] top-[94%] rotate-3' },
  { Icon: Atom, className: 'right-[16%] top-[94%] -rotate-6' },
]

function FloatingEducationIcons() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {floatingIcons.map(({ Icon, className }, index) => (
        <motion.div
          key={index}
          className={cn('absolute text-foreground/[0.07]', className)}
          animate={{
            x: [0, index % 2 === 0 ? 10 : -10, 0],
            y: [0, -12 - (index % 3) * 3, 0],
            rotate: [0, index % 2 === 0 ? 5 : -5, 0],
          }}
          transition={{ duration: 8 + (index % 5), repeat: Infinity, ease: 'easeInOut', delay: -(index * 0.65) }}
        >
          <Icon className="size-6 md:size-8" strokeWidth={1.45} />
        </motion.div>
      ))}
    </div>
  )
}

function Navbar({ answered, submitted, onSubmit }: { answered: number; submitted: boolean; onSubmit: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Logo />
        <p className="hidden text-sm font-semibold text-muted-foreground md:block">Python Fundamentals</p>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold sm:flex">
            <Timer className="size-4 text-primary" aria-hidden="true" /> 07:42
          </span>
          <span className="text-sm font-semibold text-muted-foreground">{answered}/10</span>
          <Button size="sm" className="quiz-glow" onClick={onSubmit} disabled={submitted}>
            <Send data-icon="inline-start" />
            {submitted ? 'Submitted' : 'Submit'}
          </Button>
        </div>
      </div>
    </header>
  )
}

function QuestionCard({
  question,
  selected,
  submitted,
  onSelect,
}: {
  question: Question
  selected: string[]
  submitted: boolean
  onSelect: (option: string) => void
}) {
  const isQuestionCorrect = arraysEqualAsSets(selected, question.correctAnswer)

  return (
    <motion.div
      id={`question-${question.id}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="scroll-mt-32"
    >
      <Card
        className={cn(
          'quiz-card transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_20px_55px_rgb(0_0_0/0.24)]',
          submitted && (isQuestionCorrect ? 'ring-2 ring-[color:var(--success)]/40' : 'ring-2 ring-destructive/30')
        )}
      >
        <CardHeader className="flex-row items-start justify-between gap-5 px-5 pt-6 md:px-7 md:pt-7">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 font-mono text-sm font-bold text-primary">{String(question.id).padStart(2, '0')}</span>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Question {question.id}</span>
              <CardTitle className="text-pretty text-lg leading-snug md:text-xl">{question.prompt}</CardTitle>
            </div>
          </div>
          <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">{question.type === 'single' ? 'Single Answer' : 'Multiple Answer'}</Badge>
        </CardHeader>
        <CardContent className="px-5 pb-6 md:px-7 md:pb-7">
          <div className="grid gap-3.5 sm:grid-cols-2">
            {question.options.map((option, index) => {
              const isSelected = selected.includes(option)
              const isCorrectOption = question.correctAnswer.includes(option)
              const showAsCorrect = submitted && isCorrectOption
              const showAsWrong = submitted && isSelected && !isCorrectOption

              return (
                <motion.button
                  key={option}
                  type="button"
                  whileHover={submitted ? undefined : { y: -2 }}
                  whileTap={submitted ? undefined : { scale: 0.985 }}
                  onClick={() => !submitted && onSelect(option)}
                  disabled={submitted}
                  className={cn(
                    'group flex min-h-16 items-center gap-3 rounded-2xl border border-border/70 bg-secondary/30 px-4 py-3 text-left text-sm font-medium transition-[background-color,border-color,box-shadow] duration-300 ease-out hover:border-primary/35 hover:bg-secondary/60 hover:shadow-[0_10px_28px_rgb(0_0_0/0.16)]',
                    isSelected && !submitted && 'border-primary/80 bg-primary/10 shadow-[0_0_26px_var(--glow-soft)]',
                    showAsCorrect && 'border-[color:var(--success)] bg-[color:var(--success)]/10 shadow-none hover:border-[color:var(--success)] hover:bg-[color:var(--success)]/10',
                    showAsWrong && 'border-destructive bg-destructive/10 shadow-none hover:border-destructive hover:bg-destructive/10',
                    submitted && 'cursor-default'
                  )}
                  aria-pressed={isSelected}
                >
                  {question.type === 'multiple' ? (
                    <Checkbox
                      checked={isSelected}
                      tabIndex={-1}
                      aria-hidden="true"
                      disabled={submitted}
                      className={cn(
                        'pointer-events-none',
                        showAsCorrect && 'border-[color:var(--success)] data-checked:bg-[color:var(--success)]',
                        showAsWrong && 'border-destructive data-checked:bg-destructive'
                      )}
                    />
                  ) : (
                    <span
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-xs text-muted-foreground transition-colors',
                        isSelected && !submitted && 'border-primary bg-primary text-primary-foreground',
                        showAsCorrect && 'border-[color:var(--success)] bg-[color:var(--success)] text-white',
                        showAsWrong && 'border-destructive bg-destructive text-white'
                      )}
                    >
                      {showAsCorrect ? (
                        <Check className="size-4" aria-hidden="true" />
                      ) : showAsWrong ? (
                        <X className="size-4" aria-hidden="true" />
                      ) : isSelected ? (
                        <Check className="size-4" aria-hidden="true" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </span>
                  )}
                  <span
                    className={cn(
                      showAsCorrect && 'font-semibold text-[color:var(--success)]',
                      showAsWrong && 'font-semibold text-destructive'
                    )}
                  >
                    {option}
                  </span>
                  {showAsCorrect && <Check className="ml-auto size-4 shrink-0 text-[color:var(--success)]" aria-hidden="true" />}
                  {showAsWrong && <X className="ml-auto size-4 shrink-0 text-destructive" aria-hidden="true" />}
                </motion.button>
              )
            })}
          </div>

          {submitted && (
            <div
              className={cn(
                'mt-4 rounded-2xl border px-4 py-3.5 text-sm',
                isQuestionCorrect ? 'border-[color:var(--success)]/35 bg-[color:var(--success)]/5' : 'border-border/70 bg-secondary/30'
              )}
            >
              <p className="font-semibold text-foreground">
                Correct answer{question.correctAnswer.length > 1 ? 's' : ''}:{' '}
                <span className="text-[color:var(--success)]">{question.correctAnswer.join(', ')}</span>
              </p>
              <p className="mt-1 leading-relaxed text-muted-foreground">{question.reason}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function Navigator({ answers, submitted }: { answers: Answers; submitted: boolean }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((question) => {
        const done = (answers[question.id]?.length ?? 0) > 0
        const isCorrect = submitted && arraysEqualAsSets(answers[question.id] ?? [], question.correctAnswer)
        const isWrong = submitted && !isCorrect
        return (
          <button
            key={question.id}
            onClick={() => document.getElementById(`question-${question.id}`)?.scrollIntoView({ behavior: 'smooth' })}
            className={cn(
              'flex size-9 items-center justify-center rounded-full border border-border bg-secondary text-xs font-bold text-muted-foreground transition-all hover:border-primary hover:text-primary',
              done && !submitted && 'border-primary/60 bg-primary/15 text-primary',
              isCorrect && 'border-[color:var(--success)]/60 bg-[color:var(--success)]/15 text-[color:var(--success)]',
              isWrong && 'border-destructive/60 bg-destructive/15 text-destructive'
            )}
            aria-label={`Go to question ${question.id}`}
          >
            {question.id}
          </button>
        )
      })}
    </div>
  )
}

function ResultsCard({ answers }: { answers: Answers }) {
  const correctCount = questions.filter((q) => arraysEqualAsSets(answers[q.id] ?? [], q.correctAnswer)).length
  const total = questions.length
  const percentage = Math.round((correctCount / total) * 100)

  const tier =
    percentage >= 80
      ? { label: 'Excellent work!', color: 'var(--success)' }
      : percentage >= 50
      ? { label: 'Good effort — keep practicing.', color: 'var(--accent)' }
      : { label: "Don't worry, review the explanations below.", color: 'var(--destructive)' }

  return (
    <motion.div
      id="results"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="scroll-mt-32"
    >
      <Card className="quiz-card border-primary/15 shadow-[0_22px_65px_rgb(0_0_0/0.22),0_0_45px_var(--glow-soft)]">
        <CardHeader className="items-center gap-2 text-center">
          <span
            className="flex size-14 items-center justify-center rounded-full"
            style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)' }}
          >
            <Trophy className="size-7 text-primary" aria-hidden="true" />
          </span>
          <CardTitle className="text-2xl">Quiz Results</CardTitle>
          <p className="text-sm font-medium" style={{ color: tier.color }}>{tier.label}</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-5 px-5 pb-8 md:px-7">
          <p className="text-5xl font-extrabold" style={{ color: tier.color }}>
            {correctCount}<span className="text-2xl text-muted-foreground"> / {total}</span>
          </p>
          <div className="w-full max-w-sm">
            <Progress value={percentage} />
            <p className="mt-2 text-center text-sm text-muted-foreground">{percentage}% correct</p>
          </div>
          <div className="grid w-full grid-cols-3 gap-3 sm:max-w-md">
            <div className="rounded-2xl border border-border/65 bg-secondary/30 px-4 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Correct</p>
              <p className="mt-1 text-xl font-bold text-[color:var(--success)]">{correctCount}</p>
            </div>
            <div className="rounded-2xl border border-border/65 bg-secondary/30 px-4 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Incorrect</p>
              <p className="mt-1 text-xl font-bold text-destructive">{total - correctCount}</p>
            </div>
            <div className="rounded-2xl border border-border/65 bg-secondary/30 px-4 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Score</p>
              <p className="mt-1 text-xl font-bold text-primary">{percentage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function QuizPage() {
  const [answers, setAnswers] = useState<Answers>({ 1: ['def'], 2: ['List', 'Dictionary'] })
  const [submitted, setSubmitted] = useState(false)
  const answered = useMemo(() => Object.values(answers).filter((items) => items.length > 0).length, [answers])
  const progress = answered * 10

  const selectAnswer = (question: Question, option: string) => {
    if (submitted) return
    setAnswers((current) => {
      if (question.type === 'single') return { ...current, [question.id]: [option] }
      const selected = current[question.id] ?? []
      return { ...current, [question.id]: selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option] }
    })
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  const handleReset = () => {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <main id="top" className="blueprint relative min-h-screen overflow-clip bg-background text-foreground">
      <FloatingEducationIcons />
      <Navbar answered={answered} submitted={submitted} onSubmit={handleSubmit} />

      <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <section className="hero-card mb-12 overflow-hidden rounded-3xl border border-primary/15 bg-card p-6 shadow-[0_22px_65px_rgb(0_0_0/0.22),0_0_45px_var(--glow-soft)] md:p-9 lg:mb-16">
          <div className="flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
            <div className="flex min-w-0 flex-col gap-3">
              <Badge variant="outline" className="w-fit border-primary/35 text-primary"><Sparkles data-icon="inline-start" />Quiz &apos;em on anything.</Badge>
              <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-5xl">Python Fundamentals</h1>
              <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">Test your core Python knowledge across syntax, data structures, operators, and package tools.</p>
            </div>
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 xl:max-w-xl">
              {[['Difficulty', 'Medium'], ['Questions', '10'], ['Mode', 'Classic'], ['Est. time', '8 mins']].map(([label, value]) => (
                <div key={label} className="min-w-0 rounded-2xl border border-border/65 bg-secondary/30 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="mt-1 font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
          <section className="flex flex-col gap-7 md:gap-8" aria-label="Quiz questions">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                selected={answers[question.id] ?? []}
                submitted={submitted}
                onSelect={(option) => selectAnswer(question, option)}
              />
            ))}
          </section>

          <aside className="hidden lg:sticky lg:top-32 lg:flex lg:flex-col lg:gap-4">
            <Card className="quiz-card">
              <CardHeader><CardTitle className="text-base">Your progress</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-end justify-between"><strong className="text-4xl font-extrabold text-primary">{progress}%</strong><span className="text-xs text-muted-foreground">{submitted ? 'Submitted' : 'Keep going'}</span></div>
                <Progress value={progress} />
                <dl className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Answered</dt><dd className="font-bold">{answered}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Remaining</dt><dd className="font-bold">{10 - answered}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Mode</dt><dd className="font-bold">Classic</dd></div>
                  <div className="flex justify-between"><dt className="flex items-center gap-2 text-muted-foreground"><Clock3 className="size-4" />Time left</dt><dd className="font-bold text-primary">07:42</dd></div>
                </dl>
                <div><p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Question navigator</p><Navigator answers={answers} submitted={submitted} /></div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Results card — appears at the bottom of the page once the quiz is submitted */}
        {submitted && (
          <div className="mt-10 md:mt-12">
            <ResultsCard answers={answers} />
          </div>
        )}
      </div>

      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-2xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-xl md:bottom-6 md:right-6">
        <Button variant="ghost" size="sm" className="hidden sm:inline-flex"><Save data-icon="inline-start" />Save</Button>
        <Button variant="ghost" size="sm" onClick={handleReset}><RotateCcw data-icon="inline-start" />Reset</Button>
        <Button size="sm" className="quiz-glow" onClick={handleSubmit} disabled={submitted}>
          <Send data-icon="inline-start" />
          {submitted ? 'Submitted' : 'Submit Quiz'}
        </Button>
      </div>
      <div className="pointer-events-none fixed bottom-8 left-8 hidden text-primary/10 xl:block"><BookOpen className="size-20" aria-hidden="true" /></div>
    </main>
  )
}
