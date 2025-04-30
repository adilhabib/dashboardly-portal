
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  status: string;
  created_at: string;
}

interface FinancialSummary {
  total_income: number;
  total_expenses: number;
  balance: number;
  total_transactions: number;
  last_transaction_date: string;
  total_credits: number;
}

export const useFinancialData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    }
  });

  // Calculate total customer credits
  const { data: totalCredits, isLoading: isLoadingCredits } = useQuery({
    queryKey: ['customer-credits-sum'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('type', 'income')
        .like('description', '%Credit from customer%');
        
      if (error) throw error;
      return data.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;
    }
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['financial_summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_summary')
        .select('*')
        .single();

      if (error) throw error;
      
      // Add total credits to the summary
      const summaryWithCredits = {
        ...data,
        total_credits: totalCredits || 0,
        // Adjust balance by subtracting credits
        balance: (data.balance || 0) - (totalCredits || 0)
      } as FinancialSummary;
      
      return summaryWithCredits;
    },
    enabled: !isLoadingCredits,
  });

  const addTransaction = useMutation({
    mutationFn: async ({ amount, type, description }: { amount: number; type: string; description: string }) => {
      const { data, error } = await supabase
        .rpc('record_financial_transaction', {
          p_amount: amount,
          p_type: type,
          p_description: description
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial_summary'] });
      queryClient.invalidateQueries({ queryKey: ['customer-credits-sum'] });
      toast({
        title: "Transaction recorded",
        description: "Your transaction has been successfully recorded.",
      });
    },
    onError: (error) => {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to record transaction. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    transactions,
    summary,
    isLoading: isLoadingTransactions || isLoadingSummary || isLoadingCredits,
    addTransaction
  };
};
