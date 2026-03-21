import { useState } from 'react'
import TabButton from '../components/TabButton'
import OutputCard from '../components/OutputCard'
import { callAI, systemPrompt } from '../utils/api'
import {
  DECK_SLIDES,
  SLIDE_WRITER_PROMPT,
  INVESTOR_EMAIL_PROMPT,
  PITCH_SCRIPT_PROMPT,
  COMPETITION_MATRIX_PROMPT,
} from '../utils/prompts'

type Tab = 'deck' | 'slide' | 'email' | 'script' | 'matrix'

export default function SidePanel() {
  const [tab, setTab] = useState<Tab>('deck')
  const [startup, setStartup] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSlide, setSelectedSlide] = useState(0)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async (taskPrompt: string, userMsg: string) => {
    setLoading(true)
    setOutput('')
    try {
      const result = await callAI([
        systemPrompt(taskPrompt),
        { role: 'user', content: userMsg },
      ])
      setOutput(result)
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : 'Generation failed'}`)
    } finally {
      setLoading(false)
    }
  }

  const ctx = `Startup: ${startup}\nDescription: ${description}`

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'deck', label: 'Full Deck', icon: '\u25A6' },
    { id: 'slide', label: 'Slide Writer', icon: '\u270E' },
    { id: 'email', label: 'Investor Email', icon: '\u2709' },
    { id: 'script', label: 'Pitch Script', icon: '\u2399' },
    { id: 'matrix', label: 'Competition', icon: '\u29C9' },
  ]

  const outputTitles: Record<Tab, string> = {
    deck: '10-Slide Pitch Deck',
    slide: `Slide: ${DECK_SLIDES[selectedSlide]}`,
    email: 'Investor Email',
    script: 'Pitch Script',
    matrix: 'Competition Matrix',
  }

  return (
    <div className="h-screen bg-dark-900 text-neutral-100 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-dark-700 flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">PitchDeck AI</h1>
          <p className="text-[10px] text-neutral-500">Full Workspace</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2.5 border-b border-dark-700 flex gap-1.5 overflow-x-auto shrink-0">
        {tabs.map((t) => (
          <TabButton
            key={t.id}
            label={t.label}
            icon={t.icon}
            active={tab === t.id}
            onClick={() => { setTab(t.id); setOutput('') }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Startup info */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Startup Name</label>
            <input
              value={startup}
              onChange={(e) => setStartup(e.target.value)}
              placeholder="Your startup name"
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">
              {tab === 'matrix' ? 'Startup + Competitors (comma separated)' : 'Description / Details'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                tab === 'matrix'
                  ? 'Describe your startup and list competitors...'
                  : 'Describe your startup, market, traction...'
              }
              rows={3}
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
            />
          </div>
        </div>

        {/* Slide selector for slide writer */}
        {tab === 'slide' && (
          <div>
            <label className="text-xs text-neutral-400 mb-2 block">Select Slide</label>
            <div className="grid grid-cols-2 gap-1.5">
              {DECK_SLIDES.map((slide, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSlide(i)}
                  className={`text-left text-xs px-2.5 py-2 rounded-lg transition-all ${
                    selectedSlide === i
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-dark-800 text-neutral-400 hover:text-neutral-200 border border-dark-600 hover:border-dark-500'
                  }`}
                >
                  <span className="text-neutral-600 mr-1">{i + 1}.</span> {slide}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generate */}
        <button
          onClick={() => {
            const prompts: Record<Tab, string> = {
              deck: `Generate a complete 10-slide pitch deck. For each of these slides: ${DECK_SLIDES.join(', ')}. Provide detailed content, key points, and suggested data/metrics.`,
              slide: `${SLIDE_WRITER_PROMPT}\n\nSlide: ${DECK_SLIDES[selectedSlide]}`,
              email: INVESTOR_EMAIL_PROMPT,
              script: PITCH_SCRIPT_PROMPT,
              matrix: COMPETITION_MATRIX_PROMPT,
            }
            run(prompts[tab], ctx)
          }}
          disabled={loading || !startup.trim()}
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
            `Generate ${outputTitles[tab]}`
          )}
        </button>

        {/* Output */}
        <OutputCard title={outputTitles[tab]} content={output} loading={loading && !output} />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-dark-700 flex items-center justify-between shrink-0">
        <span className="text-[10px] text-neutral-600">PitchDeck AI v1.0</span>
        <span className="text-[10px] text-amber-500/60">Powered by AI</span>
      </div>
    </div>
  )
}
