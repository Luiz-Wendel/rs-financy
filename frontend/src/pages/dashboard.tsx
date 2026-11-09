import { useQuery } from '@apollo/client/react'
import { CircleArrowDown, CircleArrowUp, Wallet } from 'lucide-react'
import { useState } from 'react'

import { DashboardQuery } from '@/api/dashboard'
import { CategoriesOverview } from '@/components/dashboard/categories-overview'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { SummaryCard } from '@/components/dashboard/summary-card'
import { TransactionDialog } from '@/components/transactions/transaction-dialog'
import { getCurrentPeriod } from '@/lib/period'

export function DashboardPage() {
  const [period] = useState(getCurrentPeriod)
  const { data } = useQuery(DashboardQuery, { variables: { period } })
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">Dashboard</h1>

      <section className="grid gap-6 md:grid-cols-3">
        <SummaryCard
          icon={Wallet}
          iconClassName="text-purple-base"
          label="Saldo total"
          value={data?.summary.balance}
        />
        <SummaryCard
          icon={CircleArrowUp}
          iconClassName="text-green-base"
          label="Receitas do mês"
          value={data?.summary.monthIncome}
        />
        <SummaryCard
          icon={CircleArrowDown}
          iconClassName="text-red-base"
          label="Despesas do mês"
          value={data?.summary.monthExpenses}
        />
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <RecentTransactions
          className="lg:col-span-2"
          transactions={data?.recentTransactions.items}
          onNewTransaction={() => setIsTransactionDialogOpen(true)}
        />
        <CategoriesOverview categories={data?.categories} />
      </div>

      <TransactionDialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen} />
    </div>
  )
}
