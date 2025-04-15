
import { OrderStatus } from './orderTypes';

export const validateOrderStatus = (status: string): OrderStatus => {
  const validStatuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'];
  
  if (validStatuses.includes(status as OrderStatus)) {
    return status as OrderStatus;
  }
  
  console.warn(`Invalid order status: ${status}. Defaulting to 'pending'`);
  return 'pending';
};
