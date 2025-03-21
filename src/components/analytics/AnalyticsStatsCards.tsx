
import { FC } from 'react';
import StatsCard from '@/components/StatsCard';
import { DollarSign, ShoppingCart, BarChart3, UtensilsCrossed } from 'lucide-react';

interface AnalyticsStatsCardsProps {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalFoods: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const AnalyticsStatsCards: FC<AnalyticsStatsCardsProps> = ({
  totalRevenue,
  totalOrders,
  avgOrderValue,
  totalFoods,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        description="Total sales revenue"
        trend={7.2}
        trendText="from last period"
        icon={<DollarSign className="h-6 w-6 text-white" />}
        iconBgColor="bg-green-500"
        changeDirection="up"
        change={7.2}
      />
      <StatsCard
        title="Orders"
        value={totalOrders.toString()}
        description="Total number of orders"
        trend={-2.5}
        trendText="from last period"
        icon={<ShoppingCart className="h-6 w-6 text-white" />}
        iconBgColor="bg-blue-500"
        changeDirection="down"
        change={-2.5}
      />
      <StatsCard
        title="Average Order Value"
        value={formatCurrency(avgOrderValue)}
        description="Average value per order"
        trend={3.1}
        trendText="from last period"
        icon={<BarChart3 className="h-6 w-6 text-white" />}
        iconBgColor="bg-purple-500"
        changeDirection="up"
        change={3.1}
      />
      <StatsCard
        title="Menu Items"
        value={totalFoods.toString()}
        description="Active menu items"
        trend={0}
        trendText="unchanged"
        icon={<UtensilsCrossed className="h-6 w-6 text-white" />}
        iconBgColor="bg-amber-500"
        changeDirection="up"
        change={0}
      />
    </div>
  );
};

export default AnalyticsStatsCards;
