
import { FC } from 'react';
import { Bell, MessageCircle, ShoppingCart, Settings, Search } from 'lucide-react';

interface NavbarProps {
  userName: string;
  userAvatar: string;
}

const Navbar: FC<NavbarProps> = ({ userName, userAvatar }) => {
  return (
    <div className="flex items-center justify-between py-4 px-8 bg-white border-b animate-fade-in">
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search here"
          className="w-full py-2 pl-10 pr-4 text-gray-700 bg-slate-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 transition-all"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <Bell size={20} className="text-gray-500 cursor-pointer hover:text-emerald-500 transition-colors" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
        </div>
        
        <div className="relative">
          <MessageCircle size={20} className="text-gray-500 cursor-pointer hover:text-emerald-500 transition-colors" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">5</span>
        </div>
        
        <div className="relative">
          <ShoppingCart size={20} className="text-gray-500 cursor-pointer hover:text-emerald-500 transition-colors" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">2</span>
        </div>
        
        <div className="relative">
          <Settings size={20} className="text-gray-500 cursor-pointer hover:text-emerald-500 transition-colors" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">9</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Hello, {userName}</span>
          <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full border-2 border-emerald-100" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
