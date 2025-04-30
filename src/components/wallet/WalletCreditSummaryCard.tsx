
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, ArrowDown } from 'lucide-react';

const WalletCreditSummaryCard = () => {
  // Fetch total credits given to customers
  const { data: creditData, isLoading } = useQuery({
    queryKey: ['total-customer-credits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('type', 'income')
        .like('description', '%Credit from customer%');
        
      if (error) throw error;
      
      // Calculate total credits
      const totalCredits = data.reduce((sum, transaction) => sum + transaction.amount, 0);
      return totalCredits;
    },
  });

  return (
    <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
          Customer Credits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-purple-600">
            {isLoading ? 'Loading...' : formatCurrency(creditData || 0)}
          </p>
          <div className="text-sm text-gray-500">
            Total credit extended to customers
          </div>
          <div className="flex items-center mt-2">
            <div className="p-1.5 rounded-full bg-purple-100">
              <ArrowDown className="h-4 w-4 text-purple-600" />
            </div>
            <span className="ml-2 text-sm text-gray-600">Deducted from income</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCreditSummaryCard;
