export interface InventoryItem {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
  quantity: number;
  reorder_level: number;
  cost_per_unit: number | null;
  food_id: string | null;
  last_restocked: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryItemFormData {
  name: string;
  sku?: string | null;
  unit: string;
  quantity: number;
  reorder_level: number;
  cost_per_unit?: number | null;
  food_id?: string | null;
  last_restocked?: string | null;
}

export interface InventoryPurchase {
  id: string;
  inventory_item_id: string;
  purchase_date: string;
  purchase_month: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  supplier: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  inventory_item?: {
    id: string;
    name: string;
    unit: string;
  } | null;
}

export interface InventoryPurchaseFormData {
  inventory_item_id: string;
  purchase_date: string;
  quantity: number;
  unit_cost: number;
  supplier?: string | null;
  notes?: string | null;
}
