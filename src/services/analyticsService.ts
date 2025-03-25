
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalFoods: number;
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
  }>;
  statusData: Array<{
    name: string;
    value: number;
  }>;
}

export const fetchAnalyticsData = async (dateRange?: { from: Date; to: Date }): Promise<AnalyticsData> => {
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
  
  // Generate daily revenue data based on the date range
  let dailyRevenue;
  
  if (dateRange && dateRange.from && dateRange.to) {
    const fromDate = dateRange.from;
    const toDate = dateRange.to;
    const dayDiff = Math.max(1, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    dailyRevenue = Array.from({ length: dayDiff }, (_, i) => {
      const date = new Date(fromDate);
      date.setDate(fromDate.getDate() + i);
      return {
        date: date.toISOString().slice(0, 10),
        revenue: Math.random() * 1000 + 500,
        orders: Math.floor(Math.random() * 20) + 5,
      };
    });
  } else {
    // Default to 30 days if no date range provided
    dailyRevenue = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      revenue: Math.random() * 1000 + 500,
      orders: Math.floor(Math.random() * 20) + 5,
    }));
  }
  
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
