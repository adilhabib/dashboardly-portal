
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PriceHistory: React.FC = () => {
  return (
    <Card className="shadow-sm mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Price History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No price history available</p>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderStatistics: React.FC = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Order Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Orders Including This Item</h3>
            <p className="text-2xl font-bold mt-1">0</p>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Revenue Generated</h3>
            <p className="text-2xl font-bold mt-1">PKR 0.00</p>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Last Ordered</h3>
            <p className="font-medium mt-1">Never</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FoodStats: React.FC = () => {
  return (
    <>
      <PriceHistory />
      <OrderStatistics />
    </>
  );
};

export default FoodStats;
