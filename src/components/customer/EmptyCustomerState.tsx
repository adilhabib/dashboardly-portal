
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface EmptyCustomerStateProps {
  searchTerm: string;
  onAddCustomer: () => void;
}

const EmptyCustomerState: React.FC<EmptyCustomerStateProps> = ({ 
  searchTerm, 
  onAddCustomer 
}) => {
  return (
    <div className="text-center py-10 bg-gray-50 rounded-lg">
      <p className="text-gray-500">
        {searchTerm ? 'No customers found matching your search.' : 'No customers available'}
      </p>
      <Button className="mt-4 flex items-center gap-2" onClick={onAddCustomer}>
        <UserPlus size={16} />
        {searchTerm ? 'Add New Customer' : 'Add Your First Customer'}
      </Button>
    </div>
  );
};

export default EmptyCustomerState;
