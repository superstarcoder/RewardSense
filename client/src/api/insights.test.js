// Quick smoke test — run with: node --experimental-vm-modules insights.test.js
// (or we'll verify it via the browser console once Vite is running)
import { getRewardsOptimization } from './insights.js'

const result = getRewardsOptimization()

console.log('=== PERIOD ===')
console.log(result.period)

console.log('\n=== SUMMARY ===')
const s = result.summary
console.log(`Total spend:    $${(s.total_spend_cents / 100).toFixed(2)}`)
console.log(`Actual value:   $${(s.actual_value_cents / 100).toFixed(2)}`)
console.log(`Optimal value:  $${(s.optimal_value_cents / 100).toFixed(2)}`)
console.log(`Missed value:   $${(s.missed_value_cents / 100).toFixed(2)}`)

console.log('\n=== BY CATEGORY ===')
for (const cat of result.by_category) {
  console.log(`\n${cat.label} — $${(cat.total_spend_cents / 100).toFixed(2)} spend`)
  console.log(`  Actual:  $${(cat.actual.total_value_cents / 100).toFixed(2)}`)
  console.log(`  Optimal: ${cat.optimal.card_name} (${cat.optimal.multiplier}x) → $${(cat.optimal.value_cents / 100).toFixed(2)}`)
  console.log(`  Missed:  $${(cat.missed_value_cents / 100).toFixed(2)}`)
  for (const card of cat.actual.by_card) {
    console.log(`    ${card.card_name}: $${(card.spend_cents / 100).toFixed(2)} @ ${card.multiplier}x → ${card.points} pts ($${(card.value_cents / 100).toFixed(2)})`)
  }
}
