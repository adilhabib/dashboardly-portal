import { supabase } from "@/integrations/supabase/client";
import {
  InventoryItem,
  InventoryItemFormData,
  InventoryPurchase,
  InventoryPurchaseFormData,
} from "@/types/inventory";

export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching inventory items:", error);
    throw error;
  }

  return data ?? [];
};

export const createInventoryItem = async (
  item: InventoryItemFormData
): Promise<InventoryItem> => {
  const payload = {
    ...item,
    sku: item.sku || null,
    food_id: item.food_id || null,
    cost_per_unit: item.cost_per_unit ?? null,
    last_restocked: item.last_restocked || null,
  };

  const { data, error } = await supabase
    .from("inventory_items")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Error creating inventory item:", error);
    throw error;
  }

  return data;
};

export const updateInventoryItem = async (
  item: InventoryItem
): Promise<InventoryItem> => {
  const payload = {
    name: item.name,
    sku: item.sku || null,
    unit: item.unit,
    quantity: item.quantity,
    reorder_level: item.reorder_level,
    cost_per_unit: item.cost_per_unit ?? null,
    food_id: item.food_id || null,
    last_restocked: item.last_restocked || null,
  };

  const { data, error } = await supabase
    .from("inventory_items")
    .update(payload)
    .eq("id", item.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating inventory item:", error);
    throw error;
  }

  return data;
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
  const { error } = await supabase.from("inventory_items").delete().eq("id", id);

  if (error) {
    console.error("Error deleting inventory item:", error);
    throw error;
  }
};

export const adjustInventoryQuantity = async (
  id: string,
  quantity: number
): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from("inventory_items")
    .update({
      quantity,
      last_restocked: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error adjusting inventory quantity:", error);
    throw error;
  }

  return data;
};

const getMonthBounds = (month: string) => {
  const [yearValue, monthValue] = month.split("-").map(Number);
  const start = new Date(Date.UTC(yearValue, monthValue - 1, 1));
  const end = new Date(Date.UTC(yearValue, monthValue, 0, 23, 59, 59, 999));

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
};

export const fetchInventoryPurchases = async (
  month?: string
): Promise<InventoryPurchase[]> => {
  let query = supabase
    .from("inventory_purchases")
    .select(
      `
      *,
      inventory_item:inventory_items (
        id,
        name,
        unit
      )
    `
    )
    .order("purchase_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (month) {
    const { start, end } = getMonthBounds(month);
    query = query.gte("purchase_date", start).lte("purchase_date", end);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching inventory purchases:", error);
    throw error;
  }

  return (data ?? []) as InventoryPurchase[];
};

export const createInventoryPurchase = async (
  purchase: InventoryPurchaseFormData
): Promise<InventoryPurchase> => {
  const purchaseDate = purchase.purchase_date || new Date().toISOString().slice(0, 10);
  const purchaseMonth = `${purchaseDate.slice(0, 7)}-01`;

  const payload = {
    inventory_item_id: purchase.inventory_item_id,
    purchase_date: purchaseDate,
    purchase_month: purchaseMonth,
    quantity: purchase.quantity,
    unit_cost: purchase.unit_cost,
    total_cost: Number((purchase.quantity * purchase.unit_cost).toFixed(2)),
    supplier: purchase.supplier || null,
    notes: purchase.notes || null,
  };

  const { data, error } = await supabase
    .from("inventory_purchases")
    .insert(payload)
    .select(
      `
      *,
      inventory_item:inventory_items (
        id,
        name,
        unit
      )
    `
    )
    .single();

  if (error) {
    console.error("Error creating inventory purchase:", error);
    throw error;
  }

  return data as InventoryPurchase;
};
