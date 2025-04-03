
import React, { useState, useEffect } from 'react';
import { Bell, BellRing } from 'lucide-react';
import AuthButton from './AuthButton';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationPanel from './NotificationPanel';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface NavbarProps {
  userName: string;
  userAvatar: string;
}

const Navbar: React.FC<NavbarProps> = ({ userName, userAvatar }) => {
  const { state: notificationState } = useNotifications();
  const [isRinging, setIsRinging] = useState(false);
  const [prevUnreadCount, setPrevUnreadCount] = useState(0);

  // Effect to trigger bell animation when new notifications arrive
  useEffect(() => {
    if (notificationState.unreadCount > prevUnreadCount) {
      setIsRinging(true);
      
      // Reset animation after a delay
      const timer = setTimeout(() => {
        setIsRinging(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    setPrevUnreadCount(notificationState.unreadCount);
  }, [notificationState.unreadCount, prevUnreadCount]);

  return (
    <div className="border-b bg-white py-4 px-6 flex items-center justify-between">
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
              {isRinging ? (
                <BellRing size={20} className={cn(
                  "text-gray-600",
                  isRinging && "animate-ring"
                )} />
              ) : (
                <Bell size={20} className="text-gray-600" />
              )}
              {notificationState.unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center">
                  {notificationState.unreadCount > 9 ? '9+' : notificationState.unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="p-0 w-80">
            <NotificationPanel />
          </PopoverContent>
        </Popover>
        
        <AuthButton />
      </div>
    </div>
  );
};

export default Navbar;
