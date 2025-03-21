
import { FC } from 'react';
import { ArrowDown, ArrowUp, BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import { StatsCardProps } from '@/types/charts';
import { Card, CardContent } from '@/components/ui/card';

const StatsCard: FC<Partial<StatsCardProps>> = ({ 
  title, 
  value, 
  description,
  subtitle,
  icon,
  change,
  iconBgColor,
  changeDirection,
  trend,
  trendText
}) => {
  const isPositive = changeDirection === 'up' || (trend !== undefined && trend >= 0);
  const trendValue = change !== undefined ? change : trend;
  
  // Default icon if none provided
  const defaultIcon = isPositive ? 
    <TrendingUp className="h-6 w-6 text-white" /> : 
    <TrendingDown className="h-6 w-6 text-white" />;
  
  // Default background color if none provided
  const defaultBgColor = isPositive ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-2 rounded-full ${iconBgColor || defaultBgColor}`}>
            {icon || defaultIcon}
          </div>
        </div>
        
        <div className="flex items-center mt-2">
          <div className={`p-0.5 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'} mr-1`}>
            {isPositive ? (
              <ArrowUp className="h-3 w-3 text-green-600" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-600" />
            )}
          </div>
          <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trendValue || 0)}% {trendText || (isPositive ? 'increase' : 'decrease')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
