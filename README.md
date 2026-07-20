# QuizEm 🧠✨

**Quiz 'em on anything.** QuizEm turns any topic you can type into a custom, AI-generated
multiple-choice quiz — in seconds.

---

## What it does

1. Type a topic — React, World War II, DBMS, Python, literally anything
2. Pick your difficulty, question count, and mode
3. QuizEm generates a fresh quiz using AI, tailored to your topic and difficulty
4. Take the quiz, get instant feedback with explanations, and see your score
5. Sign in to save your quiz history and favorite quizzes for later

## Features

- 🤖 **AI-generated quizzes on any topic** — powered by Google Gemini, with an automatic
  fallback to Groq/Llama if the primary provider is unavailable
- 🎮 **Three quiz modes**
  - **Classic** — no pressure, no timer
  - **Timed** — a stopwatch tracks how long you take
  - **Survival** — pick a 3/5/10-minute limit; the quiz auto-submits when time runs out
- 🔐 **Sign in with Google or email** — powered by Clerk
- 📚 **Quiz history** — your last 5 attempts, automatically tracked
- ⭐ **Save quizzes** — bookmark a quiz to retake anytime from your profile
- 🎨 A fully custom, animated, dark-themed UI built with Tailwind CSS v4

## Tech Stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) + TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui components |
| **Animation** | Motion |
| **AI** | Google Gemini (primary), Groq / Llama 3.3 (fallback) |
| **Auth** | Clerk |
| **Database** | Supabase (Postgres) |
| **Package manager** | pnpm |

## Getting Started

### Prerequisites
- Node.js 18+
- A [Gemini API key](https://aistudio.google.com) (free)
- A [Groq API key](https://console.groq.com) (free)
- A [Clerk](https://clerk.com) application (free tier)
- A [Supabase](https://supabase.com) project (free tier)

### Installation

```bash
git clone <your-repo-url>
cd QuizEm
pnpm install
```

### Environment variables

Create a `.env.local` file in the project root:

```
GEMINI_API_KEY=
GROQ_API_KEY=

CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Database setup

In your Supabase project's SQL Editor, run the schema in [`schema.sql`](./schema.sql) to
create the `quiz_history` and `saved_quizzes` tables.

### Run locally

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── page.tsx                 # Homepage — enter a topic, pick settings
├── generating/page.tsx      # Calls the AI, shows a loading state
├── quiz/page.tsx            # Take the quiz, see results
├── profile/page.tsx         # "My Quizzes" — history + saved quizzes
└── api/
    ├── generate-quiz/       # AI quiz generation (Gemini → Groq fallback)
    ├── quiz-history/        # Read/write recent quiz attempts
    └── saved-quizzes/       # Read/write/delete saved quizzes

components/
├── hero-quiz-creator.tsx    # Homepage topic/settings form
├── quiz-page.tsx            # The quiz-taking UI, all 3 modes
├── site-header.tsx          # Nav bar with Clerk sign-in
└── ui/                      # shadcn/ui primitives

lib/
└── supabase.ts               # Supabase server client
```

## How quiz generation works

1. The Generating page sends the topic, difficulty, and question count to
   `/api/generate-quiz`
2. That route tries **Gemini** first; if it fails (rate limit, timeout, bad response), it
   automatically retries with **Groq** — no user-facing failure unless both are down
3. The AI returns strict JSON (question, options, correct answer, explanation), which gets
   transformed into the quiz format and handed to the Quiz page

## License

This project was built as a learning project. Feel free to explore the code.
