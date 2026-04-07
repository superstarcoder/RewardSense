// Smoke test — mirrors the src/ logic using CommonJS data files in api/
// Run: node smoke-test.mjs

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const transactions = require('./api/data/transactions.js')
const accounts     = require('./api/data/accounts.js')
const cardBrands   = require('./api/data/cardBrands.js')
const rewardsConfig = require('./api/lib/rewardsConfig.js')

const mccCategories = {
  '5812': { label: 'Dining', group: 'dining' },
  '5813': { label: 'Dining', group: 'dining' },
  '5814': { label: 'Dining', group: 'dining' },
  '4111': { label: 'Transit', group: 'travel' },
  '4121': { label: 'Rideshare', group: 'travel' },
  '5045': { label: 'Apple & Tech', group: 'apple_tech' },
  '5734': { label: 'Apple & Tech', group: 'apple_tech' },
  '7372': { label: 'Apple & Tech', group: 'apple_tech' },
  '5411': { label: 'Groceries', group: 'groceries' },
  '5412': { label: 'Groceries', group: 'groceries' },
  '5999': { label: 'Shopping', group: 'shopping' },
}

function getCategory(mcc) {
  return mccCategories[mcc] || { label: 'Other', group: 'other' }
}

function getMultiplier(cardProductId, mcc) {
  const config = rewardsConfig[cardProductId]
  if (!config) return 0
  const rule = config.reward_rules.find(r => r.mcc_codes.includes(mcc))
  return rule ? rule.multiplier : config.base_multiplier
}

function computeRewardValue(amountCents, mcc, cardProductId) {
  const config = rewardsConfig[cardProductId]
  const multiplier = getMultiplier(cardProductId, mcc)
  const points = Math.round((amountCents / 100) * multiplier)
  const valueCents = Math.round(points * config.points_value_cents)
  return { points, valueCents, multiplier }
}

function findOptimalCard(amountCents, mcc) {
  let best = null
  for (const cardProductId of Object.keys(rewardsConfig)) {
    const { points, valueCents, multiplier } = computeRewardValue(amountCents, mcc, cardProductId)
    if (!best || valueCents > best.valueCents) {
      best = { card_product_id: cardProductId, card_name: rewardsConfig[cardProductId].name, multiplier, points, valueCents }
    }
  }
  return best
}

// Build lookup
const accountCardMap = {}
for (const cb of cardBrands) {
  if (cb.brands && cb.brands.length > 0) {
    accountCardMap[cb.account_id] = cb.brands[0].card_product_id
  }
}

const groupMap = {}
for (const txn of transactions) {
  const cardProductId = accountCardMap[txn.account_id]
  const config = rewardsConfig[cardProductId]
  const actual = computeRewardValue(txn.amount, txn.merchant_category_code, cardProductId)
  const optimal = findOptimalCard(txn.amount, txn.merchant_category_code)
  const missedValueCents = Math.max(0, optimal.valueCents - actual.valueCents)
  const category = getCategory(txn.merchant_category_code)

  const g = category.group
  if (!groupMap[g]) {
    groupMap[g] = { label: category.label, total_spend: 0, actual_value: 0, optimal_value: 0, missed_value: 0, by_card: {} }
  }
  groupMap[g].total_spend += txn.amount
  groupMap[g].actual_value += actual.valueCents
  groupMap[g].optimal_value += optimal.valueCents
  groupMap[g].missed_value += missedValueCents

  if (!groupMap[g].by_card[cardProductId]) {
    groupMap[g].by_card[cardProductId] = { name: config.name, spend: 0, points: 0, value: 0, multiplier: actual.multiplier }
  }
  groupMap[g].by_card[cardProductId].spend += txn.amount
  groupMap[g].by_card[cardProductId].points += actual.points
  groupMap[g].by_card[cardProductId].value += actual.valueCents
}

let totalSpend = 0, totalActual = 0, totalOptimal = 0, totalMissed = 0

console.log('\n========== REWARDS OPTIMIZATION SMOKE TEST ==========\n')
for (const [group, data] of Object.entries(groupMap)) {
  const optimalCard = findOptimalCard(100, transactions.find(t => getCategory(t.merchant_category_code).group === group).merchant_category_code)
  console.log(`${data.label} — $${(data.total_spend/100).toFixed(2)} spend`)
  console.log(`  Actual value:  $${(data.actual_value/100).toFixed(2)}`)
  console.log(`  Optimal card:  ${optimalCard.card_name} (${optimalCard.multiplier}x)`)
  console.log(`  Optimal value: $${(data.optimal_value/100).toFixed(2)}`)
  console.log(`  Missed:        $${(data.missed_value/100).toFixed(2)}`)
  for (const [, card] of Object.entries(data.by_card)) {
    console.log(`    └ ${card.name}: $${(card.spend/100).toFixed(2)} @ ${card.multiplier}x → ${card.points} pts ($${(card.value/100).toFixed(2)})`)
  }
  console.log()
  totalSpend += data.total_spend
  totalActual += data.actual_value
  totalOptimal += data.optimal_value
  totalMissed += data.missed_value
}

console.log('=====================================================')
console.log(`Total spend:    $${(totalSpend/100).toFixed(2)}`)
console.log(`Actual value:   $${(totalActual/100).toFixed(2)}`)
console.log(`Optimal value:  $${(totalOptimal/100).toFixed(2)}`)
console.log(`Missed value:   $${(totalMissed/100).toFixed(2)}`)
console.log('=====================================================\n')
