
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn, User, Settings, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AuthButton = () => {
  // Using try-catch to prevent errors when component is rendered outside AuthProvider
  try {
    const { user, signOut } = useAuth();

    if (user) {
      return (
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                <AvatarImage src={user.user_metadata?.avatar_url || undefined} alt={user.email || ''} />
                <AvatarFallback>
                  {user.email ? user.email.substring(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/notifications">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
  } catch (error) {
    // Fallback when used outside AuthContext
    return (
      <Link to="/auth">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <LogIn size={16} />
          <span className="hidden md:inline">Sign In</span>
        </Button>
      </Link>
    );
  }
};

export default AuthButton;
