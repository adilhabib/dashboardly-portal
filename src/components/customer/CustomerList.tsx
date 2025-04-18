import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomerOrders, fetchCustomerDefaultAddress } from '@/services/customerService';

interface CustomerListProps {
  customers: any[];
}

const CustomerList: React.FC<CustomerListProps> = ({ customers }) => {
  return (
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
        {customers.map((customer) => (
          <CustomerRow key={customer.id} customer={customer} />
        ))}
      </TableBody>
    </Table>
  );
};

const CustomerRow = ({ customer }: { customer: any }) => {
  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['customerOrders', customer.id],
    queryFn: () => fetchCustomerOrders(customer.id),
  });

  const { data: defaultAddress, isLoading: isLoadingAddress } = useQuery({
    queryKey: ['customerDefaultAddress', customer.id],
    queryFn: () => fetchCustomerDefaultAddress(customer.id),
  });

  const orderCount = orders?.length || 0;
  const addressDisplay = isLoadingAddress 
    ? 'Loading address...' 
    : defaultAddress?.address || 'No default address';

  return (
    <TableRow>
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
          {addressDisplay}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {isLoadingOrders ? 'Loading...' : `${orderCount} orders`}
        </div>
      </TableCell>
      <TableCell>
        <Link to={`/customer-detail?id=${customer.id}`}>
          <Button variant="ghost" size="icon">
            <Eye size={16} />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default CustomerList;
