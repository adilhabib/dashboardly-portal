
import { FC } from 'react';
import StatsCard from '@/components/StatsCard';
import { ShoppingBag, Package, Receipt, DollarSign } from 'lucide-react';

const DashboardStatsCards: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        title="Total Orders" 
        value="75" 
        icon={<ShoppingBag size={24} className="text-emerald-500" />}
        change={4.5}
        iconBgColor="bg-emerald-100"
        changeDirection="up"
        trendText="increase"
      />
      
      <StatsCard 
        title="Total Delivered" 
        value="357" 
        icon={<Package size={24} className="text-blue-500" />}
        change={4.5}
        iconBgColor="bg-blue-100"
        changeDirection="up"
        trendText="increase"
      />
      
      <StatsCard 
        title="Total Canceled" 
        value="65" 
        icon={<Receipt size={24} className="text-red-500" />}
        change={25.5}
        iconBgColor="bg-red-100"
        changeDirection="down"
        trendText="decrease"
      />
      
      <StatsCard 
        title="Total Revenue" 
        value="$128" 
        icon={<DollarSign size={24} className="text-emerald-500" />}
        change={12.5}
        iconBgColor="bg-emerald-100"
        changeDirection="up"
        trendText="increase"
      />
    </div>
  );
};

export default DashboardStatsCards;
