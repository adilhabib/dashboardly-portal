
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { OrderStatus } from '@/services/order/orderTypes';

// Include 'all' option with the OrderStatus type
export type OrderStatusFilter = OrderStatus | 'all';

interface OrderStatusFilterProps {
  value: OrderStatusFilter;
  onChange: (value: OrderStatusFilter) => void;
}

const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({ value, onChange }) => {
  return (
    <div className="w-full max-w-[200px]">
      <Select 
        value={value} 
        onValueChange={(val) => onChange(val as OrderStatusFilter)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Orders</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="preparing">Preparing</SelectItem>
          <SelectItem value="ready">Ready</SelectItem>
          <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrderStatusFilter;
