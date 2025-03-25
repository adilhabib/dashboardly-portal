
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DonutCharts from '@/components/DonutCharts';
import { Separator } from '@/components/ui/separator';

interface ChartData {
  name: string;
  value: number;
}

interface AnalyticsDonutChartsProps {
  categoryData: ChartData[];
  statusData: ChartData[];
}

const AnalyticsDonutCharts: FC<AnalyticsDonutChartsProps> = ({ categoryData, statusData }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Sales by Category</CardTitle>
          <CardDescription>Revenue distribution by food category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <DonutCharts
              data={categoryData}
              colors={['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']}
            />
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'][index % 5] }}
                  ></div>
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(category.value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Order Status</CardTitle>
          <CardDescription>Distribution of orders by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <DonutCharts
              data={statusData}
              colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444']}
            />
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            {statusData.map((status, index) => (
              <div key={index} className="flex justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][index % 4] }}
                  ></div>
                  <span className="text-sm">{status.name}</span>
                </div>
                <span className="text-sm font-medium">{status.value} orders</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDonutCharts;
