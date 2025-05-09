
import React from 'react';

interface OrderErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

const OrderErrorState: React.FC<OrderErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="text-center py-10 text-red-500">
      <p>Error loading orders</p>
      <p className="text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
      <button 
        onClick={onRetry} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
  );
};

export default OrderErrorState;
