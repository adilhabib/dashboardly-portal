
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsData } from '@/services/analyticsService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
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
    queryKey: ['analytics', dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: () => fetchAnalyticsData(dateRange),
  });
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 ml-[220px]">
        <Navbar 
          userName="Samantha" 
          userAvatar="https://randomuser.me/api/portraits/women/65.jpg" 
        />
        
        <main className="p-6">
          <AnalyticsHeader 
            dateRange={dateRange} 
            setDateRange={setDateRange} 
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
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Analytics;
