
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';
import OrderActions from './OrderActions';

interface OrderTableProps {
  orders: any[];
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, getStatusColor, formatDate }) => {
  console.log('Orders passed to OrderTable:', orders);
  
  const getAcceptanceStatus = (status: string) => {
    switch(status) {
      case 'completed':
      case 'processing':
        return { text: 'Accepted', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { text: 'Rejected', color: 'bg-red-100 text-red-800' };
      case 'pending':
      default:
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    }
  };
  
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
          <TableHead>Acceptance</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order: any) => {
          const acceptanceStatus = getAcceptanceStatus(order.status);
          
          return (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
              <TableCell>
                {order.customer?.name || 'Unknown'}
                <div className="text-xs text-gray-500">{order.customer?.phone_number || 'No phone'}</div>
              </TableCell>
              <TableCell>{formatDate(order.created_at)}</TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{order.payment_status}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={acceptanceStatus.color}>{acceptanceStatus.text}</Badge>
              </TableCell>
              <TableCell className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <Link to={`/order-detail?id=${order.id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye size={16} />
                    </Button>
                  </Link>
                  <OrderActions orderId={order.id} currentStatus={order.status} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default OrderTable;
