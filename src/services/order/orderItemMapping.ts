
import { OrderItem, FoodItem } from './orderTypes';

export const mapOrderItems = (orderItems: any[]): OrderItem[] => {
  return (orderItems || []).map(item => {
    let special_instructions = null;
    if (item.customizations && typeof item.customizations === 'object') {
      const customizations = item.customizations as Record<string, any>;
      special_instructions = customizations.special_instructions || null;
    }
    
    const productData = item.product_data as Record<string, any> || {};
    const defaultFoodItem: FoodItem = {
      id: item.product_id || '',
      name: productData.name || 'Unknown item',
      image_url: productData.image_url || null
    };
    
    return {
      ...item,
      foods: defaultFoodItem,
      special_instructions,
      unit_price: item.unit_price,
      customizations: item.customizations as Record<string, any> | null,
      product_data: item.product_data as Record<string, any> | null
    };
  });
};
