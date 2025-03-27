
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
import { useAuth } from '@/contexts/AuthContext';

// Define proper types to avoid excessive type instantiation
interface CustomerType {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  created_at: string;
  updated_at: string;
  user_id?: string | null;
}

const fetchCustomers = async (userId: string | undefined): Promise<CustomerType[]> => {
  if (!userId) {
    console.log('No user ID provided for fetchCustomers');
    return [];
  }
  
  console.log('Fetching customers for user ID:', userId);
  
  // Modified query to only select from customers table without attempting to join with customer_details
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
  
  return data || [];
};

const Customer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user } = useAuth();
  
  const { 
    data: customers, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['customers', user?.id],
    queryFn: () => fetchCustomers(user?.id),
    enabled: !!user,
  });

  const filteredCustomers = customers?.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phone && customer.phone.includes(searchTerm))
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
                      {customer.phone && (
                        <div className="text-sm text-gray-500">{customer.phone}</div>
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
