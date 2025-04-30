
import { useState, useEffect } from 'react';
import { Banner } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import BannerCard from "@/components/banner/BannerCard";
import BannerModal from "@/components/banner/BannerModal";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageBreadcrumb from '@/components/PageBreadcrumb';

type Banner = {
  id: number;
  image_url: string;
  target_url: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

const Banners = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const queryClient = useQueryClient();

  const { data: banners, isLoading, error } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Banner[];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: "Banner deleted",
        description: "The banner has been successfully removed.",
      });
    },
    onError: (error) => {
      console.error('Error deleting banner:', error);
      toast({
        title: "Error",
        description: "Failed to delete the banner. Please try again.",
        variant: "destructive",
      });
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number, isActive: boolean }) => {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: isActive })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: "Banner updated",
        description: "Banner status has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating banner status:', error);
      toast({
        title: "Error",
        description: "Failed to update banner status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      deleteMutation.mutate(id);
    }
  };

  const toggleActive = (id: number, currentStatus: boolean) => {
    toggleActiveMutation.mutate({ id, isActive: !currentStatus });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBanner(null);
  };

  if (error) {
    console.error('Error fetching banners:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Banners</h1>
        <div className="text-red-500">Error loading banners. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <PageBreadcrumb items={[
            { label: 'Dashboard', link: '/' },
            { label: 'Banners', link: '/banners' }
          ]} />
          <h1 className="text-2xl font-bold mt-2">Banner Management</h1>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center gap-2"
        >
          <Banner size={16} />
          Add New Banner
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-48 w-full rounded-md mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners && banners.length > 0 ? (
            banners.map((banner) => (
              <BannerCard 
                key={banner.id}
                banner={banner}
                onEdit={() => handleEdit(banner)}
                onDelete={() => handleDelete(banner.id)}
                onToggleActive={() => toggleActive(banner.id, banner.is_active)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
              <Banner size={48} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Banners Found</h3>
              <p className="text-gray-500 mb-4 text-center">Start by creating a new promotional banner.</p>
              <Button onClick={() => setIsModalOpen(true)}>Add First Banner</Button>
            </div>
          )}
        </div>
      )}

      <BannerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        banner={selectedBanner}
      />
    </div>
  );
};

export default Banners;
