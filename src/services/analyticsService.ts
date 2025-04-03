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
  
  // Fetch food items for category analysis
  const { data: foodData, error: foodError } = await supabase
    .from('foods')
    .select('*');
  
  if (foodError) {
    console.error('Error fetching foods:', foodError);
    throw foodError;
  }
  
  // Fetch order items to get product information
  const { data: orderItemsData, error: orderItemsError } = await supabase
    .from('order_items')
    .select('*');
  
  if (orderItemsError) {
    console.error('Error fetching order items:', orderItemsError);
    throw orderItemsError;
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
  
  // Generate real category data from order items and foods
  const categoryData = generateRealCategoryData(filteredOrders, orderItemsData, foodData);
  
  // Generate real status data from orders
  const statusData = generateRealStatusData(filteredOrders);
  
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

// Helper function to generate real category revenue data
const generateRealCategoryData = (orders: any[], orderItems: any[], foods: any[]) => {
  console.log('Generating real category data...');
  
  // Create a map to track revenue by category
  const categoryRevenue = new Map<string, number>();
  
  // First, create a mapping from food IDs to their categories
  const foodCategories = new Map<string, string>();
  foods.forEach(food => {
    if (food.category) {
      foodCategories.set(food.id, food.category);
    }
  });
  
  // Process each order item to associate it with a category and add its revenue
  orderItems.forEach(item => {
    // Find the order this item belongs to
    const order = orders.find(o => o.id === item.order_id);
    if (!order) return; // Skip if order not found
    
    // Find the food category
    const foodId = item.product_id;
    const category = foodCategories.get(foodId);
    
    if (category) {
      // Add this item's total to the category revenue
      const currentRevenue = categoryRevenue.get(category) || 0;
      categoryRevenue.set(category, currentRevenue + (item.total_price || 0));
    } else if (item.product_data && item.product_data.category) {
      // If category isn't in our mapping but exists in product_data
      const category = item.product_data.category;
      const currentRevenue = categoryRevenue.get(category) || 0;
      categoryRevenue.set(category, currentRevenue + (item.total_price || 0));
    }
  });
  
  // If we don't have enough data from order items, try using the orders directly
  if (categoryRevenue.size === 0) {
    orders.forEach(order => {
      // We'll try to extract category from order/payload data if available
      let category = 'Uncategorized';
      
      // Add revenue to category
      const currentRevenue = categoryRevenue.get(category) || 0;
      categoryRevenue.set(category, currentRevenue + (order.total || 0));
    });
  }
  
  // If still no categories, add some default ones for display
  if (categoryRevenue.size === 0) {
    // Extract unique categories from foods
    const uniqueCategories = [...new Set(foods.map(food => food.category).filter(Boolean))];
    
    if (uniqueCategories.length > 0) {
      // Distribute total revenue among available categories
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const revenuePerCategory = totalRevenue / uniqueCategories.length;
      
      uniqueCategories.forEach(category => {
        categoryRevenue.set(category, revenuePerCategory);
      });
    } else {
      // Last resort: use placeholder categories with estimated distribution
      const placeholderCategories = ['Main Course', 'Appetizer', 'Dessert', 'Beverage', 'Sides'];
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      placeholderCategories.forEach((category, index) => {
        // Distribute revenue with varying percentages for visualization
        const percentage = [0.4, 0.2, 0.15, 0.15, 0.1][index];
        categoryRevenue.set(category, totalRevenue * percentage);
      });
    }
  }
  
  // Convert map to array format required by the charts
  return Array.from(categoryRevenue.entries()).map(([name, value]) => ({
    name,
    value: Math.round(value) // Round to avoid decimal values
  }));
};

// Helper function to generate real status data from orders
const generateRealStatusData = (orders: any[]) => {
  console.log('Generating real status data...');
  
  // Count orders by status
  const statusCounts = new Map<string, number>();
  
  orders.forEach(order => {
    const status = order.status ? order.status : 'pending';
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    
    const currentCount = statusCounts.get(formattedStatus) || 0;
    statusCounts.set(formattedStatus, currentCount + 1);
  });
  
  // If no statuses found, provide some reasonable defaults
  if (statusCounts.size === 0) {
    const defaultStatuses = ['Completed', 'Processing', 'Pending', 'Cancelled'];
    defaultStatuses.forEach(status => {
      statusCounts.set(status, 0);
    });
  }
  
  // Convert map to array format required by the charts
  return Array.from(statusCounts.entries()).map(([name, value]) => ({
    name,
    value
  }));
};
