
import { FC, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Megaphone } from 'lucide-react';

interface MarketingNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: {
    id: string;
    title: string;
    message: string;
    image_url: string | null;
    is_active: boolean | null;
  } | null;
}

const MarketingNotificationModal: FC<MarketingNotificationModalProps> = ({ isOpen, onClose, notification }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (notification) {
      setTitle(notification.title);
      setMessage(notification.message);
      setImageUrl(notification.image_url || '');
      setIsActive(notification.is_active ?? true);
    } else {
      setTitle('');
      setMessage('');
      setImageUrl('');
      setIsActive(true);
    }
  }, [notification, isOpen]);

  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; message: string; image_url?: string; is_active: boolean }) => {
      if (notification) {
        const { error } = await supabase
          .from('marketing_notifications')
          .update({
            title: data.title,
            message: data.message,
            image_url: data.image_url || null,
            is_active: data.is_active,
          })
          .eq('id', notification.id);
        if (error) throw error;
        return 'updated';
      } else {
        const { error } = await supabase
          .from('marketing_notifications')
          .insert({
            title: data.title,
            message: data.message,
            image_url: data.image_url || null,
            is_active: data.is_active,
          });
        if (error) throw error;
        return 'created';
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['marketing-notifications'] });
      toast({ title: `Notification ${result}`, description: `Successfully ${result}.` });
      onClose();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save notification.", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast({ title: "Validation error", description: "Title and message are required.", variant: "destructive" });
      return;
    }
    saveMutation.mutate({ title, message, image_url: imageUrl || undefined, is_active: isActive });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            {notification ? 'Edit Notification' : 'New Promotional Notification'}
          </DialogTitle>
          <DialogDescription>
            {notification ? 'Update the notification details.' : 'Create a notification that will be shown to app users.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="notif_title">Title <span className="text-red-500">*</span></Label>
            <Input id="notif_title" placeholder="e.g. 50% Off This Weekend!" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notif_message">Message <span className="text-red-500">*</span></Label>
            <Textarea id="notif_message" placeholder="Describe your promotion..." value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notif_image">Image URL (optional)</Label>
            <Input id="notif_image" placeholder="https://example.com/promo.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>

          {imageUrl && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-md border bg-gray-100">
              <img src={imageUrl} alt="Preview" className="object-cover w-full h-full" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Invalid+URL'; }} />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="notif_active">Active</Label>
            <Switch id="notif_active" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saveMutation.isPending || !title.trim() || !message.trim()}>
              {saveMutation.isPending ? 'Saving...' : (notification ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MarketingNotificationModal;
