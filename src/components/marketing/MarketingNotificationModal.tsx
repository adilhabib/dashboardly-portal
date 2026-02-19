
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

type MarketingNotification = {
  id: string;
  title: string;
  message: string;
  image_url: string | null;
  is_active: boolean | null;
  created_at: string;
};

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
  onPushSent?: (notification: MarketingNotification) => Promise<{ sent: number; failed: number }>;
}

const MarketingNotificationModal: FC<MarketingNotificationModalProps> = ({ isOpen, onClose, notification, onPushSent }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sendPushOnCreate, setSendPushOnCreate] = useState(true);
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
      setSendPushOnCreate(true);
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
        return { action: 'updated', record: null };
      } else {
        const { data: created, error } = await supabase
          .from('marketing_notifications')
          .insert({
            title: data.title,
            message: data.message,
            image_url: data.image_url || null,
            is_active: data.is_active,
          })
          .select()
          .single();
        if (error) throw error;
        return { action: 'created', record: created as MarketingNotification };
      }
    },
    onSuccess: async ({ action, record }) => {
      queryClient.invalidateQueries({ queryKey: ['marketing-notifications'] });
      toast({ title: `Notification ${action}`, description: `Successfully ${action}.` });

      // Auto-send push notification after creation if enabled
      if (action === 'created' && record && sendPushOnCreate && onPushSent) {
        try {
          const result = await onPushSent(record);
          toast({
            title: "Push notification sent!",
            description: `Delivered to ${result.sent} device${result.sent !== 1 ? 's' : ''}${result.failed > 0 ? `, ${result.failed} failed` : ''}.`,
          });
        } catch {
          toast({
            title: "Push send failed",
            description: "Notification saved but push could not be sent. Use 'Send Push' manually.",
            variant: "destructive",
          });
        }
      }

      onClose();
    },
    onError: (error) => {
      console.error("Supabase Save Error:", error);
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

  const isCreating = !notification;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            {notification ? 'Edit Notification' : 'New Promotional Notification'}
          </DialogTitle>
          <DialogDescription>
            {notification
              ? 'Update the notification details.'
              : 'Create a notification that will be pushed to all registered devices.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="notif_title">Title <span className="text-destructive">*</span></Label>
            <Input id="notif_title" placeholder="e.g. 50% Off This Weekend!" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notif_message">Message <span className="text-destructive">*</span></Label>
            <Textarea id="notif_message" placeholder="Describe your promotion..." value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notif_image">Image URL (optional)</Label>
            <Input id="notif_image" placeholder="https://example.com/promo.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>

          {imageUrl && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-md border bg-muted">
              <img src={imageUrl} alt="Preview" className="object-cover w-full h-full" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Invalid+URL'; }} />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="notif_active">Active</Label>
            <Switch id="notif_active" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {isCreating && (
            <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
              <div>
                <Label htmlFor="send_push" className="text-sm font-medium">Send push immediately</Label>
                <p className="text-xs text-muted-foreground">Push to all registered devices on create</p>
              </div>
              <Switch id="send_push" checked={sendPushOnCreate} onCheckedChange={setSendPushOnCreate} />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saveMutation.isPending || !title.trim() || !message.trim()}>
              {saveMutation.isPending
                ? (isCreating && sendPushOnCreate ? 'Creating & Sending…' : 'Saving…')
                : (notification ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MarketingNotificationModal;
