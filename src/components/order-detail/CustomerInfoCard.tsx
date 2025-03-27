
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CustomerType {
  id: string;
  name: string;
  phone_number?: string;
  email?: string;
  address?: string;
}

interface CustomerDetailsType {
  id: string;
  customer_id: string;
  dietary_restrictions?: string;
  delivery_instructions?: string;
}

interface CustomerInfoCardProps {
  customer: CustomerType | null;
  customerDetails: CustomerDetailsType | null;
  deliveryAddress?: string;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ 
  customer, 
  customerDetails, 
  deliveryAddress 
}) => {
  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Name</h4>
          <p>{customer?.name || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Contact</h4>
          <p>{customer?.phone_number || 'No phone'}</p>
          <p className="text-sm">{customer?.email || 'No email'}</p>
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-medium text-gray-500">Delivery Address</h4>
          <p>{deliveryAddress || customer?.address || 'No address provided'}</p>
        </div>
        {customerDetails?.dietary_restrictions && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-500">Dietary Restrictions</h4>
              <p>{customerDetails.dietary_restrictions}</p>
            </div>
          </>
        )}
        {customerDetails?.delivery_instructions && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-500">Delivery Instructions</h4>
              <p>{customerDetails.delivery_instructions}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerInfoCard;
