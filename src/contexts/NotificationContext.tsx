
import React, { createContext, useReducer } from 'react';
import { Notification, NotificationContextType } from '../types/notification';
import { notificationReducer, initialState } from '../reducers/notificationReducer';

// Use type import to avoid naming conflicts with browser's Notification API
import type { Notification as AppNotification } from '../types/notification';

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
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

// Re-export the hook to maintain the same import path for existing code
export { useNotificationContext } from '../hooks/useNotificationContext';
export type { Notification } from '../types/notification';
