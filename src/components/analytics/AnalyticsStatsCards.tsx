
import { FC } from 'react';
import { BarChart3, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { formatCurrency } from '@/lib/utils';

interface AnalyticsStatsCardsProps {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalFoods: number;
}

const AnalyticsStatsCards: FC<AnalyticsStatsCardsProps> = ({
  totalRevenue,
  totalOrders,
  avgOrderValue,
  totalFoods
}) => {
  // Calculate trend percentages (in a real application, these would be calculated 
  // by comparing current period with previous period)
  const revenueTrend = totalRevenue > 0 ? 12.6 : 0;
  const ordersTrend = totalOrders > 0 ? 4.3 : 0;
  const avgValueTrend = avgOrderValue > 0 ? 8.2 : 0;
  const foodsTrend = totalFoods > 0 ? 2.1 : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        icon={<TrendingUp className="h-6 w-6 text-white" />}
        change={revenueTrend}
        iconBgColor="bg-green-500"
        changeDirection="up"
      />
      
      <StatsCard
        title="Total Orders"
        value={totalOrders.toString()}
        icon={<ShoppingCart className="h-6 w-6 text-white" />}
        change={ordersTrend}
        iconBgColor="bg-blue-500"
        changeDirection="up"
      />
      
      <StatsCard
        title="Avg Order Value"
        value={formatCurrency(avgOrderValue)}
        icon={<BarChart3 className="h-6 w-6 text-white" />}
        change={avgValueTrend}
        iconBgColor="bg-purple-500"
        changeDirection="up"
      />
      
      <StatsCard
        title="Total Foods"
        value={totalFoods.toString()}
        icon={<Users className="h-6 w-6 text-white" />}
        change={foodsTrend}
        iconBgColor="bg-orange-500"
        changeDirection="up"
      />
    </div>
  );
};

export default AnalyticsStatsCards;
