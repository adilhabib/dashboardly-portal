
import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  Bell, 
  ShoppingBag, 
  AlertCircle, 
  Info, 
  RefreshCw,
  CheckCircle,
  Trash2,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Notifications: React.FC = () => {
  const { state, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
  const navigate = useNavigate();

  // Get notifications sorted by timestamp (newest first)
  const sortedNotifications = [...state.notifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  const getIcon = (type: string) => {
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

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 ml-[220px]">
        <Navbar 
          userName="Samantha" 
          userAvatar="https://randomuser.me/api/portraits/women/65.jpg" 
        />
        
        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h1>
              <p className="text-gray-500">View and manage all your notifications</p>
            </div>
            
            <div className="flex gap-2">
              {state.unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={markAllAsRead}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              )}
              {state.notifications.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearAll}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear all
                </Button>
              )}
            </div>
          </div>
          
          <Card className="p-6">
            {sortedNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Bell className="h-16 w-16 mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-medium mb-2">No notifications</h3>
                <p>You're all caught up! Check back later for new notifications.</p>
              </div>
            ) : (
              <div className="divide-y">
                {sortedNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={cn(
                      "flex gap-4 py-4 hover:bg-muted/50 cursor-pointer relative group px-4 -mx-4 rounded-md",
                      !notification.read && "bg-muted/20"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          "text-base font-medium", 
                          !notification.read && "font-semibold"
                        )}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      
                      {!notification.read && (
                        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary"></span>
                      )}
                      
                      <div className="flex mt-2 gap-2">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Mark as read
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 text-xs text-destructive hover:text-destructive/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
