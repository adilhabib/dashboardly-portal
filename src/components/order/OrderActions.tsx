
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { updateOrderStatus, updatePaymentStatus } from '@/services/order';
import { useQueryClient } from '@tanstack/react-query';
import { OrderStatus } from '@/services/order/orderTypes';
import { Check, X, Utensils, Package, Truck } from 'lucide-react';

interface OrderActionsProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const OrderActions: React.FC<OrderActionsProps> = ({ orderId, currentStatus }) => {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!orderId) {
      toast({
        title: "No order selected",
        description: "Please select an order to update its status.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUpdating(true);
      await updateOrderStatus(orderId, newStatus);

      // If status is set to completed, also set payment_status to 'paid'
      if (newStatus === 'completed') {
        try {
          await updatePaymentStatus(orderId, 'paid');
        } catch (err) {
          toast({
            title: "Payment Update Failed",
            description: "Order completed, but failed to update payment status. Please check manually.",
            variant: "destructive"
          });
          console.error('Error setting payment status to paid:', err);
        }
      }
      
      // If status is set to cancelled, also set payment_status to 'cancelled'
      if (newStatus === 'cancelled') {
        try {
          await updatePaymentStatus(orderId, 'cancelled');
          console.log('Payment status set to cancelled for rejected order');
        } catch (err) {
          toast({
            title: "Payment Update Failed",
            description: "Order cancelled, but failed to cancel payment. Please check manually.",
            variant: "destructive"
          });
          console.error('Error setting payment status to cancelled:', err);
        }
      }

      toast({
        title: "Order Status Updated",
        description: `Order #${orderId.slice(0, 8)} status changed to ${newStatus}.`,
      });

      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    } catch (error) {
      console.error('Error updating order status:', error);
      const errorMessage =
        error && typeof error === 'object' && 'message' in error && typeof (error as { message?: string }).message === 'string'
          ? (error as { message: string }).message
          : 'Failed to update order status.';
      toast({
        title: "Error Updating Order",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Render appropriate actions based on current status
  switch (currentStatus) {
    case 'pending':
      return (
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => handleStatusUpdate('confirmed')}
            disabled={isUpdating}
            variant="default"
            size="sm"
            className="bg-green-500 hover:bg-green-600"
          >
            <Check size={16} className="mr-1" />
            Confirm
          </Button>
          <Button 
            onClick={() => handleStatusUpdate('cancelled')}
            disabled={isUpdating}
            variant="destructive"
            size="sm"
          >
            <X size={16} className="mr-1" />
            Cancel
          </Button>
        </div>
      );
    
    case 'confirmed':
      return (
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => handleStatusUpdate('preparing')}
            disabled={isUpdating}
            variant="default"
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Utensils size={16} className="mr-1" />
            Start Preparing
          </Button>
        </div>
      );
    
    case 'preparing':
      return (
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => handleStatusUpdate('ready')}
            disabled={isUpdating}
            variant="default"
            size="sm"
            className="bg-amber-500 hover:bg-amber-600"
          >
            <Package size={16} className="mr-1" />
            Mark Ready
          </Button>
        </div>
      );
    
    case 'ready':
      return (
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => handleStatusUpdate('out_for_delivery')}
            disabled={isUpdating}
            variant="default"
            size="sm"
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            <Truck size={16} className="mr-1" />
            Out for Delivery
          </Button>
        </div>
      );
    
    case 'out_for_delivery':
      return (
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => handleStatusUpdate('completed')}
            disabled={isUpdating}
            variant="default"
            size="sm"
            className="bg-green-500 hover:bg-green-600"
          >
            <Check size={16} className="mr-1" />
            Complete Order
          </Button>
        </div>
      );
    
    // Don't show any buttons for completed or cancelled orders
    case 'completed':
    case 'cancelled':
    default:
      return null;
  }
};

export default OrderActions;
