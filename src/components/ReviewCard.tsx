
import { FC } from 'react';
import { Star } from 'lucide-react';
import { ReviewCardProps } from '@/types/charts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ReviewCard: FC<ReviewCardProps> = ({ 
  customerName, 
  rating, 
  comment, 
  date, 
  foodName, 
  replied 
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-2">
              <h3 className="font-medium">{customerName}</h3>
              <span className="text-gray-500 text-sm ml-2">{formatDate(date)}</span>
            </div>
            
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                />
              ))}
            </div>
            
            <p className="text-gray-700 mb-2">{comment}</p>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {foodName}
              </Badge>
              
              {replied ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Replied
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  Awaiting Reply
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
