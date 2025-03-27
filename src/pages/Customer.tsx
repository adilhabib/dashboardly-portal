
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search, UserPlus, Loader2 } from 'lucide-react';
import { AddCustomerModal } from '@/components/customer/AddCustomerModal';

const fetchCustomers = async () => {
  console.log('Fetching customers from the customer table');
  const { data, error } = await supabase
    .from('customer')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
  
  console.log('Fetched customers:', data);
  return data;
};

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
    <div className="container mx-auto px-4 py-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Customers</CardTitle>
              <CardDescription>Manage your customer database</CardDescription>
            </div>
            <Button className="flex items-center gap-2" onClick={handleOpenAddModal}>
              <UserPlus size={16} />
              Add Customer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="my-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers by name, email or phone..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      {customer.email && (
                        <div className="text-sm">{customer.email}</div>
                      )}
                      {customer.phone_number && (
                        <div className="text-sm text-gray-500">{customer.phone_number}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm truncate max-w-[200px]">
                        {customer.address || 'No address'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* We would fetch this in a real app */}
                      <div className="text-sm">0 orders</div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/customer-detail?id=${customer.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye size={16} />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                {searchTerm ? 'No customers found matching your search.' : 'No customers available'}
              </p>
              <Button className="mt-4 flex items-center gap-2" onClick={handleOpenAddModal}>
                <UserPlus size={16} />
                Add Your First Customer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Customer Modal */}
      <AddCustomerModal 
        open={isAddModalOpen} 
        onClose={handleCloseAddModal} 
      />
    </div>
  );
};

export default Customer;
