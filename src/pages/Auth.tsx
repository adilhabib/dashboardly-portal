
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [email, setEmail] = useState('test@test.com'); // Pre-filled for testing
  const [password, setPassword] = useState('123456789'); // Pre-filled for testing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const [adminError, setAdminError] = useState('');
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const checkIsAdmin = async (userId: string) => {
    try {
      setIsCheckingAdmin(true);
      // Call the has_role function
      const { data, error } = await supabase.rpc('has_role', {
        requested_role: 'admin'
      }) as { data: boolean | null, error: Error | null };

      if (error) throw error;
      
      return !!data;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setAdminError('');
    
    try {
      const { error, data } = await signIn(email, password);
      if (error) throw error;
      
      // Check if user is an admin
      const userId = data?.user?.id;
      if (userId) {
        const isAdmin = await checkIsAdmin(userId);
        if (!isAdmin) {
          // Sign out the user if they're not an admin
          await supabase.auth.signOut();
          setAdminError('This admin panel is restricted to administrators only.');
          return;
        }
      }
      
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notice",
      description: "Sign-up is disabled in the admin panel. Please contact your administrator.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Dashboard</CardTitle>
          <CardDescription className="text-center">
            Sign in to manage your restaurant
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="signin">Admin Sign In</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            {adminError && (
              <Alert variant="destructive" className="mb-4 mx-4">
                <AlertDescription>{adminError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting || isCheckingAdmin}>
                  {(isSubmitting || isCheckingAdmin) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
