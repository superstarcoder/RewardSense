import { TrendingUp, CreditCard, AlertCircle } from 'lucide-react'

function fmt(cents) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
}

function StatCard({ icon: Icon, label, value, sub, variant = 'neutral' }) {
  const variants = {
    neutral: {
      border:  'border-white/10',
      icon:    'bg-white/8 text-muted-foreground',
      accent:  'bg-white/5',
      value:   'text-foreground',
    },
    positive: {
      border:  'border-emerald-500/20',
      icon:    'bg-emerald-500/12 text-emerald-400',
      accent:  'bg-emerald-500/5',
      value:   'text-emerald-300',
    },
    warning: {
      border:  'border-orange-500/25',
      icon:    'bg-orange-500/12 text-orange-400',
      accent:  'bg-orange-500/5',
      value:   'text-orange-300',
    },
  }

  const v = variants[variant]

  return (
    <div
      className={`card-scale group relative glass rounded-2xl p-6 border overflow-hidden cursor-default ${v.border}`}
      style={variant === 'warning' ? { animation: 'pulse-ring 2.5s ease-out infinite' } : {}}
    >
      {/* Top accent strip */}
      <div className={`absolute inset-x-0 top-0 h-px transition-opacity duration-300 group-hover:opacity-100 ${variant === 'warning' ? 'bg-gradient-to-r from-transparent via-orange-400/60 to-transparent' : variant === 'positive' ? 'bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-60' : 'bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-60'}`} />

      {/* Background glow — expands on hover */}
      <div className={`absolute -bottom-6 -right-6 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-all duration-300 group-hover:w-40 group-hover:h-40 group-hover:opacity-100 opacity-60 ${v.accent}`} />

      <div className="relative flex items-start gap-4">
        <div className={`p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 ${v.icon}`}>
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
          <p className={`text-2xl sm:text-3xl font-semibold tabular mt-1.5 ${v.value}`}>{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
      </div>
    </div>
  )
}

export default function HeroStats({ summary }) {
  const efficiency = Math.round((summary.actual_value_cents / summary.optimal_value_cents) * 100)

  const upliftPct = Math.round((summary.missed_value_cents / summary.actual_value_cents) * 100)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        icon={CreditCard}
        label="Total Spend"
        value={fmt(summary.total_spend_cents)}
        sub="March 2026 · All cards"
        variant="neutral"
      />
      <StatCard
        icon={TrendingUp}
        label="Rewards Earned"
        value={fmt(summary.actual_value_cents)}
        sub={`${efficiency}% of optimal rewards captured`}
        variant="positive"
      />
      <StatCard
        icon={AlertCircle}
        label="Left on the Table"
        value={fmt(summary.missed_value_cents)}
        sub={`Could've earned a total of ${fmt(summary.optimal_value_cents)} in rewards with optimal routing (${upliftPct}% more)`}
        variant="warning"
      />
    </div>
  )
}
