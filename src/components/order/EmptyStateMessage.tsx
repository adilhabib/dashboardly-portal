
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface EmptyStateMessageProps {
  onRefresh: () => void;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ onRefresh }) => {
  return (
    <div className="text-center py-10 bg-gray-50 rounded-lg">
      <p className="text-gray-500">No orders available</p>
      <p className="text-sm text-gray-400 mt-2">
        You don't have any orders in your database yet. Click the "Create Test Order" button above to add a test order.
      </p>
      <div className="mt-4">
        <Button
          variant="outline"
          onClick={onRefresh}
        >
          Refresh Orders
        </Button>
      </div>
    </div>
  );
};

export default EmptyStateMessage;
