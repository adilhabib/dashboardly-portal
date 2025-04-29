
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CreditTransaction {
  id: string;
  created_at: string;
  amount: number;
  description: string;
  status: string;
  type: string;
  user_id: string;
}

const CustomerCreditHistory = () => {
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['customer-credits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('type', 'income')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      return data as CreditTransaction[];
    },
  });
  
  return (
    <div className="space-y-4">
      {isLoadingTransactions ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : transactions && transactions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>
                  <Badge variant={transaction.status === 'completed' ? 'secondary' : 'outline'}>
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No credit transactions found
        </div>
      )}
    </div>
  );
};

export default CustomerCreditHistory;
