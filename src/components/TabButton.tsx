interface TabButtonProps {
  label: string
  icon: string
  active: boolean
  onClick: () => void
}

export default function TabButton({ label, icon, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
        active
          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
          : 'text-neutral-400 hover:text-neutral-200 hover:bg-dark-700 border border-transparent'
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  )
}
