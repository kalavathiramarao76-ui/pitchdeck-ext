// Content script - self-contained (no imports, runs as IIFE in page context)
const API_URL = 'https://sai.sharedllm.com/v1/chat/completions'
const MODEL = 'gpt-oss:120b'

async function callAI(systemMsg: string, userMsg: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: `You are PitchDeck AI, an expert startup advisor. ${systemMsg}` },
        { role: 'user', content: userMsg },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

function extractCompanyData(): string {
  const host = window.location.hostname

  if (host.includes('crunchbase.com')) {
    const name = document.querySelector('h1')?.textContent?.trim() ?? ''
    const desc =
      document.querySelector('[class*="description"]')?.textContent?.trim() ??
      document.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''
    const fields = Array.from(document.querySelectorAll('[class*="field-type"]'))
      .map((el) => el.textContent?.trim())
      .filter(Boolean)
      .join('\n')
    return `Company: ${name}\n${desc}\n${fields}`
  }

  if (host.includes('angellist.com') || host.includes('angel.co')) {
    const name = document.querySelector('h1')?.textContent?.trim() ?? ''
    const tagline = document.querySelector('[class*="tagline"], [class*="pitch"]')?.textContent?.trim() ?? ''
    const details = Array.from(document.querySelectorAll('[class*="detail"], [class*="stat"]'))
      .map((el) => el.textContent?.trim())
      .filter(Boolean)
      .join('\n')
    return `Company: ${name}\nTagline: ${tagline}\n${details}`
  }

  return `Page: ${document.title}\n${document.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''}`
}

function createPitchButton() {
  if (document.getElementById('pitchdeck-ai-btn')) return

  const btn = document.createElement('button')
  btn.id = 'pitchdeck-ai-btn'
  btn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
    <span>Generate Pitch</span>
  `
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '999999',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 18px',
    background: 'linear-gradient(135deg, #d97706, #f59e0b)',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    transition: 'all 0.2s',
  })

  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-2px)'
    btn.style.boxShadow = '0 6px 24px rgba(245,158,11,0.5)'
  })
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0)'
    btn.style.boxShadow = '0 4px 20px rgba(245,158,11,0.4)'
  })

  btn.addEventListener('click', handleGenerate)
  document.body.appendChild(btn)
}

async function handleGenerate() {
  const btn = document.getElementById('pitchdeck-ai-btn')
  if (!btn) return

  btn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" style="animation:pitchdeck-spin 1s linear infinite;flex-shrink:0">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.3"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
    <span>Generating...</span>
  `

  if (!document.getElementById('pitchdeck-spin-style')) {
    const style = document.createElement('style')
    style.id = 'pitchdeck-spin-style'
    style.textContent = '@keyframes pitchdeck-spin{to{transform:rotate(360deg)}}'
    document.head.appendChild(style)
  }

  try {
    const data = extractCompanyData()
    const result = await callAI(
      'Based on the following company data extracted from a startup profile page, generate a quick pitch deck outline with key points for each slide. Be specific using the actual company data provided.',
      data
    )
    showResultModal(result)
  } catch (err) {
    showResultModal(`Error: ${err instanceof Error ? err.message : 'Failed to generate pitch'}`)
  } finally {
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span>Generate Pitch</span>
    `
  }
}

function showResultModal(content: string) {
  const existing = document.getElementById('pitchdeck-ai-modal')
  if (existing) existing.remove()

  const overlay = document.createElement('div')
  overlay.id = 'pitchdeck-ai-modal'
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.7)',
    zIndex: '9999999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  })

  const modal = document.createElement('div')
  Object.assign(modal.style, {
    background: '#1a1a1a',
    borderRadius: '16px',
    border: '1px solid #333',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
  })

  const header = document.createElement('div')
  Object.assign(header.style, {
    padding: '16px 20px',
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  })
  header.innerHTML = `<span style="color:#f59e0b;font-weight:700;font-size:14px">PitchDeck AI - Generated Pitch</span>`

  const closeBtn = document.createElement('button')
  Object.assign(closeBtn.style, {
    background: '#252525',
    border: '1px solid #333',
    color: '#999',
    borderRadius: '6px',
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: '12px',
  })
  closeBtn.textContent = 'Close'
  closeBtn.onclick = () => overlay.remove()
  header.appendChild(closeBtn)

  const body = document.createElement('div')
  Object.assign(body.style, {
    padding: '20px',
    overflowY: 'auto',
    color: '#e5e5e5',
    fontSize: '13px',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap',
  })
  body.textContent = content

  const footer = document.createElement('div')
  Object.assign(footer.style, {
    padding: '12px 20px',
    borderTop: '1px solid #333',
    display: 'flex',
    justifyContent: 'flex-end',
  })
  const copyBtn = document.createElement('button')
  Object.assign(copyBtn.style, {
    background: 'linear-gradient(135deg, #d97706, #f59e0b)',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
  })
  copyBtn.textContent = 'Copy to Clipboard'
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(content)
    copyBtn.textContent = 'Copied!'
    setTimeout(() => { copyBtn.textContent = 'Copy to Clipboard' }, 2000)
  }
  footer.appendChild(copyBtn)

  modal.append(header, body, footer)
  overlay.appendChild(modal)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove()
  })
  document.body.appendChild(overlay)
}

// Initialize
createPitchButton()
