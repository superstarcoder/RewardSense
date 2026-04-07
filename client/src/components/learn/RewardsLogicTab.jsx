function SectionHeading({ label }) {
  return (
    <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-5">{label}</h2>
  )
}

function FormulaBlock({ lines }) {
  return (
    <div className="rounded-xl bg-black/40 border border-white/8 px-5 py-4">
      <pre className="font-mono text-[12px] leading-relaxed text-white/70 whitespace-pre-wrap">
        {lines.join('\n')}
      </pre>
    </div>
  )
}

// Section 1: Pipeline
function Pipeline() {
  const steps = [
    {
      n: '01',
      title: 'Build account-to-card lookup',
      desc: 'Load all accounts and card brands. For each credit account, map account_id to card_product_id. This tells the engine which card product was used for each transaction.',
      code: 'accountCardMap[cb.account_id] = cb.brands[0].card_product_id',
    },
    {
      n: '02',
      title: 'MCC code to category group',
      desc: 'For each transaction, look up its merchant_category_code in mccCategories.js. MCC 5812 becomes "dining". MCC 4121 becomes "travel". Unmapped codes fall back to "other".',
      code: 'getCategory(txn.merchant_category_code)  // { group: "dining", label: "Dining" }',
    },
    {
      n: '03',
      title: 'Earn rate lookup',
      desc: 'Look up the card_product_id in rewardsConfig. Walk the reward_rules array — if the transaction MCC is in a rule\'s mcc_codes list, that multiplier applies. Otherwise use base_multiplier.',
      code: 'rule = config.reward_rules.find(r => r.mcc_codes.includes(mcc))\nmultiplier = rule ? rule.multiplier : config.base_multiplier',
    },
    {
      n: '04',
      title: 'Compute actual reward value',
      desc: 'Convert the transaction amount to dollars, multiply by the earn rate to get points, then convert points to cents using the card\'s point value.',
      code: 'points     = round(amount_cents / 100 × multiplier)\nvalue_cents = round(points × points_value_cents)',
    },
    {
      n: '05',
      title: 'Find the optimal card',
      desc: 'Repeat the earn rate lookup and value computation for every card in rewardsConfig. The card that produces the highest value_cents wins. This is the card the user should have used.',
      code: 'for cardProductId in rewardsConfig:\n  { valueCents } = computeRewardValue(amount, mcc, cardProductId)\n  if valueCents > best.valueCents → best = this card',
    },
    {
      n: '06',
      title: 'Compute missed value',
      desc: 'Subtract actual from optimal. If the user used the best card, missed is zero. If not, missed is the dollars left on the table.',
      code: 'missed_cents = max(0, optimal.value_cents − actual.value_cents)',
    },
    {
      n: '07',
      title: 'Aggregate by category',
      desc: 'Group all enriched transactions by category_group. Sum spend, actual value, optimal value, and missed value within each group. Then reduce groups into the overall summary totals.',
      code: 'by_category[group].missed_value_cents += txn.missed_value_cents\nsummary.missed_value_cents = sum(by_category[*].missed_value_cents)',
    },
  ]

  return (
    <div>
      <SectionHeading label="The Pipeline" />
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={step.n} className="flex gap-4">
            {/* Left: number + connector line */}
            <div className="flex flex-col items-center shrink-0 w-10">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-mono font-semibold text-primary">{step.n}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-px flex-1 bg-gradient-to-b from-primary/20 to-primary/5 my-1" />
              )}
            </div>

            {/* Right: content */}
            <div className={`flex-1 min-w-0 ${i < steps.length - 1 ? 'pb-6' : ''}`}>
              <p className="text-sm font-semibold text-foreground/90 mb-1 mt-1">{step.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">{step.desc}</p>
              <div className="rounded-lg bg-black/30 border border-white/6 px-3.5 py-2.5">
                <pre className="font-mono text-[11px] text-white/50 leading-relaxed whitespace-pre-wrap">{step.code}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Section 2a: MCC table
function MccTable() {
  const groups = [
    {
      group: 'Dining',
      color: 'text-orange-300 bg-orange-500/10 border-orange-500/20',
      dot: 'bg-orange-400',
      codes: [
        { mcc: '5812', label: 'Eating Places & Restaurants' },
        { mcc: '5813', label: 'Drinking Places' },
        { mcc: '5814', label: 'Fast Food Restaurants' },
      ],
    },
    {
      group: 'Travel',
      color: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
      dot: 'bg-sky-400',
      codes: [
        { mcc: '4111', label: 'Transit' },
        { mcc: '4121', label: 'Rideshare' },
        { mcc: '4131', label: 'Bus Lines' },
        { mcc: '4411', label: 'Cruise Lines' },
        { mcc: '4511', label: 'Airlines' },
        { mcc: '7011', label: 'Hotels' },
        { mcc: '7512', label: 'Car Rental' },
      ],
    },
    {
      group: 'Apple & Tech',
      color: 'text-violet-300 bg-violet-500/10 border-violet-500/20',
      dot: 'bg-violet-400',
      codes: [
        { mcc: '5045', label: 'Computers & Peripherals' },
        { mcc: '5734', label: 'Computer Software' },
        { mcc: '7372', label: 'Software Services' },
      ],
    },
    {
      group: 'Groceries',
      color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
      dot: 'bg-emerald-400',
      codes: [
        { mcc: '5411', label: 'Grocery Stores' },
        { mcc: '5412', label: 'Convenience Stores' },
      ],
    },
    {
      group: 'Shopping',
      color: 'text-pink-300 bg-pink-500/10 border-pink-500/20',
      dot: 'bg-pink-400',
      codes: [
        { mcc: '5999', label: 'Miscellaneous Retail' },
        { mcc: '5942', label: 'Book Stores' },
        { mcc: '5961', label: 'Catalog & Mail Order' },
        { mcc: '5310', label: 'Discount Stores' },
      ],
    },
  ]

  return (
    <div>
      <p className="text-xs font-semibold text-foreground/80 mb-3">MCC to Category Mapping</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {groups.map(({ group, color, dot, codes }) => (
          <div key={group} className="glass rounded-xl border border-white/8 p-4">
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium mb-3 ${color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              {group}
            </div>
            <div className="space-y-1.5">
              {codes.map(({ mcc, label }) => (
                <div key={mcc} className="flex items-center gap-3">
                  <code className="text-[11px] font-mono text-muted-foreground/60 w-10 shrink-0">{mcc}</code>
                  <span className="text-[11px] text-muted-foreground/50">{label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Section 2b: Earn rate cards
function EarnRateCards() {
  const cards = [
    {
      name: 'Chase Sapphire Preferred',
      id: 'cp_chase_sapphire_preferred',
      pointsCurrency: 'Chase Ultimate Rewards',
      pointValue: '1.25¢',
      gradient: 'from-[#0a1628] via-[#1a3a6e] to-[#0d2654]',
      borderColor: 'border-blue-500/25',
      ruleColor: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
      rules: [
        { category: 'Dining', mcc: '5812, 5813, 5814', multiplier: '3x' },
        { category: 'Travel', mcc: '4111, 4121, 4131...', multiplier: '2x' },
      ],
      base: '1x',
    },
    {
      name: 'Apple Card',
      id: 'cp_apple_card',
      pointsCurrency: 'Daily Cash',
      pointValue: '1.00¢',
      gradient: 'from-[#1a1a1a] via-[#2d2d2d] to-[#111111]',
      borderColor: 'border-slate-400/20',
      ruleColor: 'text-violet-300 bg-violet-500/10 border-violet-500/20',
      rules: [
        { category: 'Apple & Tech', mcc: '5045, 5734, 7372', multiplier: '3x' },
      ],
      base: '2x',
    },
    {
      name: 'Citi Double Cash',
      id: 'cp_citi_double_cash',
      pointsCurrency: 'Citi ThankYou Points',
      pointValue: '1.00¢',
      gradient: 'from-[#0a2a2a] via-[#0f3f3f] to-[#072222]',
      borderColor: 'border-teal-500/25',
      ruleColor: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
      rules: [],
      base: '2x',
    },
  ]

  return (
    <div>
      <p className="text-xs font-semibold text-foreground/80 mb-3">Earn Rate Lookup</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((card) => (
          <div key={card.id} className={`glass rounded-xl border p-4 ${card.borderColor}`}>
            {/* Mini card header */}
            <div className={`rounded-lg p-3 mb-4 bg-gradient-to-br ${card.gradient} border border-white/10`}>
              <p className="text-white/40 text-[9px] uppercase tracking-widest">card_product_id</p>
              <p className="text-white/80 text-[10px] font-mono mt-0.5">{card.id}</p>
            </div>

            <p className="text-[11px] font-semibold text-foreground/80 mb-3">{card.name}</p>

            {/* Rules */}
            <div className="space-y-2 mb-3">
              {card.rules.length > 0 ? card.rules.map((rule) => (
                <div key={rule.category} className={`rounded-lg border px-2.5 py-2 ${card.ruleColor}`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-semibold">{rule.multiplier}</span>
                    <span className="text-[10px] opacity-70">{rule.category}</span>
                  </div>
                  <p className="text-[10px] opacity-50 font-mono">MCC {rule.mcc}</p>
                </div>
              )) : (
                <p className="text-[11px] text-muted-foreground/50 italic">No bonus rules. Flat rate on all spend.</p>
              )}
            </div>

            {/* Base + point value */}
            <div className="border-t border-white/8 pt-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">Base</p>
                <p className="text-xs font-semibold text-foreground/60 mt-0.5">{card.base} everything</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">Point value</p>
                <p className="text-xs font-semibold text-foreground/60 mt-0.5">{card.pointValue} / pt</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Section 2: Full breakdown
function StepByStep() {
  return (
    <div>
      <SectionHeading label="Step-by-Step Breakdown" />
      <div className="space-y-8">
        <MccTable />
        <EarnRateCards />

        <div>
          <p className="text-xs font-semibold text-foreground/80 mb-3">The Formulas</p>
          <FormulaBlock lines={[
            '// Step 1: points earned on a transaction',
            'points      = round(amount_cents / 100 × multiplier)',
            '',
            '// Step 2: convert points to dollar value',
            'value_cents = round(points × points_value_cents)',
            '',
            '// Step 3: find missed value after checking all cards',
            'missed_cents = max(0, optimal_value_cents − actual_value_cents)',
          ]} />
          <p className="text-[11px] text-muted-foreground/40 mt-2 italic">
            All values stored as integers in cents. Division by 100 only happens at display time.
          </p>
        </div>
      </div>
    </div>
  )
}

// Section 3: Worked example
function WorkedExample() {
  // Sweetgreen, $14.75, MCC 5812, Apple Card
  // Apple Card: MCC 5812 not in apple_tech → base 2x × 1.0¢
  //   points = round(14.75 × 2) = 30, value = round(30 × 1.0) = 30¢
  // Chase Sapphire: MCC 5812 hits dining rule → 3x × 1.25¢
  //   points = round(14.75 × 3) = round(44.25) = 44, value = round(44 × 1.25) = 55¢
  // Missed = 55 - 30 = 25¢

  const steps = [
    {
      label: 'Transaction',
      content: 'Sweetgreen · $14.75 · MCC 5812',
      sub: 'account_id: acc_7n4mz8qr5t (Apple Card)',
      color: 'border-white/10 bg-white/3',
      labelColor: 'text-foreground/50',
    },
    {
      label: 'MCC lookup',
      content: '5812 → dining',
      sub: 'mccCategories["5812"] = { group: "dining", label: "Dining" }',
      color: 'border-white/10 bg-white/3',
      labelColor: 'text-foreground/50',
    },
    {
      label: 'Earn rate (actual card)',
      content: 'Apple Card: 5812 not in [5045, 5734, 7372] → base rate applies → 2x',
      sub: 'points_value_cents = 1.00¢',
      color: 'border-white/10 bg-white/3',
      labelColor: 'text-foreground/50',
    },
    {
      label: 'Actual value',
      content: 'round(14.75 × 2) = 30 pts · round(30 × 1.00) = 30¢',
      sub: '$0.30 in Daily Cash',
      color: 'border-emerald-500/20 bg-emerald-500/5',
      labelColor: 'text-emerald-400',
      highlight: true,
    },
    {
      label: 'Optimal card check',
      content: 'Chase Sapphire: 5812 hits dining rule → 3x · points_value_cents = 1.25¢',
      sub: 'round(14.75 × 3) = 44 pts · round(44 × 1.25) = 55¢ — highest of all cards',
      color: 'border-primary/20 bg-primary/5',
      labelColor: 'text-primary',
      highlight: true,
    },
    {
      label: 'Missed value',
      content: 'max(0, 55 − 30) = 25¢ on this transaction',
      sub: 'Alex used Apple Card for dining — Chase Sapphire would have earned $0.25 more',
      color: 'border-amber-500/25 bg-amber-500/5',
      labelColor: 'text-amber-400',
      highlight: true,
    },
  ]

  return (
    <div>
      <SectionHeading label="Worked Example" />
      <p className="text-xs text-muted-foreground/60 mb-5">
        Walking through transaction <code className="font-mono text-muted-foreground/50">txn_march_003</code>: Sweetgreen, $14.75, MCC 5812, charged to Apple Card.
      </p>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className={`rounded-xl border px-4 py-3 ${step.color}`}>
            <div className="flex items-start gap-3">
              <span className={`text-[10px] font-semibold uppercase tracking-wider shrink-0 w-32 mt-0.5 ${step.labelColor}`}>
                {step.label}
              </span>
              <div className="min-w-0">
                <p className="text-[12px] text-foreground/80 font-mono leading-snug">{step.content}</p>
                <p className="text-[11px] text-muted-foreground/50 mt-0.5 leading-snug font-sans">{step.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Section 4: Point value nuance
function PointValueNuance() {
  return (
    <div>
      <SectionHeading label="The Point Value Nuance" />
      <div className="glass rounded-2xl border border-white/10 p-6 mb-4">
        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
          The most counterintuitive result in the data: Alex has <span className="text-foreground font-medium">$1.01 in missed value on travel</span>, even though his Citi Double Cash and Chase Sapphire both earn <span className="text-foreground font-medium">2x on rideshare</span>. Same multiplier. Still losing money.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The reason is point valuation. Points on different cards are worth different amounts. Citi ThankYou Points redeem at 1.00¢ each. Chase Ultimate Rewards redeem at 1.25¢ when used through the travel portal. Two identical multipliers, two different effective returns.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {[
          {
            card: 'Citi Double Cash',
            currency: 'ThankYou Points',
            multiplier: '2x',
            pointValue: '1.00¢',
            effective: '2.00%',
            color: 'border-teal-500/20 bg-teal-500/5',
            valueColor: 'text-teal-300',
          },
          {
            card: 'Chase Sapphire Preferred',
            currency: 'Ultimate Rewards',
            multiplier: '2x',
            pointValue: '1.25¢',
            effective: '2.50%',
            color: 'border-blue-500/20 bg-blue-500/5',
            valueColor: 'text-blue-300',
            winner: true,
          },
        ].map(({ card, currency, multiplier, pointValue, effective, color, valueColor, winner }) => (
          <div key={card} className={`rounded-xl border p-4 ${color}`}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-foreground/80">{card}</p>
              {winner && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 border border-primary/25 text-primary font-medium">optimal</span>
              )}
            </div>
            <div className="space-y-2">
              {[
                { label: 'Travel multiplier', value: multiplier },
                { label: 'Point currency', value: currency },
                { label: 'Point value', value: pointValue },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground/50">{label}</span>
                  <span className={`text-[11px] font-mono font-semibold ${valueColor}`}>{value}</span>
                </div>
              ))}
              <div className="border-t border-white/8 pt-2 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground/50">Effective return</span>
                <span className={`text-sm font-semibold tabular ${valueColor}`}>{effective}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FormulaBlock lines={[
        '// Effective return = multiplier × point_value_cents / 100',
        'Citi:  2 × 1.00¢ / 100 = 2.00% cash back equivalent',
        'Chase: 2 × 1.25¢ / 100 = 2.50% cash back equivalent',
        '',
        '// On $200 of rideshare spend:',
        'Citi value:  round(200 × 2) × 1.00 = 400 pts = 400¢ = $4.00',
        'Chase value: round(200 × 2) × 1.25 = 400 pts = 500¢ = $5.00',
        'Missed:      max(0, 500 − 400)      =           100¢ = $1.00',
      ]} />
      <p className="text-[11px] text-muted-foreground/40 mt-2 italic">
        The $1.01 figure in the Insights page reflects this calculation across all travel transactions, with rounding applied per transaction.
      </p>
    </div>
  )
}

// Section 5: Aggregation
function Aggregation() {
  const flow = [
    {
      label: 'Per transaction',
      color: 'border-white/10 bg-white/3',
      fields: [
        { name: 'value_cents_earned', desc: 'actual reward value' },
        { name: 'optimal_value_cents', desc: 'best possible value' },
        { name: 'missed_value_cents', desc: 'the gap' },
        { name: 'category_group', desc: 'which bucket it goes into' },
      ],
    },
    {
      label: 'Grouped by category',
      color: 'border-primary/15 bg-primary/4',
      fields: [
        { name: 'total_spend_cents', desc: 'sum of all transaction amounts' },
        { name: 'actual.total_value_cents', desc: 'sum of value earned' },
        { name: 'optimal.value_cents', desc: 'sum of optimal values' },
        { name: 'missed_value_cents', desc: 'sum of missed values' },
        { name: 'actual.by_card[]', desc: 'per-card breakdown within category' },
      ],
    },
    {
      label: 'Summary totals',
      color: 'border-emerald-500/15 bg-emerald-500/4',
      fields: [
        { name: 'total_spend_cents', desc: 'reduce across all categories' },
        { name: 'actual_value_cents', desc: 'reduce across all categories' },
        { name: 'optimal_value_cents', desc: 'reduce across all categories' },
        { name: 'missed_value_cents', desc: 'the headline number in Insights' },
      ],
    },
  ]

  return (
    <div>
      <SectionHeading label="Aggregation" />
      <p className="text-xs text-muted-foreground/60 mb-5 leading-relaxed">
        After computing per-transaction values, the optimizer groups results by category and reduces to summary totals. This produces the full <code className="font-mono text-muted-foreground/50">by_category</code> + <code className="font-mono text-muted-foreground/50">summary</code> structure returned by <code className="font-mono text-muted-foreground/50">getRewardsOptimization()</code>.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {flow.map(({ label, color, fields }, i) => (
          <div key={label} className="flex flex-col gap-2">
            {i > 0 && (
              <div className="sm:hidden flex items-center gap-2 text-muted-foreground/30">
                <div className="flex-1 h-px bg-white/8" />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                </svg>
                <div className="flex-1 h-px bg-white/8" />
              </div>
            )}
            <div className={`rounded-xl border p-4 flex-1 ${color}`}>
              <p className="text-[11px] font-semibold text-foreground/70 mb-3 uppercase tracking-wider">{label}</p>
              <div className="space-y-2">
                {fields.map(({ name, desc }) => (
                  <div key={name}>
                    <code className="text-[11px] font-mono text-foreground/60">{name}</code>
                    <p className="text-[10px] text-muted-foreground/40 leading-snug">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {i < flow.length - 1 && (
              <div className="hidden sm:flex justify-center">
                <svg width="12" height="16" viewBox="0 0 12 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
                  <line x1="6" y1="0" x2="6" y2="18" /><polyline points="1 13 6 18 11 13" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RewardsLogicTab() {
  return (
    <div className="space-y-14">
      <Pipeline />
      <StepByStep />
      <WorkedExample />
      <PointValueNuance />
      <Aggregation />
    </div>
  )
}
