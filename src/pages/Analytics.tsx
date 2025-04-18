
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsData } from '@/services/analyticsService';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import AnalyticsStatsCards from '@/components/analytics/AnalyticsStatsCards';
import AnalyticsTrendCharts from '@/components/analytics/AnalyticsTrendCharts';
import AnalyticsDonutCharts from '@/components/analytics/AnalyticsDonutCharts';
import { useOrderRealtime } from '@/hooks/useOrderRealtime';
import { toast } from '@/hooks/use-toast';

const Analytics = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  
  // Set up real-time subscription for order updates
  const { isConnected, lastUpdate } = useOrderRealtime();
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['analytics', dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: () => fetchAnalyticsData(dateRange),
  });
  
  // Handle date range changes
  const handleDateRangeChange = (newRange: { from: Date; to: Date }) => {
    setDateRange(newRange);
    toast({
      title: "Date range updated",
      description: `Data refreshed for ${newRange.from.toLocaleDateString()} to ${newRange.to.toLocaleDateString()}`
    });
  };
  
  // Refetch data when we receive a real-time update
  useEffect(() => {
    if (lastUpdate.timestamp) {
      console.log('Detected order update, refreshing analytics data');
      refetch();
    }
  }, [lastUpdate, refetch]);
  
  return (
    <>
      <AnalyticsHeader 
        dateRange={dateRange} 
        setDateRange={handleDateRangeChange} 
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading analytics data...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
          <p className="text-red-700">Error loading analytics data. Please try again later.</p>
        </div>
      ) : (
        <>
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
          
          {isConnected && (
            <div className="text-xs text-gray-500 mt-6 text-right">
              ● Real-time updates active
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Analytics;
