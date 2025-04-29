
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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
  // Default values in case summary is null
  const balance = summary?.balance || 0;
  const totalIncome = summary?.total_income || 0;
  const totalExpenses = summary?.total_expenses || 0;
  const transactionCount = summary?.total_transactions || 0;
  const lastTransactionDate = summary?.last_transaction_date 
    ? new Date(summary.last_transaction_date).toLocaleDateString() 
    : 'No transactions yet';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-2">
          <CardDescription>Current Balance</CardDescription>
          <CardTitle className="text-3xl font-bold">
            {formatCurrency(balance)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-primary/10">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-gray-600">{transactionCount} transactions</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Last updated: {lastTransactionDate}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10">
        <CardHeader className="pb-2">
          <CardDescription>Total Income</CardDescription>
          <CardTitle className="text-2xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="p-1.5 rounded-full bg-green-100">
              <ArrowUp className="h-4 w-4 text-green-600" />
            </div>
            <span className="ml-2 text-sm text-gray-600">Income transactions</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-500/5 to-red-500/10">
        <CardHeader className="pb-2">
          <CardDescription>Total Expenses</CardDescription>
          <CardTitle className="text-2xl font-bold text-red-600">
            {formatCurrency(totalExpenses)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="p-1.5 rounded-full bg-red-100">
              <ArrowDown className="h-4 w-4 text-red-600" />
            </div>
            <span className="ml-2 text-sm text-gray-600">Expense transactions</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletSummaryCards;
