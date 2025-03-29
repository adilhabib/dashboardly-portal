
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export type OrderStatus = 'all' | 'pending' | 'processing' | 'completed' | 'cancelled';

interface OrderStatusFilterProps {
  value: OrderStatus;
  onChange: (value: OrderStatus) => void;
}

const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({ value, onChange }) => {
  return (
    <div className="w-full max-w-[200px]">
      <Select 
        value={value} 
        onValueChange={(val) => onChange(val as OrderStatus)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Orders</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrderStatusFilter;
