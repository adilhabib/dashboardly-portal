
import React from 'react';
import FoodList from '@/components/FoodList';
import PageBreadcrumb from '@/components/PageBreadcrumb';

const Foods: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <FoodList />
    </div>
  );
};

export default Foods;
