
import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatsCards from '@/components/dashboard/DashboardStatsCards';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import DashboardCustomerSection from '@/components/dashboard/DashboardCustomerSection';
import { 
  getOrderData, 
  getRevenueData, 
  getCustomerMapData, 
  getDonutChartsData, 
  getReviews 
} from '@/components/dashboard/DashboardData';

const Dashboard: React.FC = () => {
  // Get data from our data service
  const orderData = getOrderData();
  const revenueData = getRevenueData();
  const customerMapData = getCustomerMapData();
  const donutChartsData = getDonutChartsData();
  const reviews = getReviews();
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 ml-[220px]">
        <Navbar 
          userName="Samantha" 
          userAvatar="https://randomuser.me/api/portraits/women/65.jpg" 
        />
        
        <main className="p-6">
          <DashboardHeader userName="Samantha" />
          
          <DashboardStatsCards />
          
          <DashboardCharts 
            orderData={orderData}
            revenueData={revenueData}
            donutChartsData={donutChartsData}
          />
          
          <DashboardCustomerSection 
            customerMapData={customerMapData}
            reviews={reviews}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
