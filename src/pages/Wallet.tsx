
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BarChart from '@/components/BarChart';
import { ArrowDown, ArrowUp, Wallet as WalletIcon, Plus } from 'lucide-react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useFinancialData } from '@/hooks/useFinancialData';

const Wallet = () => {
  const { transactions, summary, isLoading, addTransaction } = useFinancialData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'income',
    description: ''
  });

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toFixed(2)}`;
  };

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
      <PageBreadcrumb pageName="Financial Management" />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Financial Management</h1>
        <p className="text-gray-500">Track your restaurant's income, expenses, and financial performance</p>
      </div>
      
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="shadow-sm cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <WalletIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <CardTitle>Record Transaction</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full flex justify-between items-center">
                  <span>Add New Transaction</span>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Transaction</DialogTitle>
              <DialogDescription>
                Enter the details of your financial transaction below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitTransaction}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value) => setNewTransaction(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description"
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" disabled={addTransaction.isPending}>
                  {addTransaction.isPending ? 'Recording...' : 'Record Transaction'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Overview</CardTitle>
            <CardDescription>Transaction Summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold">{summary?.total_transactions || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Transaction</p>
              <p className="text-base">
                {summary?.last_transaction_date 
                  ? new Date(summary.last_transaction_date).toLocaleDateString()
                  : 'No transactions yet'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle>Financial Performance</CardTitle>
          <CardDescription>Income vs Expenses Overview</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <BarChart
            data={chartData}
            categoryKey="name"
            series={[
              { valueKey: 'income', label: 'Income', color: '#4ade80' },
              { valueKey: 'expense', label: 'Expenses', color: '#f87171' }
            ]}
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                      }
                    >
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wallet;
