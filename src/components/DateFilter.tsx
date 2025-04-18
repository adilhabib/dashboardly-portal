
import { FC } from 'react';
import { CalendarIcon } from 'lucide-react';
import { DateFilterProps } from '@/types/charts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction } from 'react';
import { format } from 'date-fns';

interface ExtendedDateFilterProps extends Partial<DateFilterProps> {
  dateRange?: { from: Date; to: Date };
  onChange?: Dispatch<SetStateAction<{ from: Date; to: Date }>> | ((range: { from: Date; to: Date }) => void);
  startDate?: string;
  endDate?: string;
  autoClose?: boolean;
}

const DateFilter: FC<ExtendedDateFilterProps> = ({ 
  startDate, 
  endDate, 
  dateRange, 
  onChange,
  autoClose = true
}) => {
  if (dateRange && onChange) {
    // For Analytics page usage with immediate data refresh
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center bg-white rounded-lg border border-gray-100 shadow-sm p-3 animate-fade-in">
            <CalendarIcon size={18} className="text-gray-500 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-gray-800">Filter Period</h4>
              <p className="text-xs text-gray-500">
                {dateRange.from ? format(dateRange.from, 'LLL dd, y') : 'Select'} - 
                {dateRange.to ? format(dateRange.to, 'LLL dd, y') : 'End date'}
              </p>
            </div>
            <div className="ml-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto">
          <Calendar
            mode="range"
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={(range) => {
              if (range && 'from' in range) {
                // Only update if we have valid dates (both from and to)
                if (range.from && range.to) {
                  onChange({
                    from: range.from,
                    to: range.to
                  });
                  
                  // Close the popover if autoClose is enabled
                  if (autoClose) {
                    // Use setTimeout to ensure state is updated before closing
                    setTimeout(() => {
                      const openPopover = document.querySelector('[data-state="open"]');
                      if (openPopover) {
                        const closeButton = openPopover.querySelector('[aria-label="Close"]');
                        if (closeButton instanceof HTMLElement) {
                          closeButton.click();
                        }
                      }
                    }, 100);
                  }
                }
              }
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    );
  }

  // For Dashboard page usage
  return (
    <div className="flex items-center bg-white rounded-lg border border-gray-100 shadow-sm p-3 animate-fade-in">
      <CalendarIcon size={18} className="text-gray-500 mr-2" />
      <div>
        <h4 className="text-sm font-medium text-gray-800">Filter Period</h4>
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
