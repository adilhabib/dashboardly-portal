import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InventoryItem, InventoryItemFormData } from "@/types/inventory";

interface InventoryItemModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (item: InventoryItemFormData | InventoryItem) => void;
}

const InventoryItemModal: React.FC<InventoryItemModalProps> = ({
  isOpen,
  item,
  onClose,
  onSave,
}) => {
  const isEditing = !!item;
  const { register, handleSubmit, formState: { errors }, reset } = useForm<InventoryItemFormData>({
    defaultValues: {
      name: "",
      sku: "",
      unit: "pcs",
      quantity: 0,
      reorder_level: 10,
      cost_per_unit: undefined,
      food_id: "",
      last_restocked: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (item) {
      reset({
        name: item.name,
        sku: item.sku || "",
        unit: item.unit,
        quantity: item.quantity,
        reorder_level: item.reorder_level,
        cost_per_unit: item.cost_per_unit ?? undefined,
        food_id: item.food_id || "",
        last_restocked: item.last_restocked ? item.last_restocked.slice(0, 10) : "",
      });
      return;
    }

    reset({
      name: "",
      sku: "",
      unit: "pcs",
      quantity: 0,
      reorder_level: 10,
      cost_per_unit: undefined,
      food_id: "",
      last_restocked: "",
    });
  }, [isOpen, item, reset]);

  const onSubmit = (data: InventoryItemFormData) => {
    const payload: InventoryItemFormData = {
      ...data,
      sku: data.sku?.trim() || null,
      food_id: data.food_id?.trim() || null,
      cost_per_unit: Number.isFinite(data.cost_per_unit) ? data.cost_per_unit : null,
      last_restocked: data.last_restocked ? new Date(data.last_restocked).toISOString() : null,
    };

    if (isEditing && item) {
      onSave({
        ...item,
        ...payload,
      });
      return;
    }

    onSave(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Inventory Item" : "Add Inventory Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Item Name</Label>
            <Input id="name" {...register("name", { required: "Item name is required" })} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" {...register("sku")} placeholder="Optional" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" {...register("unit", { required: "Unit is required" })} placeholder="pcs, kg, ltr" />
            {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              {...register("quantity", { required: "Quantity is required", valueAsNumber: true, min: 0 })}
            />
            {errors.quantity && <p className="text-sm text-red-500">Quantity must be 0 or more</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reorder_level">Reorder Level</Label>
            <Input
              id="reorder_level"
              type="number"
              step="0.01"
              {...register("reorder_level", { required: "Reorder level is required", valueAsNumber: true, min: 0 })}
            />
            {errors.reorder_level && <p className="text-sm text-red-500">Reorder level must be 0 or more</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost_per_unit">Cost Per Unit</Label>
            <Input id="cost_per_unit" type="number" step="0.01" {...register("cost_per_unit", { valueAsNumber: true })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_restocked">Last Restocked</Label>
            <Input id="last_restocked" type="date" {...register("last_restocked")} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="food_id">Linked Food ID</Label>
            <Input id="food_id" {...register("food_id")} placeholder="Optional UUID from foods table" />
          </div>

          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update Item" : "Create Item"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryItemModal;
