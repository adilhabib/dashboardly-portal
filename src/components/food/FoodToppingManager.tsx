
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchToppings, createTopping, updateTopping, deleteTopping, FoodTopping } from '@/services/toppingService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

interface FoodToppingManagerProps {
  foodId: string | null;
}

const FoodToppingManager: React.FC<FoodToppingManagerProps> = ({ foodId }) => {
  const queryClient = useQueryClient();
  const [newTopping, setNewTopping] = useState({ name: '', price: '' });
  const [editingTopping, setEditingTopping] = useState<FoodTopping | null>(null);

  const { data: toppings = [], isLoading } = useQuery({
    queryKey: ['foodToppings', foodId],
    queryFn: () => fetchToppings(foodId as string),
    enabled: !!foodId,
  });

  const createMutation = useMutation({
    mutationFn: createTopping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodToppings', foodId] });
      setNewTopping({ name: '', price: '' });
      toast.success('Topping added successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FoodTopping> }) =>
      updateTopping(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodToppings', foodId] });
      setEditingTopping(null);
      toast.success('Topping updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTopping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodToppings', foodId] });
      toast.success('Topping deleted successfully');
    },
  });

  const handleAddTopping = () => {
    if (!foodId || !newTopping.name || !newTopping.price) return;
    
    createMutation.mutate({
      food_id: foodId,
      name: newTopping.name,
      price: Number(newTopping.price),
      is_active: true,
    });
  };

  if (!foodId) {
    return (
      <div className="text-sm text-muted-foreground">
        Save the food item first to manage toppings.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Toppings</h3>
      
      <div className="grid grid-cols-[1fr,auto,auto] gap-2 items-end">
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Topping name"
            value={newTopping.name}
            onChange={(e) => setNewTopping(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            value={newTopping.price}
            onChange={(e) => setNewTopping(prev => ({ ...prev, price: e.target.value }))}
          />
        </div>
        <Button
          onClick={handleAddTopping}
          disabled={!newTopping.name || !newTopping.price}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {isLoading ? (
        <div>Loading toppings...</div>
      ) : (
        <div className="space-y-2">
          {toppings.map((topping) => (
            <div
              key={topping.id}
              className="grid grid-cols-[1fr,auto,auto] gap-2 items-center p-2 border rounded-lg"
            >
              {editingTopping?.id === topping.id ? (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={editingTopping.name}
                    onChange={(e) => setEditingTopping(prev => ({ ...prev!, name: e.target.value }))}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingTopping.price}
                    onChange={(e) => setEditingTopping(prev => ({ ...prev!, price: Number(e.target.value) }))}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span>{topping.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(topping.price)}
                  </span>
                </div>
              )}
              
              <Switch
                checked={topping.is_active}
                onCheckedChange={(checked) => {
                  updateMutation.mutate({
                    id: topping.id,
                    data: { is_active: checked }
                  });
                }}
              />
              
              <div className="flex gap-2">
                {editingTopping?.id === topping.id ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      updateMutation.mutate({
                        id: topping.id,
                        data: {
                          name: editingTopping.name,
                          price: editingTopping.price
                        }
                      });
                    }}
                  >
                    Save
                  </Button>
                ) : (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingTopping(topping)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this topping?')) {
                          deleteMutation.mutate(topping.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodToppingManager;
