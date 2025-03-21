
import { FC } from 'react';
import { Star } from 'lucide-react';
import { ReviewCardProps } from '@/types/charts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ReviewCard: FC<ReviewCardProps> = ({ 
  customerName,
  name,
  rating, 
  comment, 
  date,
  daysSince,
  foodName, 
  replied,
  image,
  foodImage
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Use customerName if available, otherwise use name
  const displayName = customerName || name || '';
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              {image && (
                <img 
                  src={image} 
                  alt={displayName} 
                  className="w-10 h-10 rounded-full mr-3" 
                />
              )}
              <div>
                <h3 className="font-medium">{displayName}</h3>
                <span className="text-gray-500 text-sm">
                  {daysSince ? `${daysSince} days ago` : (date ? formatDate(date) : '')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                />
              ))}
            </div>
            
            <p className="text-gray-700 mb-3">{comment}</p>
            
            {foodImage && (
              <div className="mb-3">
                <img 
                  src={foodImage} 
                  alt="Food" 
                  className="w-full h-32 object-cover rounded-lg" 
                />
              </div>
            )}
            
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
