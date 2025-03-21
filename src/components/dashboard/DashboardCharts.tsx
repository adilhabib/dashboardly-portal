
import { FC } from 'react';
import { DonutChartsCollection } from '@/components/DonutCharts';
import { AreaChartComponent, DoubleLineChart } from '@/components/charts';

interface DashboardChartsProps {
  orderData: Array<{ name: string; value: number }>;
  revenueData: Array<{ name: string; value1: number; value2: number }>;
  donutChartsData: Array<{ title: string; percentage: number; color: string }>;
}

const DashboardCharts: FC<DashboardChartsProps> = ({ 
  orderData,
  revenueData,
  donutChartsData
}) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DonutChartsCollection data={donutChartsData} />
        <AreaChartComponent title="Chart Order" data={orderData} />
      </div>
      
      <div className="mb-8">
        <DoubleLineChart title="Total Revenue" data={revenueData} />
      </div>
    </>
  );
};

export default DashboardCharts;
