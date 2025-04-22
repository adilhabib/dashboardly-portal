
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
    },
    staleTime: 0 // Always refetch to get fresh data
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['financial_summary'],
    queryFn: async () => {
      console.log('Fetching financial summary');
      const { data, error } = await supabase
        .from('financial_summary')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching financial summary:', error);
        throw error;
      }
      console.log('Fetched financial summary:', data);
      return data as FinancialSummary;
    },
    staleTime: 0, // Always refetch when requested
    refetchInterval: 2000 // Auto-refetch every 2 seconds
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
      // Force immediate refetch of both queries
      console.log('Transaction added successfully, refreshing data');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial_summary'] });
      
      toast({
        title: "Transaction recorded",
        description: "Your transaction has been successfully recorded.",
      });
      
      // Additional explicit refetch to ensure data is updated
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['financial_summary'] });
      }, 500);
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
