
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsChart } from '@/components/charts';

interface AnalyticsTrendChartsProps {
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

const AnalyticsTrendCharts: FC<AnalyticsTrendChartsProps> = ({ dailyRevenue }) => {
  return (
    <Tabs defaultValue="revenue" className="mb-6">
      <TabsList className="mb-4">
        <TabsTrigger value="revenue">Revenue</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
      </TabsList>

      <TabsContent value="revenue">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <AnalyticsChart
                data={dailyRevenue}
                xKey="date"
                yKey="revenue"
                yFormatter={(value) => `$${value}`}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="orders">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Order Trend</CardTitle>
            <CardDescription>Daily orders for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <AnalyticsChart
                data={dailyRevenue}
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
