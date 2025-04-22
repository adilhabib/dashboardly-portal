
import { FC, useState, useMemo } from 'react';
import BarChart from '@/components/BarChart';
import ReviewCard from '@/components/ReviewCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ChartDataTransformer } from '@/utils/chartDataTransformer';
import { ReviewCardProps } from '@/types/charts';

interface DashboardCustomerSectionProps {
  customerMapData: Array<{ name: string; value1: number; value2: number }>;
  reviews: ReviewCardProps[];
}

const DashboardCustomerSection: FC<DashboardCustomerSectionProps> = ({ 
  customerMapData,
  reviews 
}) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [currentFrequency, setCurrentFrequency] = useState('weekly');
  
  // Transform customerMapData for BarChart - using useMemo to prevent recalculations
  const transformedCustomerMapData = useMemo(() => {
    return ChartDataTransformer.transformDoubleLineToSingleValue(customerMapData);
  }, [customerMapData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="chart-container h-[300px]">
        <BarChart 
          title="Customer Map" 
          data={transformedCustomerMapData}
          categoryKey="name"
          frequency={currentFrequency}
          series={[
            { valueKey: "value", label: "Customers", color: "#4ade80" }
          ]}
        />
      </div>
      
      <div className="chart-container">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Customer Review</h3>
            <p className="text-sm text-gray-500">Eum fuga consequuntur utadipi et.</p>
          </div>
          <div className="flex gap-2">
            <button 
              className="p-1 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
              onClick={() => setCurrentReviewIndex(prev => (prev > 0 ? prev - 1 : reviews.length - 1))}
            >
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <button 
              className="p-1 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
              onClick={() => setCurrentReviewIndex(prev => (prev < reviews.length - 1 ? prev + 1 : 0))}
            >
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        <ReviewCard {...reviews[currentReviewIndex]} />
      </div>
    </div>
  );
};

export default DashboardCustomerSection;
