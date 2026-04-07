import transactions from '../data/transactions'
import accounts from '../data/accounts'
import cardBrands from '../data/cardBrands'
import { computeRewardsOptimization } from '../lib/optimizer'

export function getRewardsOptimization() {
  return computeRewardsOptimization(transactions, accounts, cardBrands)
}
