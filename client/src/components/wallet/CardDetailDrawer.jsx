import { useNavigate } from 'react-router-dom'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { getBalanceByAccountId, getCardBrandByAccountId } from '@/api/accounts'
import rewardsConfig from '@/lib/rewardsConfig'

const categoryLabels = {
  dining:     'Dining',
  travel:     'Travel & Rideshare',
  apple_tech: 'Apple & Tech',
  groceries:  'Groceries',
  shopping:   'Shopping',
}

const networkColors = {
  visa:       'text-blue-300',
  mastercard: 'text-orange-300',
}

function MultiplierPill({ value }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/20 text-xs font-semibold tabular">
      {value}x
    </span>
  )
}

function RewardRules({ config }) {
  const rules = config.reward_rules ?? []

  return (
    <div className="space-y-2">
      {rules.map(rule => (
        <div key={rule.category} className="flex items-center justify-between">
          <span className="text-sm text-foreground/70">{categoryLabels[rule.category] ?? rule.category}</span>
          <MultiplierPill value={rule.multiplier} />
        </div>
      ))}
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground/50">Everything else</span>
        <MultiplierPill value={config.base_multiplier} />
      </div>
    </div>
  )
}

export default function CardDetailDrawer({ account, onClose }) {
  const navigate = useNavigate()
  const open = !!account

  if (!account || account.type !== 'liability') return null

  const balance = getBalanceByAccountId(account.id)
  const cardBrand = getCardBrandByAccountId(account.id)
  const brand = cardBrand?.brands?.[0]
  const config = rewardsConfig[brand?.card_product_id]

  const balanceFormatted = balance
    ? (balance.amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : '—'

  const pointValueLabel = config
    ? `${config.points_value_cents}¢ per point`
    : null

  const effectiveCashBack = config
    ? `Up to ${((config.reward_rules[0]?.multiplier ?? config.base_multiplier) * config.points_value_cents).toFixed(2)}% cash back`
    : null

  return (
    <Sheet open={open} onOpenChange={val => { if (!val) onClose() }}>
      <SheetContent className="w-80 sm:w-96 glass-strong border-l border-white/10 p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-5">
          <SheetTitle className="text-base font-semibold text-foreground/90">
            {brand?.name ?? account.liability?.name}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {brand?.issuer ?? ''} · ···· {account.liability?.mask} · {brand?.network?.toUpperCase()}
          </SheetDescription>
        </SheetHeader>

        <Separator className="opacity-20" />

        {/* Balance */}
        <div className="px-6 py-5 space-y-1">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Current Balance</p>
          <p className="text-3xl font-semibold tabular">{balanceFormatted}</p>
          <p className="text-xs text-muted-foreground">March 2026 statement</p>
        </div>

        <Separator className="opacity-20" />

        {/* Rewards info */}
        {config && (
          <div className="px-6 py-5 space-y-4">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3">Rewards Program</p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/60">Currency</span>
                  <span className="text-sm text-foreground/85 font-medium">{config.points_currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/60">Point value</span>
                  <span className="text-sm text-foreground/85 font-medium">{pointValueLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/60">Best rate</span>
                  <span className="text-sm text-emerald-400 font-medium">{effectiveCashBack}</span>
                </div>
              </div>
            </div>

            <Separator className="opacity-15" />

            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3">Earn Rates</p>
              <RewardRules config={config} />
            </div>
          </div>
        )}

        <Separator className="opacity-20" />

        {/* Action */}
        <div className="px-6 py-5">
          <button
            onClick={() => {
              onClose()
              navigate(`/transactions?account=${account.id}`)
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/25 text-primary text-sm font-medium transition-colors"
          >
            View Transactions
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
