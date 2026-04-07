import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getTransactions } from '@/api/transactions'
import { getCardBrandByAccountId } from '@/api/accounts'
import CategoryBadge from './CategoryBadge'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatAmount(cents) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function cardShortName(accountId) {
  const brand = getCardBrandByAccountId(accountId)
  const name = brand?.brands?.[0]?.name ?? ''
  if (name.includes('Sapphire')) return 'Chase Sapphire'
  if (name.includes('Apple')) return 'Apple Card'
  if (name.includes('Double Cash')) return 'Citi Double Cash'
  return name || 'Unknown'
}

export default function TransactionTable({ accountId, onRowClick }) {
  const txns = getTransactions({ accountId })

  if (txns.length === 0) {
    return (
      <div className="glass rounded-2xl px-6 py-16 text-center text-muted-foreground text-sm">
        No transactions found.
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/8 hover:bg-transparent">
            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider font-medium w-24">Date</TableHead>
            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Merchant</TableHead>
            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Category</TableHead>
            {!accountId && (
              <TableHead className="hidden md:table-cell text-muted-foreground text-xs uppercase tracking-wider font-medium">Card</TableHead>
            )}
            <TableHead className="text-muted-foreground text-xs uppercase tracking-wider font-medium text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {txns.map((txn) => (
            <TableRow
              key={txn.id}
              onClick={() => onRowClick(txn)}
              className="border-b border-white/5 hover:bg-white/4 transition-colors cursor-pointer"
            >
              <TableCell className="text-muted-foreground text-sm tabular">
                {formatDate(txn.transacted_at)}
              </TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-foreground/85">
                      {txn.merchant?.name ?? txn.descriptor}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    <p className="font-mono">{txn.descriptor}</p>
                    <p className="text-muted-foreground mt-0.5">MCC {txn.merchant_category_code}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                <CategoryBadge label={txn.category_label} group={txn.category_group} />
              </TableCell>
              {!accountId && (
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {cardShortName(txn.account_id)}
                </TableCell>
              )}
              <TableCell className="text-right text-sm font-medium tabular text-foreground/90">
                {formatAmount(txn.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
