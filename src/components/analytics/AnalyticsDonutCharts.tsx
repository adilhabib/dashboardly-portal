
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  // Define color palettes for consistent visualization
  const categoryColors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
  const statusColors = {
    'Completed': '#10b981',  // green
    'Processing': '#3b82f6', // blue
    'Pending': '#f97316',    // orange
    'Cancelled': '#ef4444',  // red
    'Delivered': '#8b5cf6',  // purple
    'Ready': '#06b6d4'       // cyan
  };

  // Get colors for status data
  const getStatusColor = (status: string, index: number) => {
    return statusColors[status as keyof typeof statusColors] || 
           categoryColors[index % categoryColors.length]; // Fallback to category colors
  };

  const statusColorsArray = statusData.map((item, index) => 
    getStatusColor(item.name, index)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Revenue by Category</CardTitle>
          <CardDescription>Distribution of revenue across food categories</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No category data available</p>
            </div>
          ) : (
            <>
              <div className="h-64">
                <DonutCharts 
                  data={categoryData} 
                  colors={categoryColors} 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-center mb-1">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ 
                          backgroundColor: categoryColors[index % categoryColors.length] 
                        }}
                      />
                      <span className="text-sm font-medium truncate">{item.name}</span>
                    </div>
                    <span className="text-lg font-bold">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Orders by Status</CardTitle>
          <CardDescription>Distribution of orders by their current status</CardDescription>
        </CardHeader>
        <CardContent>
          {statusData.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No status data available</p>
            </div>
          ) : (
            <>
              <div className="h-64">
                <DonutCharts 
                  data={statusData} 
                  colors={statusColorsArray} 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {statusData.map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-center mb-1">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ 
                          backgroundColor: getStatusColor(item.name, index)
                        }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-lg font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDonutCharts;
