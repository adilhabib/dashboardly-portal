
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackButton: React.FC = () => {
  return (
    <div className="mb-6">
      <Link to="/foods">
        <Button variant="ghost" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Foods
        </Button>
      </Link>
    </div>
  );
};

export default BackButton;
