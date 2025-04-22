
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newTransaction: {
    amount: string;
    type: string;
    description: string;
  };
  setNewTransaction: React.Dispatch<React.SetStateAction<{
    amount: string;
    type: string;
    description: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  isOpen,
  onOpenChange,
  newTransaction,
  setNewTransaction,
  onSubmit,
  isPending
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record New Transaction</DialogTitle>
          <DialogDescription>
            Enter the details of your financial transaction below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
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
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Recording...' : 'Record Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
