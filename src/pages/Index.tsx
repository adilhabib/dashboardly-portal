
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to VIRGINIA Admin Dashboard</h1>
        <p className="text-xl text-gray-600 mb-8">Your complete restaurant management solution</p>
        
        {user ? (
          <div className="space-y-4">
            <p className="text-lg">You're logged in as <span className="font-medium">{user.email}</span></p>
            <Link to="/">
              <Button size="lg" className="px-8">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg">Please sign in to access your dashboard</p>
            <Link to="/auth">
              <Button size="lg" className="px-8">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
