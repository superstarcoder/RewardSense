import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { getCardBrandByAccountId } from '@/api/accounts'
import rewardsConfig from '@/lib/rewardsConfig'
import CategoryBadge from './CategoryBadge'

function formatAmount(cents) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function computeRewards(txn, config) {
  if (!config) return null

  const matchingRule = config.reward_rules.find(rule =>
    rule.mcc_codes.includes(txn.merchant_category_code)
  )
  const multiplier = matchingRule?.multiplier ?? config.base_multiplier
  const spendDollars = txn.amount / 100
  const points = spendDollars * multiplier
  const valueCents = points * config.points_value_cents
  const valueDollars = valueCents / 100

  return { multiplier, points, valueDollars, category: matchingRule?.category ?? null }
}

function DetailRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-foreground/50 shrink-0">{label}</span>
      <span className="text-sm text-foreground/85 text-right">{children}</span>
    </div>
  )
}

export default function TransactionDetailDrawer({ txn, onClose }) {
  const open = !!txn
  if (!txn) return null

  const cardBrand = getCardBrandByAccountId(txn.account_id)
  const brand = cardBrand?.brands?.[0]
  const config = rewardsConfig[brand?.card_product_id]
  const rewards = computeRewards(txn, config)

  const cardName = brand?.name ?? 'Unknown Card'

  return (
    <Sheet open={open} onOpenChange={val => { if (!val) onClose() }}>
      <SheetContent className="w-80 sm:w-96 glass-strong border-l border-white/10 p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-5">
          <SheetTitle className="text-base font-semibold text-foreground/90">
            {txn.merchant?.name ?? txn.descriptor}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground font-mono tracking-wide">
            {txn.descriptor}
          </SheetDescription>
        </SheetHeader>

        <Separator className="opacity-20" />

        {/* Amount */}
        <div className="px-6 py-5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Amount</p>
          <p className="text-3xl font-semibold tabular">{formatAmount(txn.amount)}</p>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{txn.status}</p>
        </div>

        <Separator className="opacity-20" />

        {/* Transaction details */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3">Details</p>
          <DetailRow label="Date">{formatDateTime(txn.transacted_at)}</DetailRow>
          <DetailRow label="Time">{formatTime(txn.transacted_at)}</DetailRow>
          <DetailRow label="Category">
            <CategoryBadge label={txn.category_label} group={txn.category_group} />
          </DetailRow>
          <DetailRow label="MCC">
            <span className="font-mono text-xs bg-white/8 border border-white/10 px-1.5 py-0.5 rounded">
              {txn.merchant_category_code}
            </span>
          </DetailRow>
          <DetailRow label="Card">{cardName}</DetailRow>
        </div>

        <Separator className="opacity-20" />

        {/* Rewards earned */}
        {rewards && (
          <div className="px-6 py-5 space-y-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3">Rewards Earned</p>
            <DetailRow label="Earn rate">
              <span className="text-primary font-semibold">{rewards.multiplier}x</span>
              <span className="text-muted-foreground ml-1">{config.points_currency}</span>
            </DetailRow>
            <DetailRow label="Points earned">
              <span className="tabular">{rewards.points.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </DetailRow>
            <DetailRow label="Est. value">
              <span className="text-emerald-400 font-medium tabular">
                {rewards.valueDollars.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
              </span>
            </DetailRow>
            <p className="text-[11px] text-muted-foreground/50 pt-1">
              Based on {config.points_value_cents}¢/point redemption value
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
