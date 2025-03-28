
// Common types related to orders

// Define an interface for the foods object to help with type safety
export interface FoodItem {
  id: string;
  name: string;
  image_url: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  foods: FoodItem;
  unit_price: number;
  quantity: number;
  total_price: number;
  customizations?: Record<string, any> | null;
  special_instructions?: string | null;
  created_at?: string;
  product_id?: string;
  product_data?: Record<string, any> | null;
}

export interface CustomerDetails {
  id: string;
  customer_id: string;
  delivery_instructions?: string;
  dietary_restrictions?: string;
  preferences?: string;
  favorite_foods?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  loyalty_points?: number;
}

export interface Order {
  id: string;
  customer_id: string;
  order_type: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  tax: number;
  delivery_fee?: number;
  total: number;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer | null;
  delivery_address?: string;
}

export interface OrderDetail {
  order: Order;
  customer: Customer | null;
  customerDetails: CustomerDetails | null;
  orderItems: OrderItem[];
}
