
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search, UserPlus } from 'lucide-react';

const fetchCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*, customer_details(*)')
    .order('name');
  
  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
  
  return data;
};

const Customer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: customers, isLoading, isError } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const filteredCustomers = customers?.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  if (isLoading) {
    return <div className="text-center py-10">Loading customers...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Error loading customers</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Customers</CardTitle>
              <CardDescription>Manage your customer database</CardDescription>
            </div>
            <Button className="flex items-center gap-2">
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
          
          {filteredCustomers && filteredCustomers.length > 0 ? (
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
              <Button className="mt-4 flex items-center gap-2">
                <UserPlus size={16} />
                Add Your First Customer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customer;
