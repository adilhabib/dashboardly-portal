
import { FC, ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change: number;
  iconBgColor: string;
  changeDirection: 'up' | 'down';
}

const StatsCard: FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  iconBgColor,
  changeDirection
}) => {
  return (
    <div className="stats-card">
      <div className="flex-1">
        <div className={`stats-icon ${iconBgColor}`}>
          {icon}
        </div>
        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        <p className="text-gray-500 text-sm">{title}</p>
        <div className="flex items-center mt-2">
          {changeDirection === 'up' ? (
            <ArrowUp size={16} className="text-sedap-green mr-1" />
          ) : (
            <ArrowDown size={16} className="text-sedap-red mr-1" />
          )}
          <span className={`text-xs font-medium ${changeDirection === 'up' ? 'text-sedap-green' : 'text-sedap-red'}`}>
            {change}% (30 days)
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
