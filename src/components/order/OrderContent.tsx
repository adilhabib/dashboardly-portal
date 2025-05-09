
import React from 'react';
import { OrderTable, EmptyStateMessage } from '@/components/order';
import { getStatusColor, formatDate } from '@/services/orderUtils';

interface OrderContentProps {
  filteredOrders: any[];
  onRefresh: () => void;
}

const OrderContent: React.FC<OrderContentProps> = ({ 
  filteredOrders,
  onRefresh
}) => {
  if (filteredOrders.length > 0) {
    return (
      <OrderTable 
        orders={filteredOrders} 
        getStatusColor={getStatusColor} 
        formatDate={formatDate} 
      />
    );
  }
  
  return <EmptyStateMessage onRefresh={onRefresh} />;
};

export default OrderContent;
