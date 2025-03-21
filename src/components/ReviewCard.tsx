
import { FC } from 'react';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  name: string;
  daysSince: number;
  comment: string;
  rating: number;
  image: string;
  foodImage: string;
}

const ReviewCard: FC<ReviewCardProps> = ({ name, daysSince, comment, rating, image, foodImage }) => {
  const stars = Array(5).fill(0);
  
  return (
    <div className="reviews-card animate-fade-in">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <img src={image} alt={name} className="review-image" />
          <div>
            <h4 className="font-medium text-gray-800">{name}</h4>
            <p className="text-xs text-gray-500">{daysSince} days ago</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{comment}</p>
        
        <div className="review-rating">
          {stars.map((_, index) => (
            <Star 
              key={index} 
              size={16} 
              fill={index < rating ? '#f59e0b' : 'none'} 
              color={index < rating ? '#f59e0b' : '#d1d5db'} 
            />
          ))}
          <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="w-24 h-24 overflow-hidden rounded-full">
        <img src={foodImage} alt="Food" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default ReviewCard;
