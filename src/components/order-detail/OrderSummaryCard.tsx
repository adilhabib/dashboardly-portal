
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';

interface OrderItemType {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  foods?: {
    id?: string;
    name?: string;
    image_url?: string | null;
  } | null;
}

interface OrderType {
  id: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
}

interface OrderSummaryCardProps {
  order: OrderType;
  orderItems: OrderItemType[];
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ order, orderItems }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</CardTitle>
            <CardDescription>Placed on {formatDate(order.created_at)}</CardDescription>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Order Items</h3>
            <div className="space-y-4">
              {orderItems && orderItems.map((item: OrderItemType) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center gap-4">
                    {item.foods && item.foods.image_url && (
                      <img 
                        src={item.foods.image_url} 
                        alt={item.foods.name || 'Food item'}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <p className="font-medium">
                        {item.foods && item.foods.name ? item.foods.name : 'Unknown item'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × Rs. {item.unit_price.toFixed(2)}
                      </p>
                      {item.special_instructions && (
                        <p className="text-sm italic mt-1">"{item.special_instructions}"</p>
                      )}
                    </div>
                  </div>
                  <p className="font-medium">Rs. {item.total_price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div>
          <p className="text-sm text-gray-500">Payment Status</p>
          <Badge variant="outline">{order.payment_status}</Badge>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold">Rs. {order.total.toFixed(2)}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderSummaryCard;
