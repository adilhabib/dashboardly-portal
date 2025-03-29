
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatCurrency } from '@/lib/utils';

interface SummaryCardProps {
  customer: any;
  orders: any[];
}

const SummaryCard: React.FC<SummaryCardProps> = ({ customer, orders }) => {
  // Calculate total spent (properly checking if orders exist and have a total field)
  const totalSpent = orders?.reduce((sum: number, order: any) => {
    // Make sure to check if total property exists and is a number
    const orderTotal = typeof order.total === 'number' ? order.total : 0;
    return sum + orderTotal;
  }, 0) || 0;

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Customer Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-2xl font-bold mt-1">{orders?.length || 0}</p>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
            <p className="font-medium mt-1">
              {formatDate(customer.created_at)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
