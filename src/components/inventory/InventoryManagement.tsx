import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  adjustInventoryQuantity,
  createInventoryItem,
  createInventoryPurchase,
  deleteInventoryItem,
  fetchInventoryItems,
  fetchInventoryPurchases,
  updateInventoryItem,
} from "@/services/inventoryService";
import { InventoryItem, InventoryItemFormData } from "@/types/inventory";
import InventoryItemModal from "./InventoryItemModal";
import InventoryPurchaseModal from "./InventoryPurchaseModal";

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const InventoryManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const { data: items, isLoading, isError } = useQuery({
    queryKey: ["inventory-items"],
    queryFn: fetchInventoryItems,
    retry: 1,
  });

  const { data: purchases, isLoading: isPurchasesLoading } = useQuery({
    queryKey: ["inventory-purchases", selectedMonth],
    queryFn: () => fetchInventoryPurchases(selectedMonth),
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      toast.success("Inventory item created");
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Error creating inventory item:", error);
      toast.error("Failed to create inventory item");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      toast.success("Inventory item updated");
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Error updating inventory item:", error);
      toast.error("Failed to update inventory item");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      toast.success("Inventory item deleted");
    },
    onError: (error) => {
      console.error("Error deleting inventory item:", error);
      toast.error("Failed to delete inventory item");
    },
  });

  const adjustMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      adjustInventoryQuantity(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
    },
    onError: (error) => {
      console.error("Error adjusting inventory quantity:", error);
      toast.error("Failed to adjust quantity");
    },
  });

  const createPurchaseMutation = useMutation({
    mutationFn: createInventoryPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-purchases"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      toast.success("Purchase record saved");
      setIsPurchaseModalOpen(false);
    },
    onError: (error) => {
      console.error("Error saving purchase record:", error);
      toast.error("Failed to save purchase record");
    },
  });

  const filteredItems = useMemo(() => {
    const allItems = items ?? [];
    const normalizedSearch = search.toLowerCase().trim();

    if (!normalizedSearch) return allItems;

    return allItems.filter((item) => {
      return (
        item.name.toLowerCase().includes(normalizedSearch) ||
        (item.sku || "").toLowerCase().includes(normalizedSearch)
      );
    });
  }, [items, search]);

  const lowStockCount = useMemo(() => {
    return (items ?? []).filter((item) => item.quantity <= item.reorder_level).length;
  }, [items]);

  const totalItems = items?.length ?? 0;
  const monthlyPurchases = purchases ?? [];
  const monthlySpend = monthlyPurchases.reduce((sum, purchase) => sum + purchase.total_cost, 0);
  const monthlyPurchasedQuantity = monthlyPurchases.reduce(
    (sum, purchase) => sum + purchase.quantity,
    0
  );

  const openCreateModal = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this inventory item?")) return;
    deleteMutation.mutate(id);
  };

  const handleSave = (item: InventoryItemFormData | InventoryItem) => {
    if ("id" in item) {
      updateMutation.mutate(item);
      return;
    }

    createMutation.mutate(item);
  };

  const changeQuantity = (item: InventoryItem, delta: number) => {
    const nextQuantity = Math.max(0, Number((item.quantity + delta).toFixed(2)));
    adjustMutation.mutate({ id: item.id, quantity: nextQuantity });
  };

  const renderStockBadge = (item: InventoryItem) => {
    if (item.quantity <= item.reorder_level) {
      return <Badge variant="destructive">Low</Badge>;
    }
    return <Badge variant="secondary">In Stock</Badge>;
  };

  const handleSavePurchase = (purchase: {
    inventory_item_id: string;
    purchase_date: string;
    quantity: number;
    unit_cost: number;
    supplier?: string | null;
    notes?: string | null;
  }) => {
    createPurchaseMutation.mutate(purchase);
  };

  if (isLoading) {
    return <div className="py-10 text-center">Loading inventory...</div>;
  }

  if (isError) {
    return (
      <div className="py-10 text-center">
        <p className="mb-4 text-red-500">Failed to load inventory data</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["inventory-items"] })}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-muted-foreground">Total Inventory Items</p>
          <p className="text-2xl font-bold">{totalItems}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
          <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-muted-foreground">Healthy Stock</p>
          <p className="text-2xl font-bold text-emerald-600">{Math.max(0, totalItems - lowStockCount)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by item name or SKU..."
          className="md:max-w-sm"
        />
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus size={16} />
          Add Inventory Item
        </Button>
      </div>

      {filteredItems.length > 0 ? (
        <div className="overflow-hidden rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost/Unit</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead className="w-[170px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku || "-"}</TableCell>
                  <TableCell className="uppercase">{item.unit}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.reorder_level}</TableCell>
                  <TableCell>{renderStockBadge(item)}</TableCell>
                  <TableCell>{item.cost_per_unit != null ? `Rs: ${item.cost_per_unit.toFixed(2)}` : "-"}</TableCell>
                  <TableCell>
                    {item.last_restocked ? new Date(item.last_restocked).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => changeQuantity(item, -1)}
                        title="Decrease stock"
                      >
                        <TrendingDown size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => changeQuantity(item, 1)}
                        title="Increase stock"
                      >
                        <TrendingUp size={15} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(item)} title="Edit item">
                        <Pencil size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        title="Delete item"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border bg-gray-50 py-10 text-center">
          <p className="text-muted-foreground">No inventory items found</p>
        </div>
      )}

      <div className="space-y-4 rounded-lg border bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Monthly Purchasing Records</h2>
            <p className="text-sm text-muted-foreground">
              Track purchases and keep monthly spending history.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="sm:w-[180px]"
            />
            <Button
              onClick={() => setIsPurchaseModalOpen(true)}
              className="flex items-center gap-2"
              disabled={totalItems === 0}
            >
              <Plus size={16} />
              Record Purchase
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Monthly Spend</p>
            <p className="text-2xl font-bold">Rs: {monthlySpend.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Purchase Entries</p>
            <p className="text-2xl font-bold">{monthlyPurchases.length}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Total Quantity Bought</p>
            <p className="text-2xl font-bold">{monthlyPurchasedQuantity.toFixed(2)}</p>
          </div>
        </div>

        {isPurchasesLoading ? (
          <div className="py-6 text-center text-muted-foreground">Loading monthly purchases...</div>
        ) : monthlyPurchases.length > 0 ? (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{new Date(purchase.purchase_date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">
                      {purchase.inventory_item?.name || "Unknown Item"}
                    </TableCell>
                    <TableCell>
                      {purchase.quantity} {purchase.inventory_item?.unit || ""}
                    </TableCell>
                    <TableCell>Rs: {purchase.unit_cost.toFixed(2)}</TableCell>
                    <TableCell>Rs: {purchase.total_cost.toFixed(2)}</TableCell>
                    <TableCell>{purchase.supplier || "-"}</TableCell>
                    <TableCell className="max-w-[260px] truncate">{purchase.notes || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-lg border bg-gray-50 py-8 text-center">
            <p className="text-muted-foreground">No purchase records found for this month.</p>
          </div>
        )}
      </div>

      <InventoryItemModal isOpen={isModalOpen} item={selectedItem} onClose={closeModal} onSave={handleSave} />
      <InventoryPurchaseModal
        isOpen={isPurchaseModalOpen}
        items={items ?? []}
        onClose={() => setIsPurchaseModalOpen(false)}
        onSave={handleSavePurchase}
      />
    </div>
  );
};

export default InventoryManagement;
