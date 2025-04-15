
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardStatsCards from '@/components/dashboard/DashboardStatsCards';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import DashboardCustomerSection from '@/components/dashboard/DashboardCustomerSection';
import { fetchAnalyticsData } from '@/services/analyticsService';
import { getReviews } from '@/components/dashboard/DashboardData';

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['dashboardAnalytics', dateRange],
    queryFn: () => fetchAnalyticsData(dateRange),
  });

  const orderData = analyticsData?.dailyRevenue.map(item => ({
    name: item.date.split('-')[2],
    value: item.orders
  })) || [];

  const revenueData = analyticsData?.dailyRevenue.map(item => ({
    name: item.date.split('-')[2],
    value1: item.revenue,
    value2: item.revenue * 0.8
  })) || [];

  const customerMapData = analyticsData?.dailyRevenue.map((item, index) => ({
    name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index % 7],
    value1: item.orders * 2,
    value2: item.orders
  })).slice(0, 7) || [];

  const donutChartsData = [
    { 
      title: 'Total Orders', 
      percentage: analyticsData ? Math.min(Math.round((analyticsData.totalOrders / 100) * 100), 100) : 0, 
      color: '#ff6b6b' 
    },
    { 
      title: 'Customer Growth', 
      percentage: 22,
      color: '#4ade80' 
    },
    { 
      title: 'Total Revenue', 
      percentage: analyticsData ? Math.min(Math.round((analyticsData.totalRevenue / 10000) * 100), 100) : 0, 
      color: '#60a5fa' 
    }
  ];

  const reviews = getReviews();

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-500">Hi. Welcome to Virginia Admin!</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
          <p className="text-red-700">Error loading dashboard data. Please try again later.</p>
        </div>
      ) : (
        <>
          <DashboardStatsCards analyticsData={analyticsData} />
          
          <DashboardCharts 
            orderData={orderData}
            revenueData={revenueData}
            donutChartsData={donutChartsData}
          />
          
          <DashboardCustomerSection 
            customerMapData={customerMapData}
            reviews={reviews}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
