
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatCurrency } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OrderItemType {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  foods?: {
    id?: string;
    name?: string;
    image_url?: string | null;
  } | null;
  product_data?: {
    sizes?: Array<{
      id: string;
      name: string;
      price: number;
      is_default: boolean;
    }>;
  } | null;
}

interface OrderType {
  id: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
}

interface OrderSummaryCardProps {
  order: OrderType;
  orderItems: OrderItemType[];
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ order, orderItems }) => {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [itemPrices, setItemPrices] = useState<Record<string, number>>({});
  const [orderTotal, setOrderTotal] = useState<number>(order.total);

  useEffect(() => {
    // Initialize selected sizes with default sizes
    const initialSizes: Record<string, string> = {};
    const initialPrices: Record<string, number> = {};
    
    orderItems.forEach(item => {
      if (item.product_data?.sizes && item.product_data.sizes.length > 0) {
        const defaultSize = item.product_data.sizes.find(size => size.is_default) || item.product_data.sizes[0];
        initialSizes[item.id] = defaultSize.id;
        initialPrices[item.id] = defaultSize.price * item.quantity;
      } else {
        initialPrices[item.id] = item.unit_price * item.quantity;
      }
    });
    
    setSelectedSizes(initialSizes);
    setItemPrices(initialPrices);
    
    // Calculate the total
    calculateOrderTotal(initialPrices);
  }, [orderItems]);
  
  const calculateOrderTotal = (prices: Record<string, number>) => {
    const newTotal = Object.values(prices).reduce((sum, price) => sum + price, 0);
    setOrderTotal(newTotal);
  };

  const handleSizeChange = (itemId: string, sizeId: string) => {
    const item = orderItems.find(item => item.id === itemId);
    if (!item || !item.product_data?.sizes) return;
    
    const size = item.product_data.sizes.find(size => size.id === sizeId);
    if (!size) return;
    
    const newSelectedSizes = { ...selectedSizes, [itemId]: sizeId };
    const newItemPrices = { 
      ...itemPrices, 
      [itemId]: size.price * item.quantity 
    };
    
    setSelectedSizes(newSelectedSizes);
    setItemPrices(newItemPrices);
    calculateOrderTotal(newItemPrices);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getItemPrice = (item: OrderItemType) => {
    return itemPrices[item.id] || item.total_price;
  };

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</CardTitle>
            <CardDescription>Placed on {formatDate(order.created_at)}</CardDescription>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Order Items</h3>
            <div className="space-y-4">
              {orderItems && orderItems.map((item: OrderItemType) => (
                <div key={item.id} className="flex flex-col border-b pb-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4">
                      {item.foods && item.foods.image_url && (
                        <img 
                          src={item.foods.image_url} 
                          alt={item.foods.name || 'Food item'}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <p className="font-medium">
                          {item.foods && item.foods.name ? item.foods.name : 'Unknown item'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × Rs. {(getItemPrice(item) / item.quantity).toFixed(2)}
                        </p>
                        {item.special_instructions && (
                          <p className="text-sm italic mt-1">"{item.special_instructions}"</p>
                        )}
                      </div>
                    </div>
                    <p className="font-medium">Rs. {getItemPrice(item).toFixed(2)}</p>
                  </div>
                  
                  {item.product_data?.sizes && item.product_data.sizes.length > 0 && (
                    <div className="ml-20 mb-2">
                      <p className="text-sm font-medium mb-1">Size Options:</p>
                      <RadioGroup
                        value={selectedSizes[item.id] || ''}
                        onValueChange={(value) => handleSizeChange(item.id, value)}
                        className="flex flex-col space-y-1"
                      >
                        <ScrollArea className="h-[100px]">
                          <div className="space-y-1 pr-3">
                            {item.product_data.sizes.map((size) => (
                              <div key={size.id} className="flex items-center space-x-2 border rounded-md p-2">
                                <RadioGroupItem value={size.id} id={`${item.id}-${size.id}`} />
                                <Label htmlFor={`${item.id}-${size.id}`} className="flex-1 flex justify-between items-center">
                                  <span>{size.name}</span>
                                  <span className="font-medium">Rs. {size.price.toFixed(2)}</span>
                                </Label>
                                {size.is_default && (
                                  <Badge variant="outline" className="bg-green-50">Default</Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </RadioGroup>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div>
          <p className="text-sm text-gray-500">Payment Status</p>
          <Badge variant="outline">{order.payment_status}</Badge>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold">Rs. {orderTotal.toFixed(2)}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderSummaryCard;
