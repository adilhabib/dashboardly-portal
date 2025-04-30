
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Clock } from 'lucide-react';

interface CreditSummaryCardProps {
  customer: any;
}

const CreditSummaryCard: React.FC<CreditSummaryCardProps> = ({ customer }) => {
  // Fetch customer credit transactions
  const { data: creditTransactions, isLoading } = useQuery({
    queryKey: ['customer-credit-summary', customer?.id],
    queryFn: async () => {
      if (!customer?.id) return [];
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('type', 'income')
        .like('description', '%Credit from customer%')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!customer?.id,
  });

  // Calculate total credit
  const totalCredit = creditTransactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;
  
  // Get most recent credit date
  const lastCreditDate = creditTransactions && creditTransactions.length > 0
    ? new Date(creditTransactions[0].created_at).toLocaleDateString()
    : 'No credits recorded';

  return (
    <Card className="shadow-sm mb-6 bg-purple-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
          <span>Credit Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Credit</h3>
            <p className="text-2xl font-bold mt-1 text-purple-700">
              {isLoading ? 'Loading...' : formatCurrency(totalCredit)}
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Current Loyalty Points</h3>
            <p className="text-xl font-bold mt-1 text-purple-600">
              {customer?.loyalty_points || 0}
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Last Credit</h3>
            <div className="flex items-center mt-1 text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <p className="font-medium">{lastCreditDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditSummaryCard;
