const groupStyles = {
  dining:        'bg-orange-500/12 text-orange-300 border-orange-500/20',
  travel:        'bg-sky-500/12 text-sky-300 border-sky-500/20',
  apple_tech:    'bg-violet-500/12 text-violet-300 border-violet-500/20',
  groceries:     'bg-emerald-500/12 text-emerald-300 border-emerald-500/20',
  shopping:      'bg-pink-500/12 text-pink-300 border-pink-500/20',
  entertainment: 'bg-yellow-500/12 text-yellow-300 border-yellow-500/20',
  gas:           'bg-red-500/12 text-red-300 border-red-500/20',
  other:         'bg-white/8 text-white/40 border-white/10',
}

export default function CategoryBadge({ label, group }) {
  const styles = groupStyles[group] ?? groupStyles.other

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${styles}`}>
      {label}
    </span>
  )
}
