
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletIcon, Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useFinancialData } from '@/hooks/useFinancialData';
import WalletHeader from '@/components/wallet/WalletHeader';
import WalletSummaryCards from '@/components/wallet/WalletSummaryCards';
import TransactionDialog from '@/components/wallet/TransactionDialog';
import TransactionList from '@/components/wallet/TransactionList';
import FinancialChart from '@/components/wallet/FinancialChart';

const Wallet = () => {
  const { transactions, summary, isLoading, addTransaction } = useFinancialData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'income',
    description: ''
  });

  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.amount || !newTransaction.description) return;

    addTransaction.mutate({
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      description: newTransaction.description
    }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setNewTransaction({ amount: '', type: 'income', description: '' });
      }
    });
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>;
  }

  const chartData = transactions?.reduce((acc: any[], transaction) => {
    const date = new Date(transaction.created_at).toLocaleDateString();
    const existing = acc.find(item => item.name === date);
    
    if (existing) {
      if (transaction.type === 'income') {
        existing.income += transaction.amount;
      } else {
        existing.expense += transaction.amount;
      }
    } else {
      acc.push({
        name: date,
        income: transaction.type === 'income' ? transaction.amount : 0,
        expense: transaction.type === 'expense' ? transaction.amount : 0
      });
    }
    return acc;
  }, []) || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <WalletHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <WalletSummaryCards summary={summary} />
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="shadow-sm cursor-pointer">
              <CardContent className="space-y-2">
                <div className="flex items-center mt-6">
                  <WalletIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <h3 className="text-lg font-semibold">Record Transaction</h3>
                </div>
                <Button className="w-full flex justify-between items-center">
                  <span>Add New Transaction</span>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </DialogTrigger>
          
          <TransactionDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            newTransaction={newTransaction}
            setNewTransaction={setNewTransaction}
            onSubmit={handleSubmitTransaction}
            isPending={addTransaction.isPending}
          />
        </Dialog>
      </div>

      <FinancialChart chartData={chartData} />
      <TransactionList transactions={transactions || []} />
    </div>
  );
};

export default Wallet;
