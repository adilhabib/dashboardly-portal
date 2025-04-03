
import React from 'react';
import FoodList from '@/components/FoodList';
import PageBreadcrumb from '@/components/PageBreadcrumb';

const Foods: React.FC = () => {
  return (
    <>
      <PageBreadcrumb pageName="Foods" />
      <FoodList />
    </>
  );
};

export default Foods;
