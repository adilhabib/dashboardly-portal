
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        icon={<TrendingUp className="h-6 w-6 text-white" />}
        change={12.6}
        iconBgColor="bg-green-500"
        changeDirection="up"
      />
      
      <StatsCard
        title="Total Orders"
        value={totalOrders.toString()}
        icon={<ShoppingCart className="h-6 w-6 text-white" />}
        change={4.3}
        iconBgColor="bg-blue-500"
        changeDirection="up"
      />
      
      <StatsCard
        title="Average Order Value"
        value={formatCurrency(avgOrderValue)}
        icon={<BarChart3 className="h-6 w-6 text-white" />}
        change={8.2}
        iconBgColor="bg-purple-500"
        changeDirection="up"
      />
      
      <StatsCard
        title="Total Foods"
        value={totalFoods.toString()}
        icon={<Users className="h-6 w-6 text-white" />}
        change={2.1}
        iconBgColor="bg-orange-500"
        changeDirection="up"
      />
    </div>
  );
};

export default AnalyticsStatsCards;
