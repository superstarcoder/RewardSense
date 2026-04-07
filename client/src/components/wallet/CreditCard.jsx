// Card gradient themes keyed by card_product_id
const cardThemes = {
  cp_chase_sapphire_preferred: {
    gradient: 'from-[#0a1628] via-[#1a3a6e] to-[#0d2654]',
    accent: 'rgba(59,130,246,0.3)',
    highlight: 'rgba(100,160,255,0.15)',
    network: 'visa',
  },
  cp_apple_card: {
    gradient: 'from-[#1a1a1a] via-[#2d2d2d] to-[#111111]',
    accent: 'rgba(255,255,255,0.12)',
    highlight: 'rgba(255,255,255,0.08)',
    network: 'mastercard',
  },
  cp_citi_double_cash: {
    gradient: 'from-[#0a2a2a] via-[#0f3f3f] to-[#072222]',
    accent: 'rgba(20,184,166,0.3)',
    highlight: 'rgba(45,212,191,0.1)',
    network: 'mastercard',
  },
}

const defaultTheme = {
  gradient: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
  accent: 'rgba(255,255,255,0.1)',
  highlight: 'rgba(255,255,255,0.06)',
  network: null,
}

function VisaLogo() {
  return (
    <span className="text-white/90 font-bold text-lg tracking-wider" style={{ fontFamily: 'serif', letterSpacing: '0.05em' }}>
      VISA
    </span>
  )
}

function MastercardLogo() {
  return (
    <div className="flex items-center">
      <div className="w-6 h-6 rounded-full bg-red-500/80" />
      <div className="w-6 h-6 rounded-full bg-yellow-400/80 -ml-3" />
    </div>
  )
}

function NetworkLogo({ network }) {
  if (network === 'visa') return <VisaLogo />
  if (network === 'mastercard') return <MastercardLogo />
  return null
}

// Checking account card (different style)
function CheckingCard({ account, balance }) {
  const amount = balance ? (balance.amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }) : '—'

  return (
    <div className="relative rounded-2xl p-5 overflow-hidden select-none"
      style={{
        aspectRatio: '1.586',
        background: 'linear-gradient(135deg, #0f1923 0%, #1a2a3a 50%, #0a1520 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}>
      {/* Shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">Chase</p>
            <p className="text-white/80 text-sm font-medium mt-0.5">Checking</p>
          </div>
          <div className="text-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="8" width="18" height="13" rx="2" />
              <path d="M7 8V6a5 5 0 0 1 10 0v2" />
            </svg>
          </div>
        </div>

        <div>
          <p className="text-white/35 text-[10px] tracking-widest mb-1">AVAILABLE BALANCE</p>
          <p className="text-white/90 text-xl font-semibold tabular">{amount}</p>
          <p className="text-white/30 text-xs mt-1">••••{account.ach?.number?.slice(-4)}</p>
        </div>
      </div>
    </div>
  )
}

export default function CreditCard({ account, balance, cardBrand }) {
  // Handle checking account
  if (account.type === 'ach') {
    return <CheckingCard account={account} balance={balance} />
  }

  const brand = cardBrand?.brands?.[0]
  const productId = brand?.card_product_id
  const theme = cardThemes[productId] ?? defaultTheme

  const balanceAmount = balance
    ? (balance.amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : '—'

  const cardName = brand?.name ?? account.liability?.name ?? 'Card'
  const issuer = brand?.issuer ?? ''
  const mask = account.liability?.mask ?? '••••'

  return (
    <div
      className={`relative rounded-2xl p-5 overflow-hidden select-none bg-gradient-to-br ${theme.gradient}`}
      style={{
        aspectRatio: '1.586',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* Background glow blob */}
      <div
        className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ background: theme.accent }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-2xl pointer-events-none"
        style={{ background: theme.highlight }}
      />

      {/* Card content */}
      <div className="relative flex flex-col justify-between h-full">
        {/* Top row: issuer + network */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">{issuer}</p>
            <p className="text-white/85 text-sm font-medium mt-0.5 leading-tight">{cardName}</p>
          </div>
          <NetworkLogo network={theme.network} />
        </div>

        {/* Bottom row: balance + last 4 */}
        <div>
          <p className="text-white/35 text-[10px] uppercase tracking-widest mb-1">Current Balance</p>
          <p className="text-white text-2xl font-semibold tabular">{balanceAmount}</p>
          <p className="text-white/40 text-xs tracking-[0.2em] mt-1.5">•••• •••• •••• {mask}</p>
        </div>
      </div>
    </div>
  )
}
