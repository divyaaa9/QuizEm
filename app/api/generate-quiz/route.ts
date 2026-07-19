import { NextRequest, NextResponse } from 'next/server';

// ---- Types ----
type QuizQuestion = {
  question: string;
  options: string[];
  answer: number; // index of correct option
  explanation: string; // short reason the answer is correct
};

type QuizResult = {
  questions: QuizQuestion[];
};

// ---- Shared prompt builder ----
function buildPrompt(topic: string, count: number, difficulty: string) {
  return `Create a ${count}-question multiple choice quiz about "${topic}" at ${difficulty} difficulty.
Respond ONLY with valid JSON, no markdown, no commentary, no code fences, in this exact shape:
{"questions":[{"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}]}
"answer" must be the index (0-3) of the correct option.
"explanation" is a 1-2 sentence reason the correct answer is right, written for someone learning the topic.
Return exactly ${count} questions.`;
}

function parseQuizJSON(text: string): QuizResult {
  const clean = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  const parsed = JSON.parse(clean);
  if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('Malformed quiz JSON: missing or empty questions array');
  }
  return parsed;
}

// ---- Provider 1: Google Gemini (primary — free, no card, generous daily quota) ----
async function tryGemini(topic: string, count: number, difficulty: string): Promise<QuizResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(topic, count, difficulty) }] }],
        generationConfig: {
          temperature: 0.8,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini failed: ${res.status} ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no text content');
  return parseQuizJSON(text);
}

// ---- Provider 2: Groq (fallback — free, fast, OpenAI-compatible endpoint) ----
async function tryGroq(topic: string, count: number, difficulty: string): Promise<QuizResult> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY not set');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: buildPrompt(topic, count, difficulty) }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Groq failed: ${res.status} ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq returned no message content');
  return parseQuizJSON(text);
}

// ---- The fallback chain ----
// Gemini first (better model quality, generous free daily quota),
// Groq second (kicks in automatically if Gemini is rate-limited or down).
// Add more providers later just by writing one more tryX function and
// adding it to this array — nothing else needs to change.
const PROVIDERS: {
  name: string;
  run: (topic: string, count: number, difficulty: string) => Promise<QuizResult>;
}[] = [
  { name: 'gemini', run: tryGemini },
  { name: 'groq', run: tryGroq },
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
      return NextResponse.json({ ...quiz, _provider: provider.name });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[generate-quiz] ${provider.name} failed:`, message);
      errors.push(`${provider.name}: ${message}`);
      // falls through to the next provider automatically
    }
  }

  return NextResponse.json(
    { error: 'All quiz providers failed', details: errors },
    { status: 502 }
  );
}
