
import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import AuthButton from './AuthButton';

interface NavbarProps {
  userName: string;
  userAvatar: string;
}

const Navbar: React.FC<NavbarProps> = ({ userName, userAvatar }) => {
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
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>
        
        <AuthButton />
      </div>
    </div>
  );
};

export default Navbar;
