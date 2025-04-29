
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import CreditRecordingForm from '@/components/customer-credit/CreditRecordingForm';
import CustomerCreditHistory from '@/components/customer-credit/CustomerCreditHistory';

const CustomerCredit = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <PageBreadcrumb pageName="Customer Credit" />
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Record Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <CreditRecordingForm />
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Credit History</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerCreditHistory />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerCredit;
