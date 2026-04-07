import { useState } from 'react'
import { getAccounts, getBalanceByAccountId } from '@/api/accounts'
import CardGrid from '@/components/wallet/CardGrid'
import CardDetailDrawer from '@/components/wallet/CardDetailDrawer'

function TotalOwed() {
  const accounts = getAccounts()
  const creditCards = accounts.filter(a => a.type === 'liability')

  const totalCents = creditCards.reduce((sum, account) => {
    const balance = getBalanceByAccountId(account.id)
    return sum + (balance?.amount ?? 0)
  }, 0)

  const formatted = (totalCents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return (
    <div className="glass rounded-2xl px-6 py-5 flex items-center justify-between">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Total Owed</p>
        <p className="text-3xl font-semibold tabular mt-1">{formatted}</p>
        <p className="text-xs text-muted-foreground mt-1">Across {creditCards.length} credit cards · March 2026</p>
      </div>
      <div className="text-muted-foreground/30">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      </div>
    </div>
  )
}

export default function WalletPage() {
  const [selectedAccount, setSelectedAccount] = useState(null)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <TotalOwed />
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Your Cards</h2>
        <CardGrid onCardClick={setSelectedAccount} />
      </div>

      <CardDetailDrawer
        account={selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />
    </div>
  )
}
