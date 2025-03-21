
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export type Notification = {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  type: 'order' | 'system' | 'update' | 'alert';
  link?: string;
};

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
};

type NotificationAction = 
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp' | 'read'> }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' };

type NotificationContextType = {
  state: NotificationState;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
};

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0
};

// Sample initial notifications for demo purposes
const sampleNotifications: Omit<Notification, 'id' | 'timestamp' | 'read'>[] = [
  {
    title: 'New Order Received',
    description: 'Order #1234 has been placed for $45.99',
    type: 'order',
    link: '/order-detail?id=1234'
  },
  {
    title: 'Payment Successful',
    description: 'Payment for Order #1234 has been processed successfully',
    type: 'system',
    link: '/order-detail?id=1234'
  },
  {
    title: 'System Update',
    description: 'The system will undergo maintenance tonight at 11 PM',
    type: 'update'
  }
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => 
          notification.id === action.payload 
            ? { ...notification, read: true } 
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true
        })),
        unreadCount: 0
      };
    case 'REMOVE_NOTIFICATION':
      const removedNotification = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
        unreadCount: removedNotification && !removedNotification.read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      };
    default:
      return state;
  }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { toast } = useToast();

  // Add sample notifications on initial load for demo purposes
  useEffect(() => {
    // Add sample notifications with a delay to simulate real-time notifications
    const timers = sampleNotifications.map((notification, index) => {
      return setTimeout(() => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
        
        // Show toast for new notification
        toast({
          title: notification.title,
          description: notification.description,
          duration: 3000
        });
      }, 2000 * (index + 1)); // Stagger the notifications
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Show toast for new notification
    toast({
      title: notification.title,
      description: notification.description,
      duration: 3000
    });
  };

  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  };

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        state, 
        addNotification, 
        markAsRead, 
        markAllAsRead, 
        removeNotification, 
        clearAll 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
