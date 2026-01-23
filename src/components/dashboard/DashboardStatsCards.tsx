
import { FC } from 'react';
import StatsCard from '@/components/StatsCard';
import { ShoppingBag, Package, Receipt, DollarSign } from 'lucide-react';
import { AnalyticsData } from '@/services/analyticsService';
import { formatCurrency } from '@/lib/utils';

interface DashboardStatsCardsProps {
  analyticsData?: AnalyticsData;
}

const DashboardStatsCards: FC<DashboardStatsCardsProps> = ({ analyticsData }) => {
  // Calculate percentages of order statuses
  const completedOrders = analyticsData?.statusData.find(status => status.name === 'Completed')?.value || 0;
  const canceledOrders = analyticsData?.statusData.find(status => status.name === 'Cancelled')?.value || 0;
  
  // Calculate percentage changes (typically would compare to previous period)
  const orderChange = 4.5; // placeholder for now
  const revenueChange = 12.5; // placeholder for now
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
      <StatsCard 
        title="Total Orders" 
        value={analyticsData?.totalOrders.toString() || '0'} 
        icon={<ShoppingBag size={24} className="text-emerald-500" />}
        change={orderChange}
        iconBgColor="bg-emerald-100"
        changeDirection="up"
        trendText="increase"
      />
      
      <StatsCard 
        title="Completed Orders" 
        value={completedOrders.toString()} 
        icon={<Package size={24} className="text-blue-500" />}
        change={4.5}
        iconBgColor="bg-blue-100"
        changeDirection="up"
        trendText="increase"
      />
      
      <StatsCard 
        title="Canceled Orders" 
        value={canceledOrders.toString()} 
        icon={<Receipt size={24} className="text-red-500" />}
        change={2.5}
        iconBgColor="bg-red-100"
        changeDirection="down"
        trendText="decrease"
      />
      
      <StatsCard 
        title="Total Revenue" 
        value={formatCurrency(analyticsData?.totalRevenue || 0)} 
        icon={<DollarSign size={24} className="text-emerald-500" />}
        change={revenueChange}
        iconBgColor="bg-emerald-100"
        changeDirection="up"
        trendText="increase"
      />
    </div>
  );
};

export default DashboardStatsCards;
