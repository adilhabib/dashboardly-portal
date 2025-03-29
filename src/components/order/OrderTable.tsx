
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderTableProps {
  orders: any[];
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, getStatusColor, formatDate }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order: any) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
            <TableCell>
              {order.customer?.name || 'Unknown'}
              <div className="text-xs text-gray-500">{order.customer?.phone_number || 'No phone'}</div>
            </TableCell>
            <TableCell>{formatDate(order.created_at)}</TableCell>
            <TableCell>Rs. {order.total.toFixed(2)}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{order.payment_status}</Badge>
            </TableCell>
            <TableCell>
              <Link to={`/order-detail?id=${order.id}`}>
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

export default OrderTable;
