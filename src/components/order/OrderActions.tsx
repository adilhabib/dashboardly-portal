
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

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

  const createTestOrder = async (customerId: string) => {
    console.log('Creating test order for customer ID:', customerId);
    
    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        status: 'pending',
        payment_status: 'unpaid',
        payment_method: 'cash',
        order_type: 'delivery',
        subtotal: 1500.00,
        tax: 7.5,
        total: 1612.50,
        special_instructions: 'Test order, please do not process.'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating test order:', error);
      throw error;
    }
    
    console.log('Test order created:', newOrder);
    return newOrder;
  };

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
      
      toast({
        title: "Test Order Created",
        description: `New test order #${newOrder.id.slice(0, 8)} has been created for ${customer.name}.`,
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
