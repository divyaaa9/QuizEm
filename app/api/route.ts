import { NextRequest, NextResponse } from 'next/server';

// ---- Types ----
type QuizQuestion = {
  question: string;
  options: string[];
  answer: number; // index of correct option
};

type QuizResult = {
  questions: QuizQuestion[];
};

// ---- Shared prompt builder ----
function buildPrompt(topic: string, count: number, difficulty: string) {
  return `Create a ${count}-question multiple choice quiz about "${topic}" at ${difficulty} difficulty.
Respond ONLY with valid JSON, no markdown, no commentary, in this exact shape:
{"questions":[{"question":"...","options":["A","B","C","D"],"answer":0}]}
"answer" must be the index (0-3) of the correct option.`;
}

function parseQuizJSON(text: string): QuizResult {
  const clean = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);
  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error('Malformed quiz JSON: missing questions array');
  }
  return parsed;
}

// ---- Provider 1: Anthropic (Claude) ----
async function tryAnthropic(topic: string, count: number, difficulty: string): Promise<QuizResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: buildPrompt(topic, count, difficulty) }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic failed: ${res.status}`);
  const data = await res.json();
  return parseQuizJSON(data.content[0].text);
}

// ---- Provider 2: OpenAI ----
async function tryOpenAI(topic: string, count: number, difficulty: string): Promise<QuizResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: buildPrompt(topic, count, difficulty) }],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI failed: ${res.status}`);
  const data = await res.json();
  return parseQuizJSON(data.choices[0].message.content);
}

// ---- Provider 3: Google Gemini ----
async function tryGemini(topic: string, count: number, difficulty: string): Promise<QuizResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(topic, count, difficulty) }] }],
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini failed: ${res.status}`);
  const data = await res.json();
  return parseQuizJSON(data.candidates[0].content.parts[0].text);
}

// ---- The fallback chain ----
// Order matters: put your primary/cheapest/most-reliable provider first.
// Add or remove providers here freely — nothing else needs to change.
const PROVIDERS: {
  name: string;
  run: (topic: string, count: number, difficulty: string) => Promise<QuizResult>;
}[] = [
  { name: 'anthropic', run: tryAnthropic },
  { name: 'openai', run: tryOpenAI },
  { name: 'gemini', run: tryGemini },
];

export async function POST(req: NextRequest) {
  const { topic, count = 10, difficulty = 'Medium' } = await req.json();

  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
  }

  const errors: string[] = [];

  for (const provider of PROVIDERS) {
    try {
      const quiz = await provider.run(topic, count, difficulty);
      // success — tag which provider served it (handy for debugging/logs)
      return NextResponse.json({ ...quiz, _provider: provider.name });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`${provider.name}: ${message}`);
      // fall through to the next provider automatically
    }
  }

  // every provider failed
  return NextResponse.json(
    { error: 'All quiz providers failed', details: errors },
    { status: 502 }
  );
}
