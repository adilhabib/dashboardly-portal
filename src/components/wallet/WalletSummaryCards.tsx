
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
  isLoading?: boolean;
}

const WalletSummaryCards: React.FC<WalletSummaryCardsProps> = ({ summary, isLoading }) => {
  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toFixed(2)}`;
  };
  
  // Default to 0 if summary is null or values are undefined
  const balance = summary?.balance || 0;
  const totalIncome = summary?.total_income || 0;
  const totalExpenses = summary?.total_expenses || 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-2">
            <CardDescription>Current Balance</CardDescription>
            <CardTitle className="text-3xl font-bold">Loading...</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10">
          <CardHeader className="pb-2">
            <CardDescription>Total Income</CardDescription>
            <CardTitle className="text-2xl font-bold text-green-600">Loading...</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/5 to-red-500/10">
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-2xl font-bold text-red-600">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-2">
          <CardDescription>Current Balance</CardDescription>
          <CardTitle className="text-3xl font-bold">
            {formatCurrency(balance)}
          </CardTitle>
        </CardHeader>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletSummaryCards;
