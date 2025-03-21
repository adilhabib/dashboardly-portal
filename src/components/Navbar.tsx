
import React, { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import AuthButton from './AuthButton';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationPanel from './NotificationPanel';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  userName: string;
  userAvatar: string;
}

const Navbar: React.FC<NavbarProps> = ({ userName, userAvatar }) => {
  const { state: notificationState } = useNotifications();
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="border-b bg-white py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 md:hidden">
        <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
          <Menu size={20} className="text-gray-600" />
        </button>
      </div>
      
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-10 pr-4 py-2 rounded-md border border-gray-200 w-full outline-none focus:border-blue-500 transition-colors"
            onFocus={() => setIsSearching(true)}
            onBlur={() => setIsSearching(false)}
          />
          {isSearching && (
            <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg mt-1 p-2 z-10">
              <div className="p-2 text-gray-500 text-sm">
                Try searching for orders, foods, or customers
              </div>
              <div className="flex flex-col gap-1">
                <Button 
                  variant="ghost" 
                  className="justify-start text-sm"
                  onClick={() => navigate('/order-list')}
                >
                  <Search size={14} className="mr-2" /> Orders
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-sm"
                  onClick={() => navigate('/foods')}
                >
                  <Search size={14} className="mr-2" /> Menu Items
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-sm"
                  onClick={() => navigate('/customer')}
                >
                  <Search size={14} className="mr-2" /> Customers
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
              <Bell size={20} className="text-gray-600" />
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
