
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface WalletSummaryCardsProps {
  summary: {
    balance: number;
    total_income: number;
    total_expenses: number;
    total_transactions: number;
    last_transaction_date: string;
  } | null;
}

const WalletSummaryCards: React.FC<WalletSummaryCardsProps> = ({ summary }) => {
  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardDescription>Current Balance</CardDescription>
          <CardTitle className="text-3xl font-bold">
            {formatCurrency(summary?.balance || 0)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-2 p-1.5 rounded-full bg-green-100">
                <ArrowUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Income</p>
                <p className="font-medium">{formatCurrency(summary?.total_income || 0)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-2 p-1.5 rounded-full bg-red-100">
                <ArrowDown className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Expenses</p>
                <p className="font-medium">{formatCurrency(summary?.total_expenses || 0)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletSummaryCards;
