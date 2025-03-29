
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createTestOrder } from '@/services/order';
import { useQueryClient } from '@tanstack/react-query';
import { Order } from '@/services/order';

interface OrderActionsProps {
  customers: any[] | undefined;
  isCreatingOrder: boolean;
  setIsCreatingOrder: (value: boolean) => void;
}

const OrderActions: React.FC<OrderActionsProps> = ({ 
  customers, 
  isCreatingOrder, 
  setIsCreatingOrder 
}) => {
  const queryClient = useQueryClient();

  const handleCreateTestOrder = async () => {
    if (!customers || customers.length === 0) {
      toast({
        title: "No customers found",
        description: "Please create a customer first before creating a test order.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreatingOrder(true);
      const customer = customers[0];
      const newOrder = await createTestOrder(customer.id);
      
      // Safely access the id property, ensuring it's a string
      const orderId = typeof newOrder.id === 'string' ? newOrder.id : JSON.stringify(newOrder.id);
      
      toast({
        title: "Test Order Created",
        description: `New test order #${orderId.slice(0, 8)} has been created for ${customer.name}.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error('Error creating test order:', error);
      toast({
        title: "Error Creating Order",
        description: "Failed to create test order. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <Button 
      onClick={handleCreateTestOrder} 
      disabled={isCreatingOrder}
      className="flex items-center gap-2"
    >
      <Plus size={16} />
      Create Test Order
    </Button>
  );
};

export default OrderActions;
