import { useNavigate } from 'react-router-dom'
import rewardsConfig from '@/lib/rewardsConfig'

// Card visual themes
const cardThemes = {
  cp_chase_sapphire_preferred: {
    gradient:  'from-[#0a1628] via-[#1a3a6e] to-[#0d2654]',
    border:    'border-blue-500/25',
    glow:      'oklch(0.5 0.2 255 / 25%)',
    glowHover: 'oklch(0.5 0.2 255 / 55%)',
    network:   'VISA',
    dot:       'bg-blue-400',
  },
  cp_apple_card: {
    gradient:  'from-[#1a1a1a] via-[#2d2d2d] to-[#111111]',
    border:    'border-slate-400/20',
    glow:      'oklch(0.7 0 0 / 15%)',
    glowHover: 'oklch(0.7 0 0 / 35%)',
    network:   'MC',
    dot:       'bg-slate-300',
  },
  cp_citi_double_cash: {
    gradient:  'from-[#0a2a2a] via-[#0f3f3f] to-[#072222]',
    border:    'border-teal-500/25',
    glow:      'oklch(0.6 0.15 185 / 25%)',
    glowHover: 'oklch(0.6 0.15 185 / 55%)',
    network:   'MC',
    dot:       'bg-teal-400',
  },
}

const categoryLabels = {
  dining:     'Dining',
  travel:     'Travel & Rideshare',
  apple_tech: 'Apple & Tech',
  groceries:  'Groceries',
  shopping:   'Shopping',
}

const groupColors = {
  dining:     'bg-orange-500/12 text-orange-300 border-orange-500/20',
  travel:     'bg-sky-500/12 text-sky-300 border-sky-500/20',
  apple_tech: 'bg-violet-500/12 text-violet-300 border-violet-500/20',
  groceries:  'bg-emerald-500/12 text-emerald-300 border-emerald-500/20',
  shopping:   'bg-pink-500/12 text-pink-300 border-pink-500/20',
}

function MiniCard({ config, theme }) {
  return (
    <div
      className={`relative rounded-xl p-3.5 overflow-hidden bg-gradient-to-br transition-transform duration-300 group-hover:scale-[1.03] ${theme.gradient}`}
      style={{
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {/* Shimmer sweep — one-way, only on hover */}
      <div className="shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/40 text-[9px] uppercase tracking-widest">{config.issuer}</p>
          <p className="text-white/85 text-xs font-medium mt-0.5 leading-tight">
            {config.name.replace('Chase Sapphire Preferred', 'Chase Sapphire').replace('Citi Double Cash Card', 'Citi Double Cash')}
          </p>
        </div>
        <span className="text-white/60 text-[10px] font-bold tracking-wider">{theme.network}</span>
      </div>
    </div>
  )
}

function RecommendationCard({ productId, config, bestCategories, byCategory, accountId }) {
  const navigate = useNavigate()
  const theme = cardThemes[productId]
  if (!theme) return null

  const topMultiplier = config.reward_rules.length > 0
    ? config.reward_rules[0].multiplier
    : config.base_multiplier

  const earnLabel = config.reward_rules.length > 0
    ? `Up to ${topMultiplier}x on best categories`
    : `Flat ${config.base_multiplier}x on everything`

  return (
    <div
      className={`card-glow group glass rounded-2xl p-5 border flex flex-col gap-4 ${theme.border}`}
      style={{ '--glow-color': theme.glowHover, boxShadow: `0 0 40px ${theme.glow}` }}
    >
      <MiniCard config={config} theme={theme} />

      <div className="space-y-3">
        {/* Best for */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Best For</p>
          <div className="flex flex-wrap gap-1.5">
            {bestCategories.length > 0 ? (
              bestCategories.map(group => (
                <span
                  key={group}
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${groupColors[group] ?? 'bg-white/8 text-white/40 border-white/10'}`}
                >
                  {categoryLabels[group] ?? group}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">General use</span>
            )}
          </div>
        </div>

        {/* Earn rates */}
        <div className="border-t border-white/8 pt-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Earn Rates</p>
          <div className="space-y-1.5">
            {config.reward_rules.map(rule => {
              const effectivePct = ((rule.multiplier * config.points_value_cents)).toFixed(2)
              return (
                <div key={rule.category} className="flex items-center justify-between">
                  <span className="text-xs text-foreground/60">{categoryLabels[rule.category] ?? rule.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary tabular">{rule.multiplier}x</span>
                    <span className="text-[11px] text-muted-foreground tabular">({effectivePct}%)</span>
                  </div>
                </div>
              )
            })}
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground/40">Everything else</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground tabular">{config.base_multiplier}x</span>
                <span className="text-[11px] text-muted-foreground/60 tabular">({(config.base_multiplier * config.points_value_cents).toFixed(2)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Points currency + value */}
        <div className="flex items-center justify-between border-t border-white/8 pt-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Points</p>
            <p className="text-xs text-foreground/70 mt-0.5">{config.points_currency}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Point Value</p>
            <p className="text-xs text-foreground/70 mt-0.5">{config.points_value_cents}¢ / pt</p>
          </div>
        </div>
      </div>

      {accountId && (
        <button
          onClick={() => navigate(`/transactions?account=${accountId}`)}
          className="mt-auto w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/6 hover:bg-white/10 border border-white/10 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View transactions
        </button>
      )}
    </div>
  )
}

export default function CardRecommendations({ byCategory }) {
  // Derive which categories each card is optimal for
  const cardBestCategories = {}
  for (const cat of byCategory) {
    const cpId = cat.optimal.card_product_id
    if (!cardBestCategories[cpId]) cardBestCategories[cpId] = []
    cardBestCategories[cpId].push(cat.group)
  }

  // Account IDs for "view transactions" links
  const accountIds = {
    cp_chase_sapphire_preferred: 'acc_3f7x9k2p1m',
    cp_apple_card:               'acc_7n4mz8qr5t',
    cp_citi_double_cash:         'acc_2w6vb1hs9y',
  }

  const cardOrder = [
    'cp_chase_sapphire_preferred',
    'cp_apple_card',
    'cp_citi_double_cash',
  ]

  return (
    <div>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Card Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardOrder.map(productId => (
          <RecommendationCard
            key={productId}
            productId={productId}
            config={rewardsConfig[productId]}
            bestCategories={cardBestCategories[productId] ?? []}
            byCategory={byCategory}
            accountId={accountIds[productId]}
          />
        ))}
      </div>
    </div>
  )
}
