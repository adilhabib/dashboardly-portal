
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import DonutCharts, { DonutChartsCollection } from '../components/DonutCharts';
import { AreaChartComponent, DoubleLineChart } from '../components/AnalyticsChart';
import BarChart from '../components/BarChart';
import ReviewCard from '../components/ReviewCard';
import DateFilter from '../components/DateFilter';
import { ShoppingBag, Package, Receipt, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { ChartDataTransformer } from '../utils/chartDataTransformer';

const Dashboard: React.FC = () => {
  const [currentFrequency, setCurrentFrequency] = useState('weekly');
  
  const orderData = [
    { name: 'Sunday', value: 65 },
    { name: 'Monday', value: 59 },
    { name: 'Tuesday', value: 80 },
    { name: 'Wednesday', value: 81 },
    { name: 'Thursday', value: 56 },
    { name: 'Friday', value: 55 },
    { name: 'Saturday', value: 40 }
  ];
  
  const revenueData = [
    { name: 'Jan', value1: 25, value2: 40 },
    { name: 'Feb', value1: 30, value2: 25 },
    { name: 'Mar', value1: 20, value2: 55 },
    { name: 'Apr', value1: 35, value2: 30 },
    { name: 'May', value1: 40, value2: 45 },
    { name: 'Jun', value1: 55, value2: 25 },
    { name: 'Jul', value1: 30, value2: 60 },
    { name: 'Aug', value1: 25, value2: 50 },
    { name: 'Sept', value1: 45, value2: 65 },
    { name: 'Oct', value1: 35, value2: 70 },
    { name: 'Nov', value1: 30, value2: 55 },
    { name: 'Dec', value1: 45, value2: 65 }
  ];
  
  const customerMapData = [
    { name: 'Sun', value1: 55, value2: 40 },
    { name: 'Mon', value1: 80, value2: 0 },
    { name: 'Tue', value1: 40, value2: 60 },
    { name: 'Wed', value1: 70, value2: 0 },
    { name: 'Thu', value1: 25, value2: 80 },
    { name: 'Fri', value1: 60, value2: 0 },
    { name: 'Sat', value1: 20, value2: 60 }
  ];
  
  const donutChartsData = [
    { title: 'Total Order', percentage: 81, color: '#ff6b6b' },
    { title: 'Customer Growth', percentage: 22, color: '#4ade80' },
    { title: 'Total Revenue', percentage: 62, color: '#60a5fa' }
  ];
  
  // Convert reviews to match the ReviewCardProps interface
  const reviews = [
    {
      customerName: 'Jons Sena',
      rating: 4.5,
      comment: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry\'s standard dummy text.',
      date: new Date(),
      foodName: 'Caesar Salad',
      replied: false,
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      foodImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80'
    },
    {
      customerName: 'Sofia',
      rating: 4.0,
      comment: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry\'s standard dummy text.',
      date: new Date(),
      foodName: 'Margherita Pizza',
      replied: true,
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      foodImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1828&q=80'
    },
    {
      customerName: 'Anandreans',
      rating: 4.5,
      comment: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry\'s standard dummy text.',
      date: new Date(),
      foodName: 'Fruit Bowl',
      replied: false,
      image: 'https://randomuser.me/api/portraits/men/46.jpg',
      foodImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80'
    }
  ];
  
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  
  // Transform customerMapData for BarChart
  const transformedCustomerMapData = ChartDataTransformer.transformDoubleLineToSingleValue(customerMapData);
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 ml-[220px]">
        <Navbar 
          userName="Samantha" 
          userAvatar="https://randomuser.me/api/portraits/women/65.jpg" 
        />
        
        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
              <p className="text-gray-500">Hi, Samantha. Welcome back to Sedap Admin!</p>
            </div>
            
            <DateFilter startDate="17 April 2023" endDate="24 May 2023" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Orders" 
              value="75" 
              icon={<ShoppingBag size={24} className="text-emerald-500" />}
              change={4.5}
              iconBgColor="bg-emerald-100"
              changeDirection="up"
              trendText="increase"
            />
            
            <StatsCard 
              title="Total Delivered" 
              value="357" 
              icon={<Package size={24} className="text-blue-500" />}
              change={4.5}
              iconBgColor="bg-blue-100"
              changeDirection="up"
              trendText="increase"
            />
            
            <StatsCard 
              title="Total Canceled" 
              value="65" 
              icon={<Receipt size={24} className="text-red-500" />}
              change={25.5}
              iconBgColor="bg-red-100"
              changeDirection="down"
              trendText="decrease"
            />
            
            <StatsCard 
              title="Total Revenue" 
              value="$128" 
              icon={<DollarSign size={24} className="text-emerald-500" />}
              change={12.5}
              iconBgColor="bg-emerald-100"
              changeDirection="up"
              trendText="increase"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <DonutChartsCollection data={donutChartsData} />
            <AreaChartComponent title="Chart Order" data={orderData} />
          </div>
          
          <div className="mb-8">
            <DoubleLineChart title="Total Revenue" data={revenueData} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BarChart 
              title="Customer Map" 
              data={transformedCustomerMapData}
              valueKey="value"
              categoryKey="name"
              color="#4ade80"
              frequency={currentFrequency}
            />
            
            <div className="chart-container">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Customer Review</h3>
                  <p className="text-sm text-gray-500">Eum fuga consequuntur utadipi et.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="p-1 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                    onClick={() => setCurrentReviewIndex(prev => (prev > 0 ? prev - 1 : reviews.length - 1))}
                  >
                    <ChevronLeft size={18} className="text-gray-600" />
                  </button>
                  <button 
                    className="p-1 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                    onClick={() => setCurrentReviewIndex(prev => (prev < reviews.length - 1 ? prev + 1 : 0))}
                  >
                    <ChevronRight size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
              
              <ReviewCard {...reviews[currentReviewIndex]} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
