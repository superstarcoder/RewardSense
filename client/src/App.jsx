import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from '@/components/layout/Layout'
import WalletPage from '@/pages/WalletPage'
import TransactionsPage from '@/pages/TransactionsPage'
import InsightsPage from '@/pages/InsightsPage'
import LearnMorePage from '@/pages/LearnMorePage'

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/insights" replace />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="learn" element={<LearnMorePage />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  )
}
