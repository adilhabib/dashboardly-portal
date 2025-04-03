
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { 
  CustomerList, 
  CustomerSearch, 
  EmptyCustomerState,
  CustomerHeader,
  AddCustomerModal
} from '@/components/customer';
import { fetchCustomers } from '@/services/customerService';

const Customer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { data: customers, isLoading, isError, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const filteredCustomers = customers?.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phone_number && customer.phone_number.includes(searchTerm))
  );

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    refetch(); // Refresh the customer list when modal is closed
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CustomerHeader onAddCustomer={handleOpenAddModal} />
        </CardHeader>
        <CardContent>
          <CustomerSearch 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
          
          {isLoading ? (
            <div className="text-center py-10">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Loading customers...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10 text-red-500">
              Error loading customers. Please try again later.
            </div>
          ) : filteredCustomers && filteredCustomers.length > 0 ? (
            <CustomerList customers={filteredCustomers} />
          ) : (
            <EmptyCustomerState 
              searchTerm={searchTerm}
              onAddCustomer={handleOpenAddModal} 
            />
          )}
        </CardContent>
      </Card>
      
      {/* Add Customer Modal */}
      <AddCustomerModal 
        open={isAddModalOpen} 
        onClose={handleCloseAddModal} 
      />
    </>
  );
};

export default Customer;
