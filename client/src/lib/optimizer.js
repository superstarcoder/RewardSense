import rewardsConfig from './rewardsConfig'
import { getCategory } from './mccCategories'

// Returns the reward multiplier for a given MCC on a given card.
function getMultiplier(cardProductId, mcc) {
  const config = rewardsConfig[cardProductId]
  if (!config) return 0
  const rule = config.reward_rules.find(r => r.mcc_codes.includes(mcc))
  return rule ? rule.multiplier : config.base_multiplier
}

// Returns points and dollar value earned for a single transaction on a given card.
// points      = round(dollars * multiplier)
// value_cents = round(points * points_value_cents)
function computeRewardValue(amountCents, mcc, cardProductId) {
  const config = rewardsConfig[cardProductId]
  const multiplier = getMultiplier(cardProductId, mcc)
  const points = Math.round((amountCents / 100) * multiplier)
  const valueCents = Math.round(points * config.points_value_cents)
  return { points, valueCents, multiplier }
}

// Finds the card (among all cards in rewardsConfig) that maximizes value for a transaction.
function findOptimalCard(amountCents, mcc) {
  let best = null
  for (const cardProductId of Object.keys(rewardsConfig)) {
    const { points, valueCents, multiplier } = computeRewardValue(amountCents, mcc, cardProductId)
    if (!best || valueCents > best.valueCents) {
      best = {
        card_product_id: cardProductId,
        card_name: rewardsConfig[cardProductId].name,
        multiplier,
        points,
        valueCents,
      }
    }
  }
  return best
}

// Main export. Takes raw data arrays, returns the full rewards optimization payload.
export function computeRewardsOptimization(transactions, accounts, cardBrands) {
  // Build account_id → card_product_id lookup
  const accountCardMap = {}
  for (const cb of cardBrands) {
    if (cb.brands && cb.brands.length > 0) {
      accountCardMap[cb.account_id] = cb.brands[0].card_product_id
    }
  }

  // Build account_id → account lookup for card name
  const accountMap = {}
  for (const acc of accounts) {
    accountMap[acc.id] = acc
  }

  // Enrich each transaction with actual vs optimal reward data
  const enriched = transactions.map(txn => {
    const cardProductId = accountCardMap[txn.account_id]
    const config = rewardsConfig[cardProductId]

    const actual = computeRewardValue(txn.amount, txn.merchant_category_code, cardProductId)
    const optimal = findOptimalCard(txn.amount, txn.merchant_category_code)
    const missedValueCents = optimal.valueCents - actual.valueCents

    const category = getCategory(txn.merchant_category_code)

    return {
      id: txn.id,
      descriptor: txn.descriptor,
      merchant_name: txn.merchant.name,
      merchant_category_code: txn.merchant_category_code,
      amount_cents: txn.amount,
      transacted_at: txn.transacted_at,
      category_group: category.group,
      category_label: category.label,
      card_product_id: cardProductId,
      card_name: config.name,
      multiplier_used: actual.multiplier,
      points_earned: actual.points,
      value_cents_earned: actual.valueCents,
      optimal_card_product_id: optimal.card_product_id,
      optimal_card_name: optimal.card_name,
      optimal_multiplier: optimal.multiplier,
      optimal_points: optimal.points,
      optimal_value_cents: optimal.valueCents,
      missed_value_cents: Math.max(0, missedValueCents),
      is_optimal: missedValueCents <= 0,
    }
  })

  // Group enriched transactions by category group
  const groupMap = {}
  for (const txn of enriched) {
    const g = txn.category_group
    if (!groupMap[g]) {
      groupMap[g] = {
        group: g,
        label: txn.category_label,
        total_spend_cents: 0,
        actual: { total_value_cents: 0, by_card: {} },
        optimal_value_cents: 0,
        missed_value_cents: 0,
        transactions: [],
      }
    }

    const entry = groupMap[g]
    entry.total_spend_cents += txn.amount_cents
    entry.actual.total_value_cents += txn.value_cents_earned
    entry.optimal_value_cents += txn.optimal_value_cents
    entry.missed_value_cents += txn.missed_value_cents
    entry.transactions.push(txn)

    // Aggregate per-card breakdown within this category
    const cpId = txn.card_product_id
    if (!entry.actual.by_card[cpId]) {
      entry.actual.by_card[cpId] = {
        card_product_id: cpId,
        card_name: txn.card_name,
        spend_cents: 0,
        multiplier: txn.multiplier_used,
        points: 0,
        value_cents: 0,
      }
    }
    entry.actual.by_card[cpId].spend_cents += txn.amount_cents
    entry.actual.by_card[cpId].points += txn.points_earned
    entry.actual.by_card[cpId].value_cents += txn.value_cents_earned
  }

  // Finalize each category: convert by_card map to array, resolve optimal card
  const by_category = Object.values(groupMap).map(entry => {
    // Optimal card = card that would earn the most value on each txn.
    // Since all txns in a category share the same MCC group, derive from the first txn.
    const firstTxn = entry.transactions[0]
    const optimalCard = findOptimalCard(100 /* $1 probe */, firstTxn.merchant_category_code)

    return {
      ...entry,
      actual: {
        total_value_cents: entry.actual.total_value_cents,
        by_card: Object.values(entry.actual.by_card),
      },
      optimal: {
        card_product_id: optimalCard.card_product_id,
        card_name: optimalCard.card_name,
        multiplier: optimalCard.multiplier,
        points: Math.round((entry.total_spend_cents / 100) * optimalCard.multiplier),
        value_cents: entry.optimal_value_cents,
      },
    }
  })

  // Summary totals
  const summary = by_category.reduce(
    (acc, cat) => {
      acc.total_spend_cents += cat.total_spend_cents
      acc.actual_value_cents += cat.actual.total_value_cents
      acc.optimal_value_cents += cat.optimal_value_cents
      acc.missed_value_cents += cat.missed_value_cents
      return acc
    },
    { total_spend_cents: 0, actual_value_cents: 0, optimal_value_cents: 0, missed_value_cents: 0 }
  )

  return {
    period: { start: '2026-03-01', end: '2026-03-31' },
    summary,
    by_category,
  }
}
