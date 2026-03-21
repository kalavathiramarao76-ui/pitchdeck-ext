import { useState } from 'react'
import { callAI, systemPrompt } from '../utils/api'
import { ELEVATOR_PITCH_PROMPT } from '../utils/prompts'

export default function Popup() {
  const [name, setName] = useState('')
  const [oneLiner, setOneLiner] = useState('')
  const [pitch, setPitch] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!name.trim() || !oneLiner.trim()) return
    setLoading(true)
    setPitch('')
    try {
      const result = await callAI([
        systemPrompt(ELEVATOR_PITCH_PROMPT),
        { role: 'user', content: `Startup: ${name}\nOne-liner: ${oneLiner}` },
      ])
      setPitch(result)
    } catch (err) {
      setPitch(`Error: ${err instanceof Error ? err.message : 'Failed to generate'}`)
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(pitch)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openSidePanel = () => {
    chrome.windows.getCurrent((w) => {
      chrome.runtime.sendMessage({ type: 'OPEN_SIDEPANEL', windowId: w.id })
    })
  }

  return (
    <div className="w-[380px] min-h-[420px] bg-dark-900 text-neutral-100 p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-amber-500/20 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-white">PitchDeck AI</h1>
            <p className="text-[11px] text-neutral-500">Quick Elevator Pitch</p>
          </div>
        </div>
        <button
          onClick={openSidePanel}
          className="text-[11px] px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-amber-400 rounded-md transition-colors border border-dark-600"
        >
          Full Workspace &rarr;
        </button>
      </div>

      {/* Form */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs text-neutral-400 mb-1 block">Startup Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Stripe, Notion..."
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-400 mb-1 block">One-Liner</label>
          <textarea
            value={oneLiner}
            onChange={(e) => setOneLiner(e.target.value)}
            placeholder="Describe your startup in one sentence..."
            rows={2}
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
          />
        </div>
      </div>

      <button
        onClick={generate}
        disabled={loading || !name.trim() || !oneLiner.trim()}
        className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-900 font-semibold text-sm rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </>
        ) : (
          'Generate 30s Pitch'
        )}
      </button>

      {/* Output */}
      {pitch && (
        <div className="mt-4 flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-amber-400 font-medium">Your Elevator Pitch</span>
            <button
              onClick={copy}
              className="text-[11px] px-2 py-1 bg-dark-700 hover:bg-dark-600 text-neutral-400 hover:text-white rounded transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-lg p-3.5 text-sm leading-relaxed text-neutral-200 max-h-[200px] overflow-y-auto">
            {pitch}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-dark-700 flex items-center justify-between">
        <span className="text-[10px] text-neutral-600">Powered by AI</span>
        <span className="text-[10px] text-amber-500/60">v1.0</span>
      </div>
    </div>
  )
}
