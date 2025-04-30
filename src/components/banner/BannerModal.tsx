import { FC, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { ImageIcon } from 'lucide-react';

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: {
    id: number;
    image_url: string;
    target_url: string | null;
    is_active: boolean;
  } | null;
}

const BannerModal: FC<BannerModalProps> = ({ isOpen, onClose, banner }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (banner) {
      setImageUrl(banner.image_url || '');
      setTargetUrl(banner.target_url || '');
      setIsActive(banner.is_active || false);
    } else {
      setImageUrl('');
      setTargetUrl('');
      setIsActive(true);
    }
  }, [banner, isOpen]);

  const saveBannerMutation = useMutation({
    mutationFn: async (formData: { 
      image_url: string; 
      target_url?: string; 
      is_active: boolean;
    }) => {
      if (banner) {
        // Update existing banner
        const { error } = await supabase
          .from('banners')
          .update({
            image_url: formData.image_url,
            target_url: formData.target_url || null,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', banner.id);
        
        if (error) throw error;
        return 'updated';
      } else {
        // Create new banner
        const { error } = await supabase
          .from('banners')
          .insert({
            image_url: formData.image_url,
            target_url: formData.target_url || null,
            is_active: formData.is_active
          });
        
        if (error) throw error;
        return 'created';
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: `Banner ${result}`,
        description: `The banner was successfully ${result}.`,
      });
      onClose();
    },
    onError: (error) => {
      console.error('Error saving banner:', error);
      toast({
        title: "Error",
        description: "Failed to save the banner. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl.trim()) {
      toast({
        title: "Validation error",
        description: "Image URL is required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    saveBannerMutation.mutate({
      image_url: imageUrl,
      target_url: targetUrl || undefined,
      is_active: isActive
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {banner ? 'Edit Banner' : 'Add New Banner'}
          </DialogTitle>
          <DialogDescription>
            {banner ? 'Update the details of your promotional banner.' : 'Create a new promotional banner for your site.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-right">
              Image URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="image_url"
              placeholder="https://example.com/banner.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>
          
          {imageUrl && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-md border bg-gray-100">
              <img 
                src={imageUrl} 
                alt="Banner preview" 
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/640x360?text=Invalid+Image+URL';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-white underline">
                  View full image
                </a>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="target_url" className="text-right">
              Target URL
            </Label>
            <Input
              id="target_url"
              placeholder="https://example.com/promotion"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active" className="text-right">
              Active
            </Label>
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !imageUrl.trim()}>
              {isLoading ? 'Saving...' : (banner ? 'Update Banner' : 'Create Banner')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BannerModal;
