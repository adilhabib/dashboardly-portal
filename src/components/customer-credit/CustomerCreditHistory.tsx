
import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { fetchCustomers } from '@/services/customerService';
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
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['customer-credits', selectedCustomerId],
    queryFn: async () => {
      if (!selectedCustomerId) return [];
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('type', 'income')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      return data as CreditTransaction[];
    },
    enabled: !!selectedCustomerId,
  });
  
  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };
  
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Label htmlFor="customer-filter">Filter by Customer</Label>
        <Select 
          onValueChange={handleCustomerChange} 
          disabled={isLoadingCustomers}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a customer" />
          </SelectTrigger>
          <SelectContent>
            {customers?.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
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
      ) : selectedCustomerId ? (
        <div className="text-center py-8 text-gray-500">
          No credit transactions found for this customer
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Select a customer to view credit history
        </div>
      )}
    </div>
  );
};

export default CustomerCreditHistory;
