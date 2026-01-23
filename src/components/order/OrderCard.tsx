
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';
import OrderActions from './OrderActions';

interface OrderCardProps {
  order: any;
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, getStatusColor, formatDate }) => {
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

  const acceptanceStatus = getAcceptanceStatus(order.status);

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-medium text-sm">#{order.id.slice(0, 8)}</p>
            <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-base">{formatCurrency(order.total)}</p>
            <Badge className={`${getStatusColor(order.status)} text-xs`}>{order.status}</Badge>
          </div>
        </div>
        
        <div className="border-t pt-3 mb-3">
          <p className="text-sm font-medium">{order.customer?.name || 'Unknown'}</p>
          <p className="text-xs text-gray-500">{order.customer?.phone_number || 'No phone'}</p>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">{order.payment_status}</Badge>
            <Badge className={`${acceptanceStatus.color} text-xs`}>{acceptanceStatus.text}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Link to={`/order-detail?id=${order.id}`}>
              <Button variant="ghost" size="sm">
                <Eye size={14} className="mr-1" />
                View
              </Button>
            </Link>
            <OrderActions orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
