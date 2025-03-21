
import { FC, Dispatch, SetStateAction } from 'react';
import DateFilter from '@/components/DateFilter';

interface AnalyticsHeaderProps {
  dateRange: { from: Date; to: Date };
  setDateRange: Dispatch<SetStateAction<{ from: Date; to: Date }>>;
}

const AnalyticsHeader: FC<AnalyticsHeaderProps> = ({ dateRange, setDateRange }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-500">View your restaurant's performance metrics</p>
      </div>
      <DateFilter
        dateRange={dateRange}
        onChange={setDateRange}
      />
    </div>
  );
};

export default AnalyticsHeader;
