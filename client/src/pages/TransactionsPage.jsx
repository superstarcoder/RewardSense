import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAccounts } from '@/api/accounts'
import { getCardBrandByAccountId } from '@/api/accounts'
import TransactionTable from '@/components/transactions/TransactionTable'
import TransactionDetailDrawer from '@/components/transactions/TransactionDetailDrawer'

const CARD_ORDER = [
  'acc_3f7x9k2p1m', // Chase Sapphire
  'acc_7n4mz8qr5t', // Apple Card
  'acc_2w6vb1hs9y', // Citi Double Cash
]

function tabLabel(account) {
  const brand = getCardBrandByAccountId(account.id)
  const name = brand?.brands?.[0]?.name ?? account.liability?.name ?? 'Card'
  if (name.includes('Sapphire')) return 'Chase Sapphire'
  if (name.includes('Apple')) return 'Apple Card'
  if (name.includes('Double Cash')) return 'Citi Double Cash'
  return name
}

export default function TransactionsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [selectedTxn, setSelectedTxn] = useState(null)

  const accounts = getAccounts()
  const creditCards = CARD_ORDER
    .map(id => accounts.find(a => a.id === id))
    .filter(Boolean)

  // URL param drives the active tab; default to 'all'
  const activeTab = searchParams.get('account') ?? 'all'

  function handleTabChange(value) {
    if (value === 'all') {
      navigate('/transactions')
    } else {
      navigate(`/transactions?account=${value}`)
    }
  }

  const accountId = activeTab === 'all' ? null : activeTab

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="glass border border-white/10 bg-transparent h-9 p-1 gap-1">
          <TabsTrigger
            value="all"
            className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/25 data-[state=inactive]:text-muted-foreground rounded-md px-3 h-7"
          >
            All Cards
          </TabsTrigger>
          {creditCards.map(account => (
            <TabsTrigger
              key={account.id}
              value={account.id}
              className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/25 data-[state=inactive]:text-muted-foreground rounded-md px-3 h-7"
            >
              {tabLabel(account)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <TransactionTable accountId={accountId} onRowClick={setSelectedTxn} />

      <TransactionDetailDrawer
        txn={selectedTxn}
        onClose={() => setSelectedTxn(null)}
      />
    </div>
  )
}
