
import { FC } from 'react';
import DateFilter from '@/components/DateFilter';

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ userName }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-500">Hi, {userName}. Welcome back to Sedap Admin!</p>
      </div>
      
      <DateFilter startDate="17 April 2023" endDate="24 May 2023" />
    </div>
  );
};

export default DashboardHeader;
