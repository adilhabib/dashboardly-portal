
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DonutCharts from '@/components/DonutCharts';
import { formatCurrency } from '@/lib/utils';

interface AnalyticsDonutChartsProps {
  categoryData: Array<{
    name: string;
    value: number;
  }>;
  statusData: Array<{
    name: string;
    value: number;
  }>;
}

const AnalyticsDonutCharts: FC<AnalyticsDonutChartsProps> = ({ categoryData, statusData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Revenue by Category</CardTitle>
          <CardDescription>Distribution of revenue across food categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <DonutCharts 
              data={categoryData} 
              colors={['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']} 
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center mb-1">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ 
                      backgroundColor: ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'][index % 5] 
                    }}
                  />
                  <span className="text-sm font-medium truncate">{item.name}</span>
                </div>
                <span className="text-lg font-bold">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Orders by Status</CardTitle>
          <CardDescription>Distribution of orders by their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <DonutCharts 
              data={statusData} 
              colors={['#10b981', '#3b82f6', '#f97316', '#ef4444']} 
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {statusData.map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center mb-1">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ 
                      backgroundColor: ['#10b981', '#3b82f6', '#f97316', '#ef4444'][index % 4] 
                    }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-lg font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDonutCharts;
