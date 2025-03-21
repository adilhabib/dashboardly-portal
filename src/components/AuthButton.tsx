
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AuthButton = () => {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.user_metadata?.avatar_url || undefined} alt={user.email || ''} />
          <AvatarFallback>
            {user.email ? user.email.substring(0, 2).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="sm" onClick={signOut} className="flex items-center gap-2">
          <LogOut size={16} />
          <span className="hidden md:inline">Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <Link to="/auth">
      <Button variant="ghost" size="sm" className="flex items-center gap-2">
        <LogIn size={16} />
        <span className="hidden md:inline">Sign In</span>
      </Button>
    </Link>
  );
};

export default AuthButton;
