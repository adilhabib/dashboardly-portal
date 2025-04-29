
import React from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';

const WalletHeader = () => {
  return (
    <div className="mb-6">
      <PageBreadcrumb pageName="Financial Management" />
      <h1 className="text-2xl font-bold">Financial Management</h1>
      <p className="text-gray-500">Track your Virginia's income, expenses, and financial performance</p>
    </div>
  );
};

export default WalletHeader;
