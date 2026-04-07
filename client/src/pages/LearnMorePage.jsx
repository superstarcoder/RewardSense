import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import SchemasTab from '@/components/learn/SchemasTab'
import RewardsLogicTab from '@/components/learn/RewardsLogicTab'

function SectionHeading({ label }) {
  return (
    <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">{label}</h2>
  )
}

function HeroPitch() {
  return (
    <div className="glass rounded-2xl border border-white/10 p-8 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-primary font-medium tracking-wide">Rewards Intelligence · PoC</span>
        </div>

        <h1 className="text-3xl font-semibold text-foreground leading-tight mb-4">
          What if every fintech app could tell you<br />
          <span className="text-primary">exactly which card to swipe?</span>
        </h1>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          RewardSense is a proof of concept showing what a fintech company could build using Method Financial as their data infrastructure. It analyzes a user's credit card transactions, categorizes them by merchant type using MCC codes, and computes exactly how much reward value they left on the table by not routing spend to their optimal card.
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          The insight: Method already collects everything a rewards engine needs. Account connectivity, transaction history with MCC codes, and card brand identifiers are all available today through Method's existing API. No new data collection required. This is a product waiting to be built.
        </p>

        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/6 px-4 py-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-amber-200/70 leading-relaxed">
            <span className="text-amber-300 font-medium">No live API calls are made in this demo.</span> All data is mocked, but every object (entities, accounts, transactions, balances, card brands) is structured to match Method's real API schema exactly. The goal is to demonstrate what's buildable with Method's data, not to simulate a production integration.
          </p>
        </div>
      </div>
    </div>
  )
}

function ProblemSolution() {
  const items = [
    {
      side: 'Problem',
      color: 'border-orange-500/20 bg-orange-500/5',
      iconColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      textColor: 'text-orange-300',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
      title: 'Rewards are complex, and most people lose',
      points: [
        'The average American holds 4 credit cards, each with different earn rates across dozens of spend categories.',
        'Manually tracking which card maximizes rewards for groceries vs. dining vs. travel is cognitively overwhelming.',
        'The result: billions in reward value go unclaimed every year because spend is not routed optimally.',
      ],
    },
    {
      side: 'Solution',
      color: 'border-emerald-500/20 bg-emerald-500/5',
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      textColor: 'text-emerald-300',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      title: 'Automate the optimization with data you already have',
      points: [
        "Method's API already surfaces MCC-coded transactions, card brand identifiers, and balance data across all of a user's accounts.",
        'A rewards engine can map MCC codes to spend categories to the optimal card automatically, in real time.',
        'The user gets a clear, data-backed answer: "Use your Chase Sapphire for dining. You\'re leaving $3.55/month on the table."',
      ],
    },
  ]

  return (
    <div>
      <SectionHeading label="The Problem & The Solution" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(({ side, color, iconColor, textColor, icon, title, points }) => (
          <div key={side} className={`rounded-2xl border p-6 ${color}`}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className={`p-1.5 rounded-lg border ${iconColor}`}>{icon}</div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${textColor}`}>{side}</span>
            </div>
            <p className="text-sm font-medium text-foreground/90 mb-3">{title}</p>
            <ul className="space-y-2">
              {points.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${side === 'Problem' ? 'bg-orange-400' : 'bg-emerald-400'}`} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function MethodDataSection() {
  const dataPoints = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      ),
      label: 'MCC-Coded Transactions',
      endpoint: 'GET /accounts/{id}/payments',
      description: 'Every transaction carries a Merchant Category Code, a 4-digit identifier that precisely classifies the merchant type. MCC 5812 means a restaurant. MCC 4111 means transit. This is the core signal that drives category-level rewards optimization.',
      highlight: 'MCC codes are the key. No AI or heuristics needed.',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M16 12h.01" />
        </svg>
      ),
      label: 'Card Brand & Product ID',
      endpoint: 'GET /accounts/{id}/card_brands',
      description: "Method surfaces the specific card product identifier for each credit card in a user's wallet. This links directly to the card's rewards structure: which categories earn bonus points, what the base multiplier is, and what each point is worth.",
      highlight: 'card_product_id is the bridge between account data and rewards config.',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      label: 'Account Connectivity',
      endpoint: 'GET /entities/{id} · GET /accounts',
      description: "Method aggregates all of a user's financial accounts in one place: credit cards, checking accounts, and liabilities, all linked to a single entity. This makes cross-card analysis trivial. You know the full wallet, not just one card.",
      highlight: 'Cross-account view is what makes optimization possible.',
    },
  ]

  return (
    <div>
      <SectionHeading label="What Method Already Has" />
      <div className="space-y-3">
        {dataPoints.map(({ icon, label, endpoint, description, highlight }) => (
          <div key={label} className="glass rounded-2xl border border-white/10 p-5 flex gap-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0 h-fit mt-0.5">
              {icon}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <p className="text-sm font-semibold text-foreground/90">{label}</p>
                <code className="text-[11px] px-2 py-0.5 rounded-md bg-white/6 border border-white/10 text-muted-foreground font-mono">{endpoint}</code>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">{description}</p>
              <div className="inline-flex items-center gap-1.5 text-[11px] text-primary/80 bg-primary/6 border border-primary/15 px-2.5 py-1 rounded-lg">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {highlight}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function B2BOpportunity() {
  const customers = [
    {
      label: 'Neobanks',
      icon: '🏦',
      description: 'Offer users a rewards optimizer as a premium feature. Differentiate on financial intelligence, not just fee-free banking.',
    },
    {
      label: 'Wallet Apps',
      icon: '👛',
      description: 'Surface real-time card recommendations at the moment of purchase. "Tap Chase for this restaurant. You\'ll earn 3x instead of 2x."',
    },
    {
      label: 'Personal Finance Apps',
      icon: '📊',
      description: 'Move beyond expense tracking. Show users not just what they spent, but how much reward value they captured and what they missed.',
    },
    {
      label: 'Card Issuers',
      icon: '💳',
      description: "Show cardholders their card's performance vs. alternatives. Increase engagement and reduce churn by proving your card's value.",
    },
  ]

  return (
    <div>
      <SectionHeading label="What This Means for Method's Customers" />
      <div className="glass rounded-2xl border border-white/10 p-6 relative overflow-hidden mb-4">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        <p className="text-sm text-foreground/80 leading-relaxed relative">
          Any company building on Method's API has access to the same data this PoC uses. Account aggregation, MCC-coded transaction history, and card brand identifiers are already part of the API response. That means a <span className="text-foreground font-medium">Rewards Intelligence feature</span> is within reach for any Method customer, with no additional data infrastructure required on their end.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3 relative">
          RewardSense demonstrates one implementation of that idea. A fintech company building on Method could ship per-category optimization data, card recommendations, and missed-value metrics as a consumer-facing feature using endpoints they're already calling.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {customers.map(({ label, icon, description }) => (
          <div key={label} className="glass rounded-xl border border-white/8 p-4">
            <div className="text-xl mb-2">{icon}</div>
            <p className="text-xs font-semibold text-foreground/90 mb-1.5">{label}</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExploreSection() {
  const tabs = [
    { label: 'Insights', path: '/insights', description: 'See the rewards optimization output: missed value by category and card recommendations.' },
    { label: 'Wallet', path: '/wallet', description: 'Browse the mocked credit card accounts and their balances.' },
    { label: 'Transactions', path: '/transactions', description: 'View all 27 mocked transactions with MCC-based category labels.' },
  ]

  return (
    <div>
      <SectionHeading label="Explore the Demo" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tabs.map(({ label, path, description }) => (
          <Link
            key={label}
            to={path}
            className="glass rounded-xl border border-white/8 p-4 group hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-foreground/90 group-hover:text-primary transition-colors">{label}</p>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary transition-colors">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
          </Link>
        ))}
      </div>

      <a
        href="https://github.com/superstarcoder/RewardSense"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-between glass rounded-xl border border-white/8 p-4 group hover:border-white/20 hover:bg-white/5 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground group-hover:text-foreground/80 transition-colors shrink-0">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-foreground/90 group-hover:text-foreground/80 transition-colors">View Source on GitHub</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">superstarcoder/RewardSense</p>
          </div>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-foreground/60 transition-colors shrink-0">
          <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
        </svg>
      </a>
    </div>
  )
}

function FlowArrow() {
  return (
    <div className="shrink-0 flex items-start justify-center w-7 pt-[2.1rem]">
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none" className="text-white/20">
        <path d="M0 5H16M11 1L16 5L11 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function FlowDiagram() {
  const layers = [
    {
      id: 'method-api',
      label: 'Method API',
      sublabel: 'Real endpoints not called',
      note: 'Schema mirrored in src/data/',
      headerTheme: 'text-amber-400/90 bg-amber-400/8 border-amber-400/20',
      containerTheme: 'border-amber-400/12 bg-amber-400/3',
      boxTheme: 'border-amber-400/15 bg-amber-400/4 font-mono',
      textTheme: 'text-amber-300/60',
      dashed: true,
      items: [
        { name: 'GET /entities/{id}',             desc: 'User identity & address' },
        { name: 'GET /accounts',                   desc: 'All financial accounts' },
        { name: 'GET /accounts/{id}/balances',     desc: 'Current balances' },
        { name: 'GET /accounts/{id}/card_brands',  desc: 'Card product identifiers' },
        { name: 'GET /accounts/{id}/payments',     desc: 'Transaction history + MCC' },
      ],
    },
    {
      id: 'data',
      label: 'Data Layer',
      sublabel: 'src/data/',
      note: 'Mock objects matching Method schema',
      headerTheme: 'text-blue-300 bg-blue-500/10 border-blue-500/25',
      containerTheme: 'border-blue-500/15 bg-blue-500/4',
      boxTheme: 'border-blue-500/20 bg-blue-500/6 font-mono',
      textTheme: 'text-blue-200/75',
      items: [
        { name: 'entity.js',       desc: 'Alex Johnson, NYC' },
        { name: 'accounts.js',     desc: '3 credit cards + checking' },
        { name: 'balances.js',     desc: 'Amounts in cents' },
        { name: 'cardBrands.js',   desc: 'card_product_id per account' },
        { name: 'transactions.js', desc: '27 txns, March 2026' },
      ],
    },
    {
      id: 'lib',
      label: 'Logic Layer',
      sublabel: 'src/lib/',
      note: 'Value-add, not from Method',
      headerTheme: 'text-violet-300 bg-violet-500/10 border-violet-500/25',
      containerTheme: 'border-violet-500/15 bg-violet-500/4',
      boxTheme: 'border-violet-500/20 bg-violet-500/6 font-mono',
      textTheme: 'text-violet-200/75',
      items: [
        { name: 'mccCategories.js', desc: 'MCC code to category' },
        { name: 'rewardsConfig.js', desc: 'Earn rates per card' },
        { name: 'optimizer.js',     desc: 'Computes missed value' },
      ],
    },
    {
      id: 'api',
      label: 'API Layer',
      sublabel: 'src/api/',
      note: 'Composes data + logic into output',
      headerTheme: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
      containerTheme: 'border-emerald-500/15 bg-emerald-500/4',
      boxTheme: 'border-emerald-500/20 bg-emerald-500/6 font-mono',
      textTheme: 'text-emerald-200/75',
      items: [
        { name: 'entity.js',       desc: 'getEntity()' },
        { name: 'accounts.js',     desc: 'getAccounts(), getBalances()' },
        { name: 'transactions.js', desc: 'getTransactions()' },
        { name: 'insights.js',     desc: 'getRewardsOptimization()' },
      ],
    },
    {
      id: 'pages',
      label: 'UI Layer',
      sublabel: 'src/pages/',
      note: 'One page per sidebar tab',
      headerTheme: 'text-foreground/60 bg-white/6 border-white/12',
      containerTheme: 'border-white/10 bg-white/3',
      boxTheme: 'border-white/10 bg-white/5 font-mono',
      textTheme: 'text-foreground/50',
      items: [
        { name: 'WalletPage',       desc: 'Cards & balances' },
        { name: 'TransactionsPage', desc: 'Transaction list' },
        { name: 'InsightsPage',     desc: 'Rewards optimization' },
      ],
    },
  ]

  return (
    <div>
      <SectionHeading label="Data Flow" />
      <div className="glass rounded-2xl border border-white/10 p-5 overflow-x-auto">
        <div className="flex items-start min-w-[720px]">
          {layers.flatMap((layer, i) => [
            i > 0 && <FlowArrow key={`arrow-${i}`} />,
            <div key={layer.id} className={`flex-1 rounded-xl border p-3 ${layer.containerTheme} ${layer.dashed ? 'border-dashed' : ''}`}>
              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider mb-1 ${layer.headerTheme}`}>
                {layer.label}
              </div>
              <p className="text-[10px] text-muted-foreground mb-0.5 pl-0.5">{layer.sublabel}</p>
              <p className="text-[10px] text-muted-foreground/60 mb-3 pl-0.5 italic">{layer.note}</p>
              <div className="space-y-1.5">
                {layer.items.map(item => (
                  <div key={item.name} className={`rounded-lg border px-2.5 py-2 ${layer.boxTheme}`}>
                    <p className={`text-[11px] font-medium leading-snug ${layer.textTheme}`}>{item.name}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-snug font-sans">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>,
          ].filter(Boolean))}
        </div>
      </div>
    </div>
  )
}

function FileTree() {
  const tree = [
    {
      name: 'src/',
      type: 'root',
      children: [
        {
          name: 'data/',
          type: 'folder',
          color: 'text-blue-300',
          desc: 'Mock API responses, mirrors Method schema exactly',
          last: false,
          children: [
            { name: 'entity.js',       desc: 'Single entity: Alex Johnson, NYC, DOB' },
            { name: 'accounts.js',     desc: '4 accounts: Chase Sapphire, Apple Card, Citi Double Cash, Chase Checking' },
            { name: 'balances.js',     desc: 'Balance sub-resource per account, amounts in cents' },
            { name: 'cardBrands.js',   desc: 'card_product_id per credit account, links account to rewards config' },
            { name: 'transactions.js', desc: '27 transactions across 5 MCC categories, March 2026', last: true },
          ],
        },
        {
          name: 'lib/',
          type: 'folder',
          color: 'text-violet-300',
          desc: 'Value-add logic layer, not from Method. This is what you build on top.',
          last: false,
          children: [
            { name: 'mccCategories.js', desc: 'Maps MCC codes to category groups: dining, travel, apple_tech, groceries, shopping' },
            { name: 'rewardsConfig.js', desc: 'Earn rates, base multipliers, and point values keyed by card_product_id' },
            { name: 'optimizer.js',     desc: 'Core engine: computes actual vs. optimal reward value per transaction, finds missed value', last: true },
          ],
        },
        {
          name: 'api/',
          type: 'folder',
          color: 'text-emerald-300',
          desc: 'Thin functions that load data and run lib logic, analogous to API route handlers',
          last: false,
          children: [
            { name: 'entity.js',       desc: 'getEntity()' },
            { name: 'accounts.js',     desc: 'getAccounts(), getBalances(), getCardBrands()' },
            { name: 'transactions.js', desc: 'getTransactions(), returns enriched transactions with category labels' },
            { name: 'insights.js',     desc: 'getRewardsOptimization(), the main output: summary + per-category breakdown', last: true },
          ],
        },
        {
          name: 'pages/',
          type: 'folder',
          color: 'text-foreground/60',
          desc: 'One React page per sidebar tab',
          last: false,
          children: [
            { name: 'WalletPage.jsx',       desc: 'Renders card grid and balance data' },
            { name: 'TransactionsPage.jsx', desc: 'Transaction table with MCC-based category badges' },
            { name: 'InsightsPage.jsx',     desc: 'Hero stats, card recommendations, optimization table' },
            { name: 'LearnMorePage.jsx',    desc: 'This page', last: true },
          ],
        },
        {
          name: 'components/',
          type: 'folder',
          color: 'text-foreground/60',
          desc: 'UI components organized by page (wallet/, transactions/, insights/, layout/, ui/)',
          last: true,
          children: [],
        },
      ],
    },
  ]

  const folderColors = {
    'text-blue-300':       { file: 'text-blue-200/70',   line: 'bg-blue-500/20' },
    'text-violet-300':     { file: 'text-violet-200/70', line: 'bg-violet-500/20' },
    'text-emerald-300':    { file: 'text-emerald-200/70',line: 'bg-emerald-500/20' },
    'text-foreground/60':  { file: 'text-foreground/40', line: 'bg-white/10' },
  }

  return (
    <div>
      <SectionHeading label="File Structure" />
      <div className="glass rounded-2xl border border-white/10 p-6 font-mono text-[12px]">
        <p className="text-foreground/50 mb-4">src/</p>
        <div className="space-y-5">
          {tree[0].children.map((folder, fi) => {
            const isLastFolder = fi === tree[0].children.length - 1
            const colors = folderColors[folder.color] ?? folderColors['text-foreground/60']
            return (
              <div key={folder.name}>
                <div className="flex items-baseline gap-3">
                  <span className="text-white/25 select-none">{isLastFolder ? '└──' : '├──'}</span>
                  <span className={`font-semibold ${folder.color}`}>{folder.name}</span>
                  <span className="text-[11px] text-muted-foreground/50 font-sans font-normal">{folder.desc}</span>
                </div>
                {folder.children.length > 0 && (
                  <div className="ml-4 mt-2 space-y-1.5 pl-4 border-l border-white/8">
                    {folder.children.map((file) => (
                      <div key={file.name} className="flex items-baseline gap-3">
                        <span className="text-white/20 select-none shrink-0">{file.last ? '└──' : '├──'}</span>
                        <span className={colors.file}>{file.name}</span>
                        <span className="text-[11px] text-muted-foreground/40 font-sans font-normal">{file.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ArchitectureTab() {
  return (
    <div className="space-y-10">
      <FlowDiagram />
      <FileTree />
    </div>
  )
}

function ComingSoon({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="p-3 rounded-xl bg-white/6 border border-white/10 mb-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <p className="text-sm font-medium text-foreground/70">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
    </div>
  )
}

const TABS = [
  { id: 'overview',      label: 'Overview' },
  { id: 'architecture',  label: 'Architecture' },
  { id: 'schemas',       label: 'Schemas' },
  { id: 'rewards-logic', label: 'Rewards Logic' },
]

function TabNav({ current, onChange }) {
  const idx  = TABS.findIndex(t => t.id === current)
  const prev = TABS[idx - 1]
  const next = TABS[idx + 1]

  function go(id) {
    onChange(id)
  }

  return (
    <div className="flex items-center justify-between mt-14 pt-6 border-t border-white/8">
      {prev ? (
        <button
          onClick={() => go(prev.id)}
          className="group flex items-center gap-3 glass border border-white/10 rounded-xl px-4 py-3 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary transition-colors shrink-0">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          <div className="text-left">
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">Previous</p>
            <p className="text-xs font-medium text-foreground/80 group-hover:text-primary transition-colors">{prev.label}</p>
          </div>
        </button>
      ) : <div />}

      {next ? (
        <button
          onClick={() => go(next.id)}
          className="group flex items-center gap-3 glass border border-white/10 rounded-xl px-4 py-3 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
        >
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">Next</p>
            <p className="text-xs font-medium text-foreground/80 group-hover:text-primary transition-colors">{next.label}</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary transition-colors shrink-0">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      ) : <div />}
    </div>
  )
}

export default function LearnMorePage() {
  const [tab, setTab] = useState('overview')

  function switchTab(id) {
    setTab(id)
    document.documentElement.scrollTop = 0
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Tabs value={tab} onValueChange={switchTab}>
        <TabsList className="mb-8 glass border border-white/10 h-auto p-1 w-full sm:w-fit">
          {TABS.map(({ id, label }) => (
            <TabsTrigger key={id} value={id} className="text-xs px-4 py-2">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-8" style={{ '--primary': 'oklch(0.52 0.22 255)', '--ring': 'oklch(0.52 0.22 255 / 50%)' }}>
            <HeroPitch />
            <ProblemSolution />
            <MethodDataSection />
            <B2BOpportunity />
            <ExploreSection />
          </div>
          <TabNav current={tab} onChange={setTab} />
        </TabsContent>

        <TabsContent value="architecture">
          <ArchitectureTab />
          <TabNav current={tab} onChange={setTab} />
        </TabsContent>

        <TabsContent value="schemas">
          <SchemasTab />
          <TabNav current={tab} onChange={setTab} />
        </TabsContent>

        <TabsContent value="rewards-logic">
          <RewardsLogicTab />
          <TabNav current={tab} onChange={setTab} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
