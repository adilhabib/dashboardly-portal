
import { FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListOrdered, 
  FileText, 
  User, 
  BarChart2, 
  MessageSquare, 
  Calendar, 
  MessageCircle, 
  Wallet,
  Pizza,
  Plus,
  Tag
} from 'lucide-react';

const Sidebar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/order-list', icon: <ListOrdered size={18} />, label: 'Order List' },
    { path: '/order-detail', icon: <FileText size={18} />, label: 'Order Detail' },
    { path: '/customer', icon: <User size={18} />, label: 'Customer' },
    { path: '/analytics', icon: <BarChart2 size={18} />, label: 'Analytics' },
    { path: '/reviews', icon: <MessageSquare size={18} />, label: 'Reviews' },
    { path: '/foods', icon: <Pizza size={18} />, label: 'Foods' },
    { path: '/categories', icon: <Tag size={18} />, label: 'Categories' },
    { path: '/food-detail', icon: <FileText size={18} />, label: 'Food Detail' },
    { path: '/customer-detail', icon: <User size={18} />, label: 'Customer Detail' },
    { path: '/calendar', icon: <Calendar size={18} />, label: 'Calendar' },
    { path: '/chat', icon: <MessageCircle size={18} />, label: 'Chat' },
    { path: '/wallet', icon: <Wallet size={18} />, label: 'Wallet' },
  ];

  const handleAddMenu = () => {
    navigate('/foods', { state: { openAddModal: true } });
  };
  
  return (
    <aside className="bg-white border-r w-[220px] h-screen flex flex-col p-5 fixed left-0 top-0 overflow-y-auto animate-slide-in-left">
      <div className="flex items-center mb-8">
        <span className="text-2xl font-bold text-gray-800">VIRGINIA<span className="text-emerald-500">.</span></span>
      </div>
      <p className="text-xs text-gray-500 mb-6">Modern Admin Dashboard</p>
      
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`sidebar-link flex items-center gap-2 p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors ${location.pathname === item.path ? 'bg-emerald-50 text-emerald-600 font-medium' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-8 bg-emerald-50 rounded-lg p-4 shadow-sm relative overflow-hidden">
        <div className="absolute bottom-0 right-0">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 70C70 55.6406 58.3594 44 44 44C29.6406 44 18 55.6406 18 70" stroke="#10B981" strokeWidth="2" />
            <path d="M44 36C50.6274 36 56 30.6274 56 24C56 17.3726 50.6274 12 44 12C37.3726 12 32 17.3726 32 24C32 30.6274 37.3726 36 44 36Z" fill="#10B981" fillOpacity="0.2" />
          </svg>
        </div>
        <p className="text-xs text-gray-700 mb-2">Please organize your menu through button below!</p>
        <button 
          onClick={handleAddMenu}
          className="bg-white text-emerald-600 text-xs py-1 px-3 rounded border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-colors duration-200 flex items-center gap-1"
        >
          <Plus size={12} />
          Add Menu
        </button>
      </div>
      
      <div className="mt-6 text-xs text-gray-500">
        <p>VIRGINIA Restaurant Admin Dashboard</p>
        <p>© 2023 All Rights Reserved</p>
        <div className="flex items-center mt-1">
          <span>Made with </span>
          <span className="text-red-500 mx-1">♥</span>
          <span> by PeterdrawD</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
