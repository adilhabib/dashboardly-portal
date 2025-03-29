
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface EmptyStateMessageProps {
  onRefresh: () => void;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ onRefresh }) => {
  return (
    <div className="text-center py-10 bg-gray-50 rounded-lg">
      <p className="text-gray-500 font-medium">No orders available</p>
      <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
        You don't have any orders in your database yet. Click the "Create Test Order" button above to add a test order, or refresh to check for new orders.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh Orders
        </Button>
        <Button
          onClick={() => {
            toast({
              title: "Add an order",
              description: "Click the 'Create Test Order' button at the top right to add a test order."
            });
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} />
          How to Add Orders
        </Button>
      </div>
    </div>
  );
};

export default EmptyStateMessage;
