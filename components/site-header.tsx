"use client"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Show, SignInButton, UserButton } from "@clerk/nextjs"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/40">
            <Sparkles className="size-5" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">QuizEm</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#trending" className="transition-colors hover:text-foreground">
            Trending
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#preview" className="transition-colors hover:text-foreground">
            Preview
          </a>
          <Show when="signed-in">
            <Link href="/profile" className="transition-colors hover:text-foreground">
              My Quizzes
            </Link>
          </Show>
        </nav>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-full border border-border bg-card/60 px-5 py-2 text-sm font-semibold backdrop-blur transition-all hover:border-primary/60 hover:bg-card">
                Sign in
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  )
}