
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
  scheduled_for: string | null;
  sent_at: string | null;
  send_status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  last_error: string | null;
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
    scheduled_for: string | null;
    sent_at?: string | null;
    send_status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    last_error?: string | null;
  } | null;
  onPushSent?: (notification: MarketingNotification) => Promise<{
    sent: number;
    failed: number;
    image_warning?: string;
    image_dropped_for?: number;
    errors?: string[];
  }>;
}

const MarketingNotificationModal: FC<MarketingNotificationModalProps> = ({ isOpen, onClose, notification, onPushSent }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledFor, setScheduledFor] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sendPushOnCreate, setSendPushOnCreate] = useState(true);
  const queryClient = useQueryClient();

  const toLocalDateTimeInputValue = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  useEffect(() => {
    if (notification) {
      setTitle(notification.title);
      setMessage(notification.message);
      setImageUrl(notification.image_url || '');
      setIsActive(notification.is_active ?? true);
      setIsScheduled(Boolean(notification.scheduled_for));
      setScheduledFor(notification.scheduled_for ? toLocalDateTimeInputValue(notification.scheduled_for) : '');
      setSendPushOnCreate(false);
    } else {
      setTitle('');
      setMessage('');
      setImageUrl('');
      setIsScheduled(false);
      setScheduledFor('');
      setIsActive(true);
      setSendPushOnCreate(true);
    }
  }, [notification, isOpen]);

  const saveMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      message: string;
      image_url?: string;
      is_active: boolean;
      scheduled_for?: string | null;
      send_status: 'draft' | 'scheduled';
      sent_at: null;
      last_error: null;
    }) => {
      if (notification) {
        const { error } = await supabase
          .from('marketing_notifications')
          .update({
            title: data.title,
            message: data.message,
            image_url: data.image_url || null,
            is_active: data.is_active,
            scheduled_for: data.scheduled_for ?? null,
            send_status: data.send_status,
            sent_at: data.sent_at,
            last_error: data.last_error,
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
            scheduled_for: data.scheduled_for ?? null,
            send_status: data.send_status,
            sent_at: data.sent_at,
            last_error: data.last_error,
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
      if (action === 'created' && record && sendPushOnCreate && !isScheduled && onPushSent) {
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

    if (isScheduled && !scheduledFor) {
      toast({ title: "Validation error", description: "Please select a schedule date and time.", variant: "destructive" });
      return;
    }

    const scheduleIso = isScheduled && scheduledFor ? new Date(scheduledFor).toISOString() : null;
    if (isScheduled && scheduleIso && new Date(scheduleIso).getTime() <= Date.now()) {
      toast({ title: "Validation error", description: "Scheduled time must be in the future.", variant: "destructive" });
      return;
    }

    saveMutation.mutate({
      title,
      message,
      image_url: imageUrl || undefined,
      is_active: isActive,
      scheduled_for: scheduleIso,
      send_status: isScheduled ? 'scheduled' : 'draft',
      sent_at: null,
      last_error: null,
    });
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

          <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
            <div>
              <Label htmlFor="schedule_toggle" className="text-sm font-medium">Schedule notification</Label>
              <p className="text-xs text-muted-foreground">Send later at a specific date and time</p>
            </div>
            <Switch id="schedule_toggle" checked={isScheduled} onCheckedChange={setIsScheduled} />
          </div>

          {isScheduled && (
            <div className="space-y-2">
              <Label htmlFor="scheduled_for">Scheduled date & time</Label>
              <Input
                id="scheduled_for"
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
              />
            </div>
          )}

          {imageUrl && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-md border bg-muted">
              <img src={imageUrl} alt="Preview" className="object-cover w-full h-full" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Invalid+URL'; }} />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="notif_active">Active</Label>
            <Switch id="notif_active" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {isCreating && !isScheduled && (
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
                ? (isCreating && sendPushOnCreate && !isScheduled ? 'Creating & Sending...' : 'Saving...')
                : (notification ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MarketingNotificationModal;
