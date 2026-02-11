
import { useState } from 'react';
import { Megaphone, Plus, Trash2, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import MarketingNotificationModal from '@/components/marketing/MarketingNotificationModal';
import { formatDistanceToNow } from 'date-fns';

type MarketingNotification = {
  id: string;
  title: string;
  message: string;
  image_url: string | null;
  is_active: boolean | null;
  created_at: string;
};

const MarketingNotifications = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<MarketingNotification | null>(null);
  const queryClient = useQueryClient();

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['marketing-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_notifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as MarketingNotification[];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('marketing_notifications').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-notifications'] });
      toast({ title: "Notification deleted", description: "The notification has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete notification.", variant: "destructive" });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('marketing_notifications')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-notifications'] });
      toast({ title: "Status updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  });

  const handleEdit = (n: MarketingNotification) => {
    setSelected(n);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this notification?")) {
      deleteMutation.mutate(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Marketing Notifications</h1>
        <div className="text-red-500">Error loading notifications.</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <PageBreadcrumb pageName="Marketing Notifications" />
          <h1 className="text-2xl font-bold mt-2">Promotional Notifications</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={16} />
          New Notification
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.map((n) => (
            <Card key={n.id} className="overflow-hidden transition-all hover:shadow-md">
              {n.image_url && (
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <img
                    src={n.image_url}
                    alt={n.title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Image+Not+Found';
                    }}
                  />
                </div>
              )}
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Megaphone size={16} className="text-muted-foreground" />
                  <h3 className="font-semibold text-base truncate">{n.title}</h3>
                  <Badge variant={n.is_active ? "default" : "outline"} className="ml-auto text-xs">
                    {n.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{n.message}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0 pb-2">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(n)}>
                    <Edit size={14} className="mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(n.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={14} className="mr-1" /> Delete
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleMutation.mutate({ id: n.id, is_active: !n.is_active })}
                  title={n.is_active ? "Deactivate" : "Activate"}
                >
                  {n.is_active ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} />}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
          <Megaphone size={48} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Notifications</h3>
          <p className="text-gray-500 mb-4">Create a promotional notification to send to your users.</p>
          <Button onClick={() => setIsModalOpen(true)}>Create First Notification</Button>
        </div>
      )}

      <MarketingNotificationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        notification={selected}
      />
    </div>
  );
};

export default MarketingNotifications;
