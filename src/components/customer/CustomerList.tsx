
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

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
  );
};

export default CustomerList;
