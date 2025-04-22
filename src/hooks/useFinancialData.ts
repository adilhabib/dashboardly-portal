
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

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['financial_summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_summary')
        .select('*')
        .single();

      if (error) throw error;
      return data as FinancialSummary;
    },
    // Ensure we always get a fresh summary
    staleTime: 0
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
      // Invalidate both queries to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial_summary'] });
      
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
    isLoading: isLoadingTransactions || isLoadingSummary,
    addTransaction
  };
};
