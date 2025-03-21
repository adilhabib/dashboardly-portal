
import { FC } from 'react';
import { CalendarIcon } from 'lucide-react';

interface DateFilterProps {
  startDate: string;
  endDate: string;
}

const DateFilter: FC<DateFilterProps> = ({ startDate, endDate }) => {
  return (
    <div className="flex items-center bg-white rounded-lg border border-gray-100 shadow-sm p-3 animate-fade-in">
      <CalendarIcon size={18} className="text-gray-500 mr-2" />
      <div>
        <h4 className="text-sm font-medium text-gray-800">Filter Periode</h4>
        <p className="text-xs text-gray-500">{startDate} - {endDate}</p>
      </div>
      <div className="ml-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default DateFilter;
