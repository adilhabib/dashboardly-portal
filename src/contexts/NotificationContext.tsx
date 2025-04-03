
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { BellRing } from 'lucide-react';

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

  // Setup real-time notifications listening for orders
  useEffect(() => {
    console.log('Setting up real-time notifications for orders table');
    
    // Subscribe to real-time changes on the orders table
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          
          // Extract basic order details for display
          const newRecord = payload.new as Record<string, any> | null;
          const oldRecord = payload.old as Record<string, any> | null;
          
          // Safely access the ID
          const orderId = newRecord?.id || oldRecord?.id;
          const orderIdDisplay = orderId ? String(orderId).slice(0, 8) : 'Unknown';
          
          if (payload.eventType === 'INSERT') {
            dispatch({
              type: 'ADD_NOTIFICATION',
              payload: {
                title: 'New Order Received',
                description: `Order #${orderIdDisplay} has been placed.`,
                type: 'order',
                link: `/order-detail?id=${orderId}`
              }
            });
            
            toast({
              title: 'New Order Received',
              description: `Order #${orderIdDisplay} has been placed.`,
              duration: 5000,
            });
          } else if (payload.eventType === 'UPDATE') {
            dispatch({
              type: 'ADD_NOTIFICATION',
              payload: {
                title: 'Order Updated',
                description: `Order #${orderIdDisplay} has been updated to "${newRecord?.status || 'unknown status'}".`,
                type: 'update',
                link: `/order-detail?id=${orderId}`
              }
            });
            
            toast({
              title: 'Order Updated',
              description: `Order #${orderIdDisplay} status: ${newRecord?.status || 'unknown'}`,
              duration: 5000,
            });
          } else if (payload.eventType === 'DELETE') {
            dispatch({
              type: 'ADD_NOTIFICATION',
              payload: {
                title: 'Order Deleted',
                description: `Order #${orderIdDisplay} has been removed.`,
                type: 'alert'
              }
            });
            
            toast({
              title: 'Order Deleted',
              description: `Order #${orderIdDisplay} has been removed from the system.`,
              duration: 5000,
            });
          }
        })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    console.log('Subscribed to real-time updates for orders table');

    // Also subscribe to customer table changes
    const customerChannel = supabase
      .channel('public:customer')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'customer' }, 
        (payload) => {
          console.log('Customer real-time update received:', payload);
          
          // Extract customer details for display
          const newRecord = payload.new as Record<string, any> | null;
          const oldRecord = payload.old as Record<string, any> | null;
          
          // Safely access the name
          const customerName = newRecord?.name || oldRecord?.name || 'Unknown customer';
          const customerId = newRecord?.id || oldRecord?.id;
          
          if (payload.eventType === 'INSERT') {
            dispatch({
              type: 'ADD_NOTIFICATION',
              payload: {
                title: 'New Customer Registered',
                description: `${customerName} has just registered.`,
                type: 'system',
                link: customerId ? `/customer-detail?id=${customerId}` : undefined
              }
            });
            
            toast({
              title: 'New Customer',
              description: `${customerName} has joined.`,
              duration: 5000,
            });
          } else if (payload.eventType === 'UPDATE') {
            dispatch({
              type: 'ADD_NOTIFICATION',
              payload: {
                title: 'Customer Profile Updated',
                description: `${customerName}'s profile has been updated.`,
                type: 'update',
                link: customerId ? `/customer-detail?id=${customerId}` : undefined
              }
            });
          }
        })
      .subscribe();

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

    // Clean up subscriptions when component unmounts
    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(channel);
      supabase.removeChannel(customerChannel);
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
