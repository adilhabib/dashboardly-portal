
import { FC, Dispatch, SetStateAction } from 'react';
import DateFilter from '@/components/DateFilter';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useIsMobile } from '@/hooks/use-mobile';

interface AnalyticsHeaderProps {
  dateRange: { from: Date; to: Date };
  setDateRange: Dispatch<SetStateAction<{ from: Date; to: Date }>> | ((range: { from: Date; to: Date }) => void);
}

const AnalyticsHeader: FC<AnalyticsHeaderProps> = ({ dateRange, setDateRange }) => {
  const isMobile = useIsMobile();

  return (
    <>
      <PageBreadcrumb pageName="Analytics" />
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row justify-between items-center'} mb-4 md:mb-6 gap-3 md:gap-4`}>
        <div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Analytics Dashboard</h1>
          <p className={`text-gray-500 ${isMobile ? 'text-sm' : ''}`}>View your restaurant's performance metrics</p>
        </div>
        <DateFilter
          dateRange={dateRange}
          onChange={setDateRange}
        />
      </div>
    </>
  );
};

export default AnalyticsHeader;
