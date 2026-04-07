import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import entityData from '@/data/entity'
import accountsData from '@/data/accounts'
import balancesData from '@/data/balances'
import cardBrandsData from '@/data/cardBrands'
import transactionsData from '@/data/transactions'
import rewardsConfig from '@/lib/rewardsConfig'
import { getRewardsOptimization } from '@/api/insights'

// Strip the transactions array from by_category entries for readability
const rawOpt = getRewardsOptimization()
const optimizationExample = {
  period: rawOpt.period,
  summary: rawOpt.summary,
  by_category: rawOpt.by_category.slice(0, 1).map(({ transactions: _t, ...rest }) => rest),
}

// Basic JSON syntax highlighter — safe since input is always our own static data
function highlight(json) {
  const escaped = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        return /:$/.test(match)
          ? `<span class="text-blue-300/80">${match}</span>`
          : `<span class="text-emerald-300/80">${match}</span>`
      }
      if (/true|false/.test(match)) return `<span class="text-violet-300/80">${match}</span>`
      if (/null/.test(match)) return `<span class="text-white/30">${match}</span>`
      return `<span class="text-amber-300/80">${match}</span>`
    }
  )
}

function JsonBlock({ data, note }) {
  const json = JSON.stringify(data, null, 2)
  return (
    <div>
      {note && (
        <p className="text-[11px] text-muted-foreground/50 italic mb-2">{note}</p>
      )}
      <div className="rounded-xl bg-black/40 border border-white/8 overflow-auto max-h-[480px]">
        <pre
          className="p-4 text-[11px] font-mono leading-relaxed text-white/50"
          dangerouslySetInnerHTML={{ __html: highlight(json) }}
        />
      </div>
    </div>
  )
}

function TypeBadge({ type }) {
  const colors = {
    string:  'text-emerald-300/70 bg-emerald-500/8 border-emerald-500/15',
    number:  'text-amber-300/70 bg-amber-500/8 border-amber-500/15',
    object:  'text-blue-300/70 bg-blue-500/8 border-blue-500/15',
    array:   'text-violet-300/70 bg-violet-500/8 border-violet-500/15',
    boolean: 'text-pink-300/70 bg-pink-500/8 border-pink-500/15',
    null:    'text-white/30 bg-white/4 border-white/8',
  }
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono whitespace-nowrap ${colors[type] ?? 'text-white/40 bg-white/4 border-white/8'}`}>
      {type}
    </span>
  )
}

function FieldsTable({ fields }) {
  return (
    <div className="rounded-xl border border-white/10 overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10 bg-white/3">
            <th className="text-left px-4 py-2.5 text-muted-foreground font-medium text-[11px] w-[38%]">Field</th>
            <th className="text-left px-4 py-2.5 text-muted-foreground font-medium text-[11px] w-[12%]">Type</th>
            <th className="text-left px-4 py-2.5 text-muted-foreground font-medium text-[11px]">Description</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.field} className={`border-b border-white/6 last:border-0 transition-colors ${f.key ? 'bg-primary/4' : 'hover:bg-white/2'}`}>
              <td className="px-4 py-2.5 align-top">
                <div className="flex items-center gap-1.5">
                  {f.key && (
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />
                  )}
                  <code className="text-[11px] font-mono text-foreground/75 break-all">{f.field}</code>
                </div>
              </td>
              <td className="px-4 py-2.5 align-top">
                <TypeBadge type={f.type} />
              </td>
              <td className="px-4 py-2.5 align-top text-[11px] text-muted-foreground leading-relaxed">{f.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SchemaPanel({ schema }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
          <h3 className="text-base font-semibold text-foreground">{schema.name}</h3>
          {schema.ourLayer ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/12 border border-violet-500/25 text-violet-300 font-medium tracking-wide">RewardSense's layer</span>
          ) : (
            <>
              <code className="text-[11px] px-2 py-0.5 rounded-md bg-white/6 border border-white/10 text-muted-foreground font-mono">{schema.endpoint}</code>
              <a
                href={schema.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-primary/60 hover:text-primary transition-colors"
              >
                Method docs
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground/50">
          {schema.ourLayer
            ? (schema.accessedVia.fn
                ? <>Accessed via <code className="text-primary/60 font-mono">{schema.accessedVia.fn}</code> in <code className="text-muted-foreground/70 font-mono">{schema.accessedVia.file}</code></>
                : <>Defined in <code className="text-muted-foreground/70 font-mono">{schema.accessedVia.file}</code></>)
            : <>Schema based on Method's API. Accessed in this PoC via <code className="text-primary/60 font-mono">{schema.accessedVia.fn}</code> in <code className="text-muted-foreground/70 font-mono">{schema.accessedVia.file}</code></>
          }
        </p>

        {schema.note && (
          <div className="mt-3 rounded-lg border border-violet-500/20 bg-violet-500/6 px-3.5 py-2.5">
            <p className="text-[11px] text-violet-200/65 leading-relaxed">{schema.note}</p>
          </div>
        )}
      </div>

      <Tabs defaultValue="json">
        <TabsList className="h-auto p-0.5 bg-white/4 border border-white/8">
          <TabsTrigger value="json" className="text-xs px-3 py-1.5">JSON</TabsTrigger>
          <TabsTrigger value="fields" className="text-xs px-3 py-1.5">Fields</TabsTrigger>
        </TabsList>
        <TabsContent value="json" className="mt-3">
          <JsonBlock data={schema.example} note={schema.jsonNote} />
        </TabsContent>
        <TabsContent value="fields" className="mt-3">
          {schema.keyNote && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <p className="text-[11px] text-muted-foreground/50">Blue dot marks fields used by the rewards engine</p>
            </div>
          )}
          <FieldsTable fields={schema.fields} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

const schemas = [
  {
    id: 'entity',
    name: 'Entity',
    endpoint: 'GET /entities/{id}',
    ourLayer: false,
    docsUrl: 'https://docs.methodfi.com/reference/entities/overview',
    accessedVia: { fn: 'getEntity()', file: 'src/api/entity.js' },
    example: entityData,
    keyNote: false,
    fields: [
      { field: 'id',                  type: 'string', desc: 'Unique entity identifier' },
      { field: 'type',                type: 'string', desc: '"individual" for people' },
      { field: 'individual.first_name', type: 'string', desc: 'Legal first name' },
      { field: 'individual.last_name',  type: 'string', desc: 'Legal last name' },
      { field: 'individual.phone',    type: 'string', desc: 'Phone number in E.164 format' },
      { field: 'individual.email',    type: 'string', desc: 'Email address' },
      { field: 'individual.dob',      type: 'string', desc: 'Date of birth in YYYY-MM-DD format' },
      { field: 'individual.ssn_4',    type: 'string', desc: 'Last 4 digits of SSN' },
      { field: 'address.line1',       type: 'string', desc: 'Street address' },
      { field: 'address.line2',       type: 'string', desc: 'Apartment or unit number' },
      { field: 'address.city',        type: 'string', desc: 'City' },
      { field: 'address.state',       type: 'string', desc: '2-letter state code' },
      { field: 'address.zip',         type: 'string', desc: 'ZIP code' },
      { field: 'status',              type: 'string', desc: '"active" or "disabled"' },
      { field: 'error',               type: 'null',   desc: 'Error object if a problem occurred, otherwise null' },
      { field: 'created_at',          type: 'string', desc: 'ISO 8601 creation timestamp' },
      { field: 'updated_at',          type: 'string', desc: 'ISO 8601 last updated timestamp' },
    ],
  },
  {
    id: 'account',
    name: 'Account',
    endpoint: 'GET /accounts',
    ourLayer: false,
    docsUrl: 'https://docs.methodfi.com/reference/accounts/overview',
    accessedVia: { fn: 'getAccounts()', file: 'src/api/accounts.js' },
    example: [accountsData[0], accountsData[3]],
    jsonNote: 'Showing both variants: liability (credit card) and ach (checking). The type field determines which sub-object is present.',
    keyNote: false,
    fields: [
      { field: 'id',                   type: 'string', desc: 'Unique account identifier' },
      { field: 'holder_id',            type: 'string', desc: 'Entity ID of the account holder. Links back to the Entity schema' },
      { field: 'status',               type: 'string', desc: '"active" or "disabled"' },
      { field: 'type',                 type: 'string', desc: '"liability" for credit cards and loans, "ach" for bank accounts. Determines which sub-object is present' },
      { field: 'liability.mch_id',     type: 'string', desc: 'Method merchant identifier (liability accounts only)' },
      { field: 'liability.mask',       type: 'string', desc: 'Last 4 digits of the card number' },
      { field: 'liability.ownership',  type: 'string', desc: '"primary" or "authorized"' },
      { field: 'liability.fingerprint',type: 'string', desc: 'Unique card fingerprint for deduplication across users' },
      { field: 'liability.type',       type: 'string', desc: '"credit_card"' },
      { field: 'liability.name',       type: 'string', desc: 'Card product name as reported by the issuer' },
      { field: 'ach.routing',          type: 'string', desc: 'ABA routing number (ACH accounts only)' },
      { field: 'ach.number',           type: 'string', desc: 'Masked account number' },
      { field: 'ach.type',             type: 'string', desc: '"checking" or "savings"' },
      { field: 'error',                type: 'null',   desc: 'Error object if a problem occurred, otherwise null' },
      { field: 'created_at',           type: 'string', desc: 'ISO 8601 creation timestamp' },
      { field: 'updated_at',           type: 'string', desc: 'ISO 8601 last updated timestamp' },
    ],
  },
  {
    id: 'balance',
    name: 'Balance',
    endpoint: 'GET /accounts/{id}/balances',
    ourLayer: false,
    docsUrl: 'https://docs.methodfi.com/reference/accounts/balances/overview',
    accessedVia: { fn: 'getBalances()', file: 'src/api/accounts.js' },
    example: balancesData[0],
    keyNote: true,
    fields: [
      { field: 'id',         type: 'string', desc: 'Unique balance record identifier' },
      { field: 'account_id', type: 'string', desc: 'Account this balance belongs to' },
      { field: 'status',     type: 'string', desc: '"completed" when successfully fetched' },
      { field: 'amount',     type: 'number', desc: 'Current balance in cents. Divide by 100 for dollars. Chase Sapphire shows 52750 = $527.50', key: true },
      { field: 'error',      type: 'null',   desc: 'Error object if a problem occurred, otherwise null' },
      { field: 'created_at', type: 'string', desc: 'ISO 8601 creation timestamp' },
      { field: 'updated_at', type: 'string', desc: 'ISO 8601 last updated timestamp' },
    ],
  },
  {
    id: 'card-brand',
    name: 'Card Brand',
    endpoint: 'GET /accounts/{id}/card_brands',
    ourLayer: false,
    docsUrl: 'https://docs.methodfi.com/reference/accounts/card-brands/overview',
    accessedVia: { fn: 'getCardBrands()', file: 'src/api/accounts.js' },
    example: cardBrandsData[0],
    keyNote: true,
    fields: [
      { field: 'id',                       type: 'string', desc: 'Unique card brand record identifier' },
      { field: 'account_id',               type: 'string', desc: 'Account this brand data belongs to' },
      { field: 'brands[]',                 type: 'array',  desc: 'Array of brand objects, usually one entry per account' },
      { field: 'brands[].id',              type: 'string', desc: 'Unique brand entry identifier' },
      { field: 'brands[].card_product_id', type: 'string', desc: 'Card product identifier. Used as the key into Rewards Config to retrieve earn rates and point values', key: true },
      { field: 'brands[].name',            type: 'string', desc: 'Card product name' },
      { field: 'brands[].description',     type: 'string', desc: 'Full card description including network' },
      { field: 'brands[].issuer',          type: 'string', desc: 'Card issuing bank (e.g. "Chase", "Goldman Sachs")' },
      { field: 'brands[].network',         type: 'string', desc: '"visa" or "mastercard"' },
      { field: 'brands[].network_tier',    type: 'string', desc: '"signature", "world", etc.' },
      { field: 'brands[].type',            type: 'string', desc: '"specific" when the exact card product is identified' },
      { field: 'status',                   type: 'string', desc: '"completed" when card brand was successfully identified' },
      { field: 'source',                   type: 'string', desc: '"method"' },
      { field: 'error',                    type: 'null',   desc: 'Error object if a problem occurred, otherwise null' },
    ],
  },
  {
    id: 'transaction',
    name: 'Transaction',
    endpoint: 'GET /accounts/{id}/payments',
    ourLayer: false,
    docsUrl: 'https://docs.methodfi.com/reference/payments/overview',
    accessedVia: { fn: 'getTransactions()', file: 'src/api/transactions.js' },
    example: transactionsData[0],
    keyNote: true,
    fields: [
      { field: 'id',                      type: 'string', desc: 'Unique transaction identifier' },
      { field: 'account_id',              type: 'string', desc: 'Account this transaction belongs to' },
      { field: 'status',                  type: 'string', desc: '"posted" or "pending"' },
      { field: 'descriptor',              type: 'string', desc: 'Raw merchant descriptor as it appears on the statement' },
      { field: 'merchant.name',           type: 'string', desc: 'Cleaned merchant name' },
      { field: 'merchant_category_code',  type: 'string', desc: '4-digit MCC code classifying the merchant type. This single field drives all category mapping in the rewards engine. MCC 5812 = restaurant, MCC 4121 = rideshare', key: true },
      { field: 'amount',                  type: 'number', desc: 'Transaction amount in cents', key: true },
      { field: 'currency_code',           type: 'string', desc: '"USD"' },
      { field: 'transaction_amount',      type: 'number', desc: 'Amount in the transaction currency (same as amount for USD)' },
      { field: 'transaction_currency_code', type: 'string', desc: 'Transaction currency' },
      { field: 'transacted_at',           type: 'string', desc: 'ISO 8601 datetime when the transaction occurred' },
      { field: 'posted_at',               type: 'string', desc: 'ISO 8601 datetime when posted to the account' },
      { field: 'voided_at',               type: 'null',   desc: 'Set if the transaction was voided, otherwise null' },
      { field: 'original_txn_id',         type: 'null',   desc: 'Set for refunds or reversals, references the original transaction' },
      { field: 'created_at',              type: 'string', desc: 'ISO 8601 creation timestamp' },
      { field: 'updated_at',              type: 'string', desc: 'ISO 8601 last updated timestamp' },
    ],
  },
  {
    id: 'rewards-config',
    name: 'Rewards Config',
    endpoint: null,
    ourLayer: true,
    note: 'Not part of Method\'s API. This is the application-layer config you define and maintain, keyed by card_product_id from Card Brand.',
    accessedVia: { fn: null, file: 'src/lib/rewardsConfig.js' },
    example: rewardsConfig.cp_chase_sapphire_preferred,
    jsonNote: 'Showing Chase Sapphire Preferred. One entry per card product, keyed by card_product_id.',
    keyNote: true,
    fields: [
      { field: 'card_product_id',            type: 'string', desc: 'Matches brands[].card_product_id from Card Brand. This is the join key between Method data and your rewards config', key: true },
      { field: 'name',                       type: 'string', desc: 'Card product name' },
      { field: 'issuer',                     type: 'string', desc: 'Card issuing bank' },
      { field: 'points_currency',            type: 'string', desc: 'Name of the points or rewards currency (e.g. "Chase Ultimate Rewards")' },
      { field: 'points_value_cents',         type: 'number', desc: 'Value of each point in cents. Chase UR = 1.25, Citi TYP = 1.00. This difference is why UR points beat flat cashback on certain categories', key: true },
      { field: 'reward_rules[]',             type: 'array',  desc: 'Bonus earn rules evaluated in order. First matching rule wins. Empty array means flat rate on everything (e.g. Citi Double Cash)' },
      { field: 'reward_rules[].category',   type: 'string', desc: 'Category name for this rule (e.g. "dining", "travel")' },
      { field: 'reward_rules[].mcc_codes',  type: 'array',  desc: 'MCC codes that trigger this bonus rule. If a transaction MCC is in this list, the multiplier applies', key: true },
      { field: 'reward_rules[].multiplier', type: 'number', desc: 'Points earned per dollar when this rule matches' },
      { field: 'base_multiplier',            type: 'number', desc: 'Points per dollar when no rule matches. Applied to all spend that does not hit a bonus category' },
    ],
  },
  {
    id: 'rewards-optimization',
    name: 'Rewards Optimization',
    endpoint: null,
    ourLayer: true,
    note: 'Not a Method endpoint. This is the computed output of getRewardsOptimization(), which combines all five Method schemas above with the Rewards Config layer to produce the full optimization payload.',
    accessedVia: { fn: 'getRewardsOptimization()', file: 'src/api/insights.js' },
    example: optimizationExample,
    jsonNote: 'by_category is truncated to one entry (dining) for readability. transactions array stripped for brevity.',
    keyNote: true,
    fields: [
      { field: 'period.start',                          type: 'string', desc: 'Analysis period start date' },
      { field: 'period.end',                            type: 'string', desc: 'Analysis period end date' },
      { field: 'summary.total_spend_cents',             type: 'number', desc: 'Total spend across all cards and categories' },
      { field: 'summary.actual_value_cents',            type: 'number', desc: 'Total reward value actually earned with current card usage' },
      { field: 'summary.optimal_value_cents',           type: 'number', desc: 'Total reward value if every transaction used the optimal card' },
      { field: 'summary.missed_value_cents',            type: 'number', desc: 'The gap: optimal minus actual. The headline number shown in the Insights page', key: true },
      { field: 'by_category[]',                         type: 'array',  desc: 'Per-category breakdown. One entry per spend category detected across all transactions' },
      { field: 'by_category[].group',                   type: 'string', desc: 'Category identifier: "dining", "travel", "apple_tech", "groceries", "shopping"' },
      { field: 'by_category[].label',                   type: 'string', desc: 'Display label for the category' },
      { field: 'by_category[].total_spend_cents',       type: 'number', desc: 'Total spend in this category across all cards' },
      { field: 'by_category[].actual.total_value_cents',type: 'number', desc: 'Reward value actually earned in this category' },
      { field: 'by_category[].actual.by_card[]',        type: 'array',  desc: 'Per-card breakdown: spend, multiplier used, points earned, and value for each card used in this category' },
      { field: 'by_category[].optimal.card_product_id', type: 'string', desc: 'The card that maximizes rewards for this category' },
      { field: 'by_category[].optimal.multiplier',      type: 'number', desc: 'Earn rate of the optimal card in this category' },
      { field: 'by_category[].optimal.value_cents',     type: 'number', desc: 'What optimal routing would have earned on this category\'s total spend' },
      { field: 'by_category[].missed_value_cents',      type: 'number', desc: 'Missed reward value for this category. Drives the per-row numbers in the Insights table', key: true },
    ],
  },
]

export default function SchemasTab() {
  return (
    <Tabs orientation="vertical" defaultValue="entity" className="flex flex-col md:flex-row gap-4 md:gap-0 items-start">
      <TabsList className="w-full md:w-52 shrink-0 h-auto glass border border-white/10 p-1.5 flex-row md:flex-col overflow-x-auto md:overflow-visible items-start md:items-stretch self-start md:sticky md:top-6 gap-1">
        {schemas.map((schema) => (
          <TabsTrigger
            key={schema.id}
            value={schema.id}
            className="shrink-0 md:w-full justify-start text-left flex-col items-start gap-0.5 px-3 py-2.5 h-auto rounded-lg"
          >
            <span className="text-xs font-medium leading-snug whitespace-nowrap">{schema.name}</span>
            {schema.ourLayer ? (
              <span className="hidden md:block text-[10px] text-violet-400/70 font-sans font-normal">RewardSense's layer</span>
            ) : (
              <span className="hidden md:block text-[10px] text-muted-foreground/40 font-mono font-normal leading-snug">{schema.endpoint}</span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="flex-1 md:pl-6 min-w-0 w-full">
        {schemas.map((schema) => (
          <TabsContent key={schema.id} value={schema.id}>
            <SchemaPanel schema={schema} />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}
