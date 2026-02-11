import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InventoryItem, InventoryPurchaseFormData } from "@/types/inventory";

interface InventoryPurchaseModalProps {
  isOpen: boolean;
  items: InventoryItem[];
  onClose: () => void;
  onSave: (purchase: InventoryPurchaseFormData) => void;
}

const getToday = () => new Date().toISOString().slice(0, 10);

const InventoryPurchaseModal: React.FC<InventoryPurchaseModalProps> = ({
  isOpen,
  items,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InventoryPurchaseFormData>({
    defaultValues: {
      inventory_item_id: "",
      purchase_date: getToday(),
      quantity: 1,
      unit_cost: 0,
      supplier: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    reset({
      inventory_item_id: items[0]?.id || "",
      purchase_date: getToday(),
      quantity: 1,
      unit_cost: 0,
      supplier: "",
      notes: "",
    });
  }, [isOpen, items, reset]);

  const onSubmit = (data: InventoryPurchaseFormData) => {
    onSave({
      ...data,
      supplier: data.supplier?.trim() || null,
      notes: data.notes?.trim() || null,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Record Inventory Purchase</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="inventory_item_id">Inventory Item</Label>
            <select
              id="inventory_item_id"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("inventory_item_id", { required: "Inventory item is required" })}
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.unit})
                </option>
              ))}
            </select>
            {errors.inventory_item_id && (
              <p className="text-sm text-red-500">{errors.inventory_item_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input
              id="purchase_date"
              type="date"
              {...register("purchase_date", { required: "Purchase date is required" })}
            />
            {errors.purchase_date && (
              <p className="text-sm text-red-500">{errors.purchase_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity Purchased</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              {...register("quantity", {
                required: "Quantity is required",
                valueAsNumber: true,
                min: 0.01,
              })}
            />
            {errors.quantity && <p className="text-sm text-red-500">Quantity must be greater than 0</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit_cost">Unit Cost</Label>
            <Input
              id="unit_cost"
              type="number"
              step="0.01"
              {...register("unit_cost", {
                required: "Unit cost is required",
                valueAsNumber: true,
                min: 0,
              })}
            />
            {errors.unit_cost && <p className="text-sm text-red-500">Unit cost must be 0 or more</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Input id="supplier" placeholder="Optional" {...register("supplier")} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={3} placeholder="Invoice number, remarks..." {...register("notes")} />
          </div>

          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Purchase</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryPurchaseModal;
