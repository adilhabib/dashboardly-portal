
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsData } from '@/services/analyticsService';

import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import AnalyticsStatsCards from '@/components/analytics/AnalyticsStatsCards';
import AnalyticsTrendCharts from '@/components/analytics/AnalyticsTrendCharts';
import AnalyticsDonutCharts from '@/components/analytics/AnalyticsDonutCharts';

const Analytics = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: fetchAnalyticsData,
  });
  
  if (isLoading) {
    return <div className="text-center py-10">Loading analytics...</div>;
  }
  
  if (isError || !data) {
    return <div className="text-center py-10 text-red-500">Error loading analytics</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <AnalyticsHeader 
        dateRange={dateRange} 
        setDateRange={setDateRange} 
      />
      
      <AnalyticsStatsCards
        totalRevenue={data.totalRevenue}
        totalOrders={data.totalOrders}
        avgOrderValue={data.avgOrderValue}
        totalFoods={data.totalFoods}
      />
      
      <AnalyticsTrendCharts 
        dailyRevenue={data.dailyRevenue} 
      />
      
      <AnalyticsDonutCharts
        categoryData={data.categoryData}
        statusData={data.statusData}
      />
    </div>
  );
};

export default Analytics;
