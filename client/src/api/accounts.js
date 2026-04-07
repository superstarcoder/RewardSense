import accounts from '../data/accounts'
import balances from '../data/balances'
import cardBrands from '../data/cardBrands'

export function getAccounts({ expand = [] } = {}) {
  return accounts.map(account => expandAccount(account, expand))
}

export function getAccountById(id, { expand = [] } = {}) {
  const account = accounts.find(a => a.id === id)
  if (!account) return null
  return expandAccount(account, expand)
}

export function getBalanceByAccountId(id) {
  return balances.find(b => b.account_id === id) || null
}

export function getCardBrandByAccountId(id) {
  const account = accounts.find(a => a.id === id)
  if (!account || account.type !== 'liability') return null
  return cardBrands.find(c => c.account_id === id) || null
}

function expandAccount(account, expand) {
  const result = { ...account }
  if (expand.includes('balance')) {
    result.balance = balances.find(b => b.account_id === account.id) || null
  }
  if (expand.includes('card_brand')) {
    result.card_brand = account.type === 'liability'
      ? cardBrands.find(c => c.account_id === account.id) || null
      : null
  }
  return result
}
