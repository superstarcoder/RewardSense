import { getRewardsOptimization } from '@/api/insights'
import HeroStats from '@/components/insights/HeroStats'
import OptimizationTable from '@/components/insights/OptimizationTable'
import CardRecommendations from '@/components/insights/CardRecommendations'

export default function InsightsPage() {
  const { summary, by_category } = getRewardsOptimization()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <HeroStats summary={summary} />

      <CardRecommendations byCategory={by_category} />

      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
          Category Breakdown
        </h2>
        <OptimizationTable byCategory={by_category} />
      </div>
    </div>
  )
}
