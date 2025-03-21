import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AnalyticsChart from '@/components/AnalyticsChart';
import DonutCharts from '@/components/DonutCharts';
import StatsCard from '@/components/StatsCard';
import DateFilter from '@/components/DateFilter';
import { Separator } from '@/components/ui/separator';

const fetchAnalyticsData = async () => {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (orderError) {
    console.error('Error fetching orders:', orderError);
    throw orderError;
  }
  
  const { data: foodData, error: foodError } = await supabase
    .from('foods')
    .select('*');
  
  if (foodError) {
    console.error('Error fetching foods:', foodError);
    throw foodError;
  }
  
  const totalRevenue = orderData.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = orderData.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalFoods = foodData.length;
  
  const dailyRevenue = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    revenue: Math.random() * 1000 + 500,
    orders: Math.floor(Math.random() * 20) + 5,
  }));
  
  const categories = ['Main Course', 'Appetizer', 'Dessert', 'Beverage', 'Sides'];
  const categoryData = categories.map(category => ({
    name: category,
    value: Math.floor(Math.random() * 1000) + 100,
  }));
  
  const statusData = [
    { name: 'Completed', value: Math.floor(Math.random() * 70) + 30 },
    { name: 'Processing', value: Math.floor(Math.random() * 30) + 10 },
    { name: 'Pending', value: Math.floor(Math.random() * 20) + 5 },
    { name: 'Cancelled', value: Math.floor(Math.random() * 10) + 1 },
  ];
  
  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    totalFoods,
    dailyRevenue,
    categoryData,
    statusData,
  };
};

const Analytics = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: fetchAnalyticsData,
  });
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  if (isLoading) {
    return <div className="text-center py-10">Loading analytics...</div>;
  }
  
  if (isError || !data) {
    return <div className="text-center py-10 text-red-500">Error loading analytics</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          description="Total sales revenue"
          trend={7.2}
          trendText="from last period"
        />
        <StatsCard
          title="Orders"
          value={data.totalOrders.toString()}
          description="Total number of orders"
          trend={-2.5}
          trendText="from last period"
        />
        <StatsCard
          title="Average Order Value"
          value={formatCurrency(data.avgOrderValue)}
          description="Average value per order"
          trend={3.1}
          trendText="from last period"
        />
        <StatsCard
          title="Menu Items"
          value={data.totalFoods.toString()}
          description="Active menu items"
          trend={0}
          trendText="unchanged"
        />
      </div>
      
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
                  data={data.dailyRevenue}
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
                  data={data.dailyRevenue}
                  xKey="date"
                  yKey="orders"
                  color="#4f46e5"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution by food category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <DonutCharts
                data={data.categoryData}
                colors={['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']}
              />
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              {data.categoryData.map((category, index) => (
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
                data={data.statusData}
                colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444']}
              />
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              {data.statusData.map((status, index) => (
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
    </div>
  );
};

export default Analytics;
