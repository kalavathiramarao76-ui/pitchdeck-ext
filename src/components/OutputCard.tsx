import { useState } from 'react'

interface OutputCardProps {
  title: string
  content: string
  loading?: boolean
}

export default function OutputCard({ title, content, loading }: OutputCardProps) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <svg className="animate-spin h-4 w-4 text-amber-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm text-amber-400">Generating {title}...</span>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-dark-600 rounded w-full" />
          <div className="h-3 bg-dark-600 rounded w-5/6" />
          <div className="h-3 bg-dark-600 rounded w-4/6" />
        </div>
      </div>
    )
  }

  if (!content) return null

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-dark-600">
        <span className="text-xs font-medium text-amber-400">{title}</span>
        <button
          onClick={copy}
          className="text-[11px] px-2.5 py-1 bg-dark-700 hover:bg-dark-600 text-neutral-400 hover:text-white rounded-md transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 text-sm leading-relaxed text-neutral-200 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
        {content}
      </div>
    </div>
  )
}
