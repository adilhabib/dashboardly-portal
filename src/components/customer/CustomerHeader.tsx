
import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface CustomerHeaderProps {
  onAddCustomer: () => void;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({ onAddCustomer }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle className="text-2xl font-bold">Customers</CardTitle>
        <CardDescription>Manage your customer database</CardDescription>
      </div>
      <Button className="flex items-center gap-2" onClick={onAddCustomer}>
        <UserPlus size={16} />
        Add Customer
      </Button>
    </div>
  );
};

export default CustomerHeader;
