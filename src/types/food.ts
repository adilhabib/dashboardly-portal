
export interface Food {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface FoodDetail {
  id: string;
  food_id: string;
  calories: number | null;
  ingredients: string | null;
  allergens: string | null;
  preparation_time: number | null;
  created_at: string;
  updated_at: string;
}
