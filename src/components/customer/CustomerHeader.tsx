
import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface CustomerHeaderProps {
  onAddCustomer: () => void;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({ onAddCustomer }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="min-w-0">
        <CardTitle className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Customers</CardTitle>
        <CardDescription className={isMobile ? 'text-xs' : ''}>Manage your customer database</CardDescription>
      </div>
      <Button 
        className="flex items-center gap-1 md:gap-2 shrink-0" 
        size={isMobile ? 'sm' : 'default'}
        onClick={onAddCustomer}
      >
        <UserPlus size={isMobile ? 14 : 16} />
        <span className="hidden sm:inline">Add Customer</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </div>
  );
};

export default CustomerHeader;

