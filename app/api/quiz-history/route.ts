import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('quiz_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ history: data })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const body = await req.json()
  const { topic, difficulty, mode, score, total, quizData } = body

  const { error: insertError } = await supabaseAdmin.from('quiz_history').insert({
    user_id: userId,
    topic,
    difficulty,
    mode,
    score,
    total,
    quiz_data: quizData,
  })

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  // Keep only the 5 most recent rows for this user — delete anything older.
  const { data: rows, error: fetchError } = await supabaseAdmin
    .from('quiz_history')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (!fetchError && rows && rows.length > 5) {
    const idsToDelete = rows.slice(5).map((r) => r.id)
    await supabaseAdmin.from('quiz_history').delete().in('id', idsToDelete)
  }

  return NextResponse.json({ success: true })
}
