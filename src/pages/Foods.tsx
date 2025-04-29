
import React from 'react';
import FoodList from '@/components/FoodList';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import PopularFoods from '@/components/PopularFoods';

const Foods: React.FC = () => {
  return (
    <>
      <PageBreadcrumb pageName="Foods" />
      <div className="container mx-auto py-6">
        <PopularFoods />
        <FoodList />
      </div>
    </>
  );
};

export default Foods;
