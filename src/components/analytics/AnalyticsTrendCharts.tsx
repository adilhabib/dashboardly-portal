
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsChart } from '@/components/charts';
import { formatCurrency } from '@/lib/utils';

interface AnalyticsTrendChartsProps {
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

const AnalyticsTrendCharts: FC<AnalyticsTrendChartsProps> = ({ dailyRevenue }) => {
  // Format dates to be more readable
  const formattedData = dailyRevenue.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <Tabs defaultValue="revenue" className="mb-4 md:mb-6">
      <TabsList className="mb-3 md:mb-4 w-full md:w-auto">
        <TabsTrigger value="revenue" className="flex-1 md:flex-none">Revenue</TabsTrigger>
        <TabsTrigger value="orders" className="flex-1 md:flex-none">Orders</TabsTrigger>
      </TabsList>

      <TabsContent value="revenue">
        <Card className="shadow-sm">
          <CardHeader className="pb-2 px-3 md:px-6">
            <CardTitle className="text-lg md:text-xl">Revenue Trend</CardTitle>
            <CardDescription className="text-xs md:text-sm">Daily revenue for the selected period</CardDescription>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            <div className="h-60 md:h-80">
              <AnalyticsChart
                data={formattedData}
                xKey="date"
                yKey="revenue"
                yFormatter={(value) => formatCurrency(value)}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="orders">
        <Card className="shadow-sm">
          <CardHeader className="pb-2 px-3 md:px-6">
            <CardTitle className="text-lg md:text-xl">Order Trend</CardTitle>
            <CardDescription className="text-xs md:text-sm">Daily orders for the selected period</CardDescription>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            <div className="h-60 md:h-80">
              <AnalyticsChart
                data={formattedData}
                xKey="date"
                yKey="orders"
                color="#4f46e5"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTrendCharts;
