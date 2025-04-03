
import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  ShoppingBag, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  RefreshCw, 
  X,
  EyeOff
} from 'lucide-react';
import { Notification, useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from "@/components/ui/alert";

const NotificationPanel: React.FC = () => {
  const { state, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
  const navigate = useNavigate();
  const [showLatestAlert, setShowLatestAlert] = useState(false);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  // Get notifications sorted by timestamp (newest first)
  const sortedNotifications = [...state.notifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  // Effect to show alert for latest notification
  useEffect(() => {
    if (sortedNotifications.length > 0 && !sortedNotifications[0].read) {
      setLatestNotification(sortedNotifications[0]);
      setShowLatestAlert(true);
      
      const timer = setTimeout(() => {
        setShowLatestAlert(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [sortedNotifications]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'update':
        return <RefreshCw className="h-5 w-5 text-green-500" />;
      case 'system':
        return <Info className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    
    return diffInDays < 7 
      ? `${diffInDays}d ago` 
      : date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="w-80 max-h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex gap-2">
          {state.unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead} 
              className="h-8 text-xs"
            >
              <EyeOff className="h-3.5 w-3.5 mr-1" />
              Mark all as read
            </Button>
          )}
          {state.notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAll}
              className="h-8 text-xs text-destructive hover:text-destructive/90"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>
      
      {showLatestAlert && latestNotification && (
        <Alert className="m-2 bg-primary/10 border-primary">
          <div className="flex items-start gap-2">
            {getIcon(latestNotification.type)}
            <AlertDescription className="text-xs">
              <span className="font-semibold block">{latestNotification.title}</span>
              {latestNotification.description}
            </AlertDescription>
          </div>
        </Alert>
      )}
      
      <div className="overflow-y-auto flex-1">
        {sortedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
            <Bell className="h-10 w-10 mb-2 text-muted-foreground/50" />
            <p>No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <ul>
            {sortedNotifications.map((notification) => (
              <li 
                key={notification.id} 
                className={cn(
                  "flex gap-3 p-3 border-b hover:bg-muted/50 cursor-pointer relative group",
                  !notification.read && "bg-muted/20"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className={cn(
                      "text-sm font-medium truncate", 
                      !notification.read && "font-semibold"
                    )}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.description}
                  </p>
                  
                  {!notification.read && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary"></span>
                  )}
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {state.notifications.length > 0 && (
        <div className="p-3 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate('/notifications')}
          >
            View all notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
