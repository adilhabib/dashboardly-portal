
import { FC } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { StatsCardProps } from '@/types/charts';
import { Card, CardContent } from '@/components/ui/card';

const StatsCard: FC<StatsCardProps> = ({ 
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
  const isPositive = changeDirection === 'up';
  
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
          <div className={`p-2 rounded-full ${iconBgColor}`}>
            {icon}
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
            {Math.abs(change || (trend || 0))}% {trendText || (isPositive ? 'increase' : 'decrease')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
