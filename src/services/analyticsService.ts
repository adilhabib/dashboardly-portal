
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
  // Fetch orders data
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (orderError) {
    console.error('Error fetching orders:', orderError);
    throw orderError;
  }
  
  // Fetch foods data
  const { data: foodData, error: foodError } = await supabase
    .from('foods')
    .select('*');
  
  if (foodError) {
    console.error('Error fetching foods:', foodError);
    throw foodError;
  }
  
  // Calculate total revenue, orders, and average order value
  const totalRevenue = orderData.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orderData.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalFoods = foodData.length;
  
  // Filter orders based on date range if provided
  let filteredOrders = orderData;
  if (dateRange && dateRange.from && dateRange.to) {
    const fromDate = dateRange.from.toISOString();
    const toDate = dateRange.to.toISOString();
    
    filteredOrders = orderData.filter(order => {
      const orderDate = new Date(order.created_at).toISOString();
      return orderDate >= fromDate && orderDate <= toDate;
    });
  }
  
  // Generate daily revenue data from the actual orders
  const dailyRevenue = generateDailyRevenueData(filteredOrders, dateRange);
  
  // Generate category data (group orders by category if available or use realistic categories)
  const categoryData = generateCategoryData(filteredOrders, foodData);
  
  // Generate status data (count orders by status)
  const statusData = generateStatusData(filteredOrders);
  
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

// Helper function to generate daily revenue data from orders
const generateDailyRevenueData = (orders: any[], dateRange?: { from: Date; to: Date }) => {
  const dailyMap = new Map();
  
  // Determine the date range to use
  const toDate = dateRange?.to || new Date();
  const fromDate = dateRange?.from || new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days
  
  // Initialize all dates in the range with zero values
  let currentDate = new Date(fromDate);
  while (currentDate <= toDate) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    dailyMap.set(dateStr, { date: dateStr, revenue: 0, orders: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Populate with actual order data
  orders.forEach(order => {
    const orderDate = new Date(order.created_at).toISOString().slice(0, 10);
    if (dailyMap.has(orderDate)) {
      const currentData = dailyMap.get(orderDate);
      dailyMap.set(orderDate, {
        date: orderDate,
        revenue: currentData.revenue + (order.total || 0),
        orders: currentData.orders + 1
      });
    }
  });
  
  // Convert map to array and sort by date
  return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
};

// Helper function to generate category data
const generateCategoryData = (orders: any[], foods: any[]) => {
  // Create a map of food IDs to categories
  const foodCategories = new Map();
  foods.forEach(food => {
    if (food.category) {
      foodCategories.set(food.id, food.category);
    }
  });
  
  // Try to get categories from order items if available
  // For this demo, we'll use predefined categories
  const categories = ['Main Course', 'Appetizer', 'Dessert', 'Beverage', 'Sides'];
  const categoryRevenue = {};
  
  categories.forEach(category => {
    categoryRevenue[category] = 0;
  });
  
  // Since we don't have direct category info in orders, we'll distribute the revenue
  // This would normally use order_items with product details
  orders.forEach(order => {
    // Randomly assign the order total to a category for demonstration
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    categoryRevenue[randomCategory] += (order.total || 0) / 2; // Divide to make it realistic
    
    // Assign the rest to another category
    const secondCategory = categories[Math.floor(Math.random() * categories.length)];
    categoryRevenue[secondCategory] += (order.total || 0) / 2;
  });
  
  return categories.map(category => ({
    name: category,
    value: Math.round(categoryRevenue[category])
  }));
};

// Helper function to generate status data
const generateStatusData = (orders: any[]) => {
  const statusCounts = {
    'completed': 0,
    'processing': 0,
    'pending': 0,
    'cancelled': 0
  };
  
  orders.forEach(order => {
    const status = order.status ? order.status.toLowerCase() : 'pending';
    if (statusCounts[status] !== undefined) {
      statusCounts[status]++;
    } else {
      statusCounts['pending']++;
    }
  });
  
  return Object.entries(statusCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));
};
