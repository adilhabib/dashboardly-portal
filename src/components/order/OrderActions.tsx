
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { updateOrderStatus } from '@/services/order';
import { useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
}

const OrderActions: React.FC<OrderActionsProps> = ({ orderId, currentStatus }) => {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
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
      
      toast({
        title: "Order Status Updated",
        description: `Order #${orderId.slice(0, 8)} has been ${newStatus === 'completed' ? 'accepted' : 'rejected'}.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error Updating Order",
        description: "Failed to update order status. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Don't show the buttons if the order is already completed or cancelled
  if (currentStatus === 'completed' || currentStatus === 'cancelled') {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={() => handleStatusUpdate('completed')}
        disabled={isUpdating}
        variant="default"
        size="sm"
        className="bg-green-500 hover:bg-green-600"
      >
        <Check size={16} />
        Accept
      </Button>
      <Button 
        onClick={() => handleStatusUpdate('cancelled')}
        disabled={isUpdating}
        variant="destructive"
        size="sm"
      >
        <X size={16} />
        Reject
      </Button>
    </div>
  );
};

export default OrderActions;
