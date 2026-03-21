const API_URL = 'https://sai.sharedllm.com/v1/chat/completions'
const MODEL = 'gpt-oss:120b'

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function callAI(messages: Message[]): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

export function systemPrompt(task: string): Message {
  return {
    role: 'system',
    content: `You are PitchDeck AI, an expert startup advisor and pitch deck consultant. ${task}`,
  }
}
