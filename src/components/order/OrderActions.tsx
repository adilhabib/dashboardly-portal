
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { updateOrderStatus } from '@/services/order';
import { useQueryClient } from '@tanstack/react-query';
import { Check, X, PackageCheck } from 'lucide-react';

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
      
      let statusMessage = '';
      switch(newStatus) {
        case 'processing':
          statusMessage = 'accepted';
          break;
        case 'cancelled':
          statusMessage = 'cancelled';
          break;
        case 'completed':
          statusMessage = 'completed';
          break;
        default:
          statusMessage = 'updated';
      }
      
      toast({
        title: "Order Status Updated",
        description: `Order #${orderId.slice(0, 8)} has been ${statusMessage}.`,
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

  // Render appropriate actions based on current status
  if (currentStatus === 'pending') {
    return (
      <div className="flex items-center gap-2">
        <Button 
          onClick={() => handleStatusUpdate('processing')}
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
  } else if (currentStatus === 'processing') {
    return (
      <div className="flex items-center gap-2">
        <Button 
          onClick={() => handleStatusUpdate('completed')}
          disabled={isUpdating}
          variant="default"
          size="sm"
          className="bg-blue-500 hover:bg-blue-600"
        >
          <PackageCheck size={16} />
          Complete
        </Button>
      </div>
    );
  }

  // Don't show any buttons for completed or cancelled orders
  return null;
};

export default OrderActions;
