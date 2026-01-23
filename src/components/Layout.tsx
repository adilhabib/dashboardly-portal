
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden on mobile unless open */}
      <div className={`
        ${isMobile ? 'fixed z-50 transition-transform duration-300' : ''}
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} isMobile={isMobile} />
      </div>
      
      <div className={`flex-1 ${isMobile ? 'ml-0' : 'ml-[220px]'}`}>
        <Navbar 
          userName="Samantha" 
          userAvatar="https://randomuser.me/api/portraits/women/65.jpg"
        >
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </Button>
          )}
        </Navbar>
        
        <main className={`${isMobile ? 'p-3' : 'p-6'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
