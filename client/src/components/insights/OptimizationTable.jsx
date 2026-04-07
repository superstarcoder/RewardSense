import { useState, useEffect, useRef } from 'react'
import { ChevronDown, CheckCircle2, Utensils, Car, Laptop, ShoppingCart, ShoppingBag } from 'lucide-react'
import CategoryBadge from '@/components/transactions/CategoryBadge'

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(cents) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const categoryIcons = {
  dining:     Utensils,
  travel:     Car,
  apple_tech: Laptop,
  groceries:  ShoppingCart,
  shopping:   ShoppingBag,
}

const cardDots = {
  cp_chase_sapphire_preferred: 'bg-blue-400',
  cp_apple_card:               'bg-slate-300',
  cp_citi_double_cash:         'bg-teal-400',
}

// ─── progress bar ────────────────────────────────────────────────────────────

function ProgressBar({ pct, delay = 0 }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay)
    return () => clearTimeout(t)
  }, [pct, delay])

  return (
    <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function shortName(name = '') {
  return name
    .replace('Chase Sapphire Preferred', 'Chase Sapphire')
    .replace('Citi Double Cash Card', 'Citi Double Cash')
}

// ─── expanded transaction list ───────────────────────────────────────────────

function CategoryTxnList({ transactions }) {
  return (
    <div className="border-t border-white/8 bg-white/3 divide-y divide-white/5">
      {transactions.map(txn => {
        const isOptimal = txn.is_optimal

        return (
          <div key={txn.id} className="px-5 py-4 hover:bg-white/3 transition-colors">
            {/* Top row: merchant + amount */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-sm font-medium text-foreground/85">{txn.merchant_name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{fmtDate(txn.transacted_at)}</p>
              </div>
              <p className="text-sm font-medium tabular text-foreground/80 shrink-0">{fmt(txn.amount_cents)}</p>
            </div>

            {/* Card comparison */}
            <div className="space-y-1.5">
              {/* Card used */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${cardDots[txn.card_product_id] ?? 'bg-white/30'}`} />
                  <span className="text-xs text-muted-foreground truncate">
                    {shortName(txn.card_name)}
                    <span className="text-muted-foreground/50 ml-1">({txn.multiplier_used}x)</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-xs">
                  <span className="text-muted-foreground tabular">{txn.points_earned.toLocaleString()} pts</span>
                  <span className="text-foreground/60 tabular font-medium w-14 text-right">{fmt(txn.value_cents_earned)}</span>
                </div>
              </div>

              {/* Better card (only when not optimal) */}
              {!isOptimal && (
                <div className="flex items-center justify-between gap-3 rounded-lg bg-emerald-500/8 border border-emerald-500/15 px-2.5 py-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${cardDots[txn.optimal_card_product_id] ?? 'bg-white/30'}`} />
                    <span className="text-xs text-emerald-300 truncate">
                      {shortName(txn.optimal_card_name)}
                      <span className="text-emerald-400/60 ml-1">({txn.optimal_multiplier}x)</span>
                    </span>
                    <span className="text-[10px] text-emerald-500/70 uppercase tracking-wider shrink-0">Better</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-xs">
                    <span className="text-emerald-400/60 tabular">{txn.optimal_points.toLocaleString()} pts</span>
                    <span className="text-emerald-400 tabular font-medium w-14 text-right">{fmt(txn.optimal_value_cents)}</span>
                  </div>
                </div>
              )}

              {/* Already optimal */}
              {isOptimal && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400/70">
                  <CheckCircle2 size={12} strokeWidth={1.75} />
                  <span>Optimal card used</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── single category row ─────────────────────────────────────────────────────

function CategoryRow({ cat, index }) {
  const [open, setOpen] = useState(false)
  const pct = Math.round((cat.actual.total_value_cents / cat.optimal_value_cents) * 100)
  const isMissed = cat.missed_value_cents > 0
  const Icon = categoryIcons[cat.group] ?? ShoppingBag

  return (
    <div className="border-b border-white/8 last:border-0">
      {/* Main row */}
      <button
        onClick={() => setOpen(v => !v)}
        className="group/row w-full text-left px-3 sm:px-5 py-4 hover:bg-white/4 transition-colors relative"
      >
        {/* Left accent bar slides in on hover */}
        <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary/60 scale-y-0 group-hover/row:scale-y-100 transition-transform duration-200 origin-center" />
        <div className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-3 sm:gap-6">

          {/* Category icon + label */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 sm:min-w-[130px]">
            <div className="p-1.5 rounded-lg bg-white/8 text-muted-foreground shrink-0">
              <Icon size={14} strokeWidth={1.75} />
            </div>
            <span className="text-sm font-medium text-foreground/85 truncate">{cat.label}</span>
          </div>

          {/* Spend + progress bar — hidden on mobile */}
          <div className="hidden sm:block min-w-[140px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground tabular">{fmt(cat.total_spend_cents)}</span>
              <span className="text-xs text-muted-foreground">{pct}% optimal</span>
            </div>
            <ProgressBar pct={pct} delay={index * 80} />
          </div>

          {/* Best card pill — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
            <span className={`w-1.5 h-1.5 rounded-full ${cardDots[cat.optimal.card_product_id] ?? 'bg-white/30'}`} />
            {cat.optimal.card_name
              .replace('Chase Sapphire Preferred', 'Chase Sapphire')
              .replace('Citi Double Cash Card', 'Citi Double Cash')}
            <span className="text-muted-foreground/50">({cat.optimal.multiplier}x)</span>
          </div>

          {/* Earned value */}
          <div className="text-right min-w-[58px] sm:min-w-[70px]">
            <span className="text-sm font-medium tabular text-emerald-400">{fmt(cat.actual.total_value_cents)}</span>
          </div>

          {/* Missed value */}
          <div className="text-right min-w-[58px] sm:min-w-[70px]">
            {isMissed ? (
              <span className="text-sm font-medium tabular text-orange-400">{fmt(cat.missed_value_cents)}</span>
            ) : (
              <span className="flex items-center justify-end gap-1 text-emerald-400">
                <CheckCircle2 size={14} strokeWidth={1.75} />
                <span className="text-xs font-medium hidden sm:inline">Optimal</span>
              </span>
            )}
          </div>

          {/* Chevron */}
          <ChevronDown
            size={15}
            strokeWidth={1.75}
            className={`text-muted-foreground/50 transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Accordion expanded content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[2000px]' : 'max-h-0'}`}
      >
        <CategoryTxnList transactions={cat.transactions} />
      </div>
    </div>
  )
}

// ─── main table ──────────────────────────────────────────────────────────────

export default function OptimizationTable({ byCategory }) {
  // Sort: missed value descending, so worst offenders are at top
  const sorted = [...byCategory].sort((a, b) => b.missed_value_cents - a.missed_value_cents)

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Table header */}
      <div className="px-3 sm:px-5 py-3 border-b border-white/8 grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-3 sm:gap-6">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium sm:min-w-[130px]">Category</span>
        <span className="hidden sm:block text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Spend · Efficiency</span>
        <span className="hidden sm:block text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Best Card</span>
        <span className="text-[10px] text-emerald-400/70 uppercase tracking-wider font-medium text-right min-w-[58px] sm:min-w-[70px]">Earned</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium text-right min-w-[58px] sm:min-w-[70px]">Missed</span>
        <span className="w-[15px]" />
      </div>

      {sorted.map((cat, i) => (
        <CategoryRow key={cat.group} cat={cat} index={i} />
      ))}
    </div>
  )
}
