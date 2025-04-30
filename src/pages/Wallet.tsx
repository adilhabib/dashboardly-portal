
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
import WalletCreditSummaryCard from '@/components/wallet/WalletCreditSummaryCard';

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
    <div className="container mx-auto px-4 py-6 space-y-6">
      <WalletHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <WalletSummaryCards summary={summary} />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="h-full shadow-sm cursor-pointer hover:bg-accent/5 transition-colors">
              <CardContent className="h-full flex flex-col justify-center space-y-4">
                <div className="flex items-center justify-center">
                  <WalletIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-center">Record Transaction</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <WalletCreditSummaryCard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <FinancialChart chartData={chartData} />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <TransactionList transactions={transactions || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wallet;
