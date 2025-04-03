
import React from 'react';
import CategoryManagement from '@/components/CategoryManagement';
import PageBreadcrumb from '@/components/PageBreadcrumb';

const Categories: React.FC = () => {
  return (
    <>
      <PageBreadcrumb pageName="Categories" />
      <CategoryManagement />
    </>
  );
};

export default Categories;
