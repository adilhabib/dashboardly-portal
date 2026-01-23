
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Mail, Phone, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomerOrders, fetchCustomerDefaultAddress } from '@/services/customerService';

interface CustomerCardProps {
  customer: any;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['customerOrders', customer.id],
    queryFn: () => fetchCustomerOrders(customer.id),
  });

  const { data: defaultAddress, isLoading: isLoadingAddress } = useQuery({
    queryKey: ['customerDefaultAddress', customer.id],
    queryFn: () => fetchCustomerDefaultAddress(customer.id),
  });

  const orderCount = orders?.length || 0;

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-medium">{customer.name}</p>
            <p className="text-xs text-gray-500">
              {isLoadingOrders ? 'Loading...' : `${orderCount} orders`}
            </p>
          </div>
          <Link to={`/customer-detail?id=${customer.id}`}>
            <Button variant="outline" size="sm">
              <Eye size={14} className="mr-1" />
              View
            </Button>
          </Link>
        </div>
        
        <div className="space-y-2 text-sm">
          {customer.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={14} className="shrink-0" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
          {customer.phone_number && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} className="shrink-0" />
              <span>{customer.phone_number}</span>
            </div>
          )}
          {!isLoadingAddress && defaultAddress?.address && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={14} className="shrink-0" />
              <span className="truncate">{defaultAddress.address}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
