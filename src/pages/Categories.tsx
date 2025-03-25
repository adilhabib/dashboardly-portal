
import React from 'react';
import CategoryManagement from '@/components/CategoryManagement';
import PageBreadcrumb from '@/components/PageBreadcrumb';

const Categories: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <PageBreadcrumb pageName="Categories" />
      <CategoryManagement />
    </div>
  );
};

export default Categories;
