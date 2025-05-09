
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import OrderStatusFilter, { OrderStatusFilter as StatusFilterType } from '@/components/order/OrderStatusFilter';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface OrderHeaderProps {
  statusFilter: StatusFilterType;
  onFilterChange: (value: StatusFilterType) => void;
  isConnected: boolean;
  handleReconnect: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  lastUpdate: {
    type: 'INSERT' | 'UPDATE' | 'DELETE' | null;
    order: any | null;
    timestamp: Date | null;
  };
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  statusFilter,
  onFilterChange,
  isConnected,
  handleReconnect,
  isRefreshing,
  onRefresh,
  lastUpdate
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CardTitle className="text-2xl font-bold">Order List</CardTitle>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <OrderStatusFilter 
            value={statusFilter} 
            onChange={onFilterChange} 
          />
          
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center text-sm text-gray-500 mr-2">
              {isConnected ? (
                <Badge variant="outline" className="bg-green-50 text-green-600 flex items-center gap-1 py-1">
                  <Wifi size={14} className="text-green-600" />
                  <span>Realtime Connected</span>
                </Badge>
              ) : (
                <Badge 
                  variant="outline" 
                  className="bg-amber-50 text-amber-600 flex items-center gap-1 py-1 cursor-pointer hover:bg-amber-100"
                  onClick={handleReconnect}
                >
                  <WifiOff size={14} className="text-amber-600" />
                  <span>Realtime Disconnected (click to reconnect)</span>
                </Badge>
              )}
            </div>
            <Button 
              variant="outline"
              onClick={onRefresh} 
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
      
      {lastUpdate.timestamp && (
        <div className="text-xs text-gray-500 mt-2">
          Last update: {lastUpdate.type} - {lastUpdate.timestamp.toLocaleTimeString()}
          {lastUpdate.order && lastUpdate.order.id && 
            <span> - Order #{(lastUpdate.order.id as string).slice(0, 8)}</span>
          }
        </div>
      )}
    </>
  );
};

export default OrderHeader;
