import { getAccounts, getBalanceByAccountId, getCardBrandByAccountId } from '@/api/accounts'
import CreditCard from './CreditCard'

export default function CardGrid({ onCardClick }) {
  const accounts = getAccounts()

  const creditCards = accounts.filter(a => a.type === 'liability')
  const checking = accounts.filter(a => a.type === 'ach')

  const enriched = [...creditCards, ...checking].map(account => ({
    account,
    balance: getBalanceByAccountId(account.id),
    cardBrand: getCardBrandByAccountId(account.id),
  }))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {enriched.map(({ account, balance, cardBrand }) => {
        const isClickable = account.type === 'liability'

        return (
          <div
            key={account.id}
            onClick={() => isClickable && onCardClick(account)}
            className={isClickable ? 'cursor-pointer rounded-2xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl' : ''}
          >
            <CreditCard account={account} balance={balance} cardBrand={cardBrand} />
          </div>
        )
      })}
    </div>
  )
}
