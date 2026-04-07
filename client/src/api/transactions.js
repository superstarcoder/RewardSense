import transactions from '../data/transactions'
import { getCategory } from '../lib/mccCategories'

// All transactions, optionally filtered by account.
// Each transaction is enriched with a resolved category label and group.
export function getTransactions({ accountId } = {}) {
  const filtered = accountId
    ? transactions.filter(t => t.account_id === accountId)
    : transactions

  return filtered
    .map(enrichTransaction)
    .sort((a, b) => new Date(a.transacted_at) - new Date(b.transacted_at))
}

export function getTransactionsByAccountId(id) {
  return getTransactions({ accountId: id })
}

export function getTransactionById(id) {
  const txn = transactions.find(t => t.id === id)
  return txn ? enrichTransaction(txn) : null
}

function enrichTransaction(txn) {
  const category = getCategory(txn.merchant_category_code)
  return {
    ...txn,
    category_label: category.label,
    category_group: category.group,
  }
}
