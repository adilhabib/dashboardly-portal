
import { ReviewCardProps } from '@/types/charts';

export const getOrderData = () => [
  { name: 'Sunday', value: 65 },
  { name: 'Monday', value: 59 },
  { name: 'Tuesday', value: 80 },
  { name: 'Wednesday', value: 81 },
  { name: 'Thursday', value: 56 },
  { name: 'Friday', value: 55 },
  { name: 'Saturday', value: 40 }
];

export const getRevenueData = () => [
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

export const getCustomerMapData = () => [
  { name: 'Sun', value1: 55, value2: 40 },
  { name: 'Mon', value1: 80, value2: 0 },
  { name: 'Tue', value1: 40, value2: 60 },
  { name: 'Wed', value1: 70, value2: 0 },
  { name: 'Thu', value1: 25, value2: 80 },
  { name: 'Fri', value1: 60, value2: 0 },
  { name: 'Sat', value1: 20, value2: 60 }
];

export const getDonutChartsData = () => [
  { title: 'Total Order', percentage: 81, color: '#ff6b6b' },
  { title: 'Customer Growth', percentage: 22, color: '#4ade80' },
  { title: 'Total Revenue', percentage: 62, color: '#60a5fa' }
];

export const getReviews = (): ReviewCardProps[] => [
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
