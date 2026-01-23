
import { FC, Dispatch, SetStateAction } from 'react';
import DateFilter from '@/components/DateFilter';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardHeaderProps {
  userName: string;
  dateRange?: { from: Date; to: Date };
  setDateRange?: Dispatch<SetStateAction<{ from: Date; to: Date }>> | ((range: { from: Date; to: Date }) => void);
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ 
  userName,
  dateRange,
  setDateRange
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between'} mb-6 md:mb-8`}>
      <div>
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-800 mb-1 md:mb-2`}>Dashboard</h1>
        <p className={`text-gray-500 ${isMobile ? 'text-sm' : ''}`}>Hi, {userName}. Welcome back to Virginia Admin!</p>
      </div>
      
      {dateRange && setDateRange ? (
        <DateFilter 
          dateRange={dateRange} 
          onChange={setDateRange} 
        />
      ) : (
        <DateFilter 
          startDate="17 April 2023" 
          endDate="24 May 2023" 
        />
      )}
    </div>
  );
};

export default DashboardHeader;
