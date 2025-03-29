
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface OrderHistoryCardProps {
  orders: any[];
}

const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({ orders }) => {
  console.log('Orders passed to OrderHistoryCard:', orders);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(order.total)}</p>
                  <p className="text-sm text-gray-500">{order.status}</p>
                </div>
                <Link to={`/order-detail?id=${order.id}`}>
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No order history available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistoryCard;
