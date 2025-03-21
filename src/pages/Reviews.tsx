
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ReviewCard from '@/components/ReviewCard';
import { Search } from 'lucide-react';
import PageBreadcrumb from '@/components/PageBreadcrumb';

// Dummy review data - in a real app this would come from the database
const dummyReviews = [
  {
    id: '1',
    customerName: 'John Doe',
    rating: 5,
    comment: 'Amazing food and super fast delivery! The pasta was cooked perfectly and the sauce was delicious. Will definitely order again.',
    createdAt: '2023-11-15T14:23:45Z',
    foodName: 'Spaghetti Carbonara',
    replied: true,
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    rating: 4,
    comment: 'Food was great but delivery took a bit longer than expected. The flavors were amazing though!',
    createdAt: '2023-11-14T16:45:12Z',
    foodName: 'Margherita Pizza',
    replied: false,
  },
  {
    id: '3',
    customerName: 'Michael Johnson',
    rating: 3,
    comment: 'The food was okay, nothing special. Portions could be bigger for the price.',
    createdAt: '2023-11-13T09:12:34Z',
    foodName: 'Caesar Salad',
    replied: false,
  },
  {
    id: '4',
    customerName: 'Emily Williams',
    rating: 5,
    comment: 'Best burger I\'ve ever had! The meat was juicy and the fries were crispy. Excellent service too!',
    createdAt: '2023-11-12T20:34:56Z',
    foodName: 'Classic Cheeseburger',
    replied: true,
  },
  {
    id: '5',
    customerName: 'David Brown',
    rating: 2,
    comment: 'The food arrived cold and the order was incomplete. Very disappointed with this experience.',
    createdAt: '2023-11-11T18:23:10Z',
    foodName: 'Vegetable Curry',
    replied: true,
  },
  {
    id: '6',
    customerName: 'Sarah Miller',
    rating: 4,
    comment: 'Delicious food and generous portions! The only reason I\'m not giving 5 stars is because they forgot the extra sauce I requested.',
    createdAt: '2023-11-10T12:45:22Z',
    foodName: 'BBQ Chicken Wings',
    replied: false,
  },
];

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredReviews = dummyReviews.filter(review => {
    const matchesSearch = 
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.foodName.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'high' && review.rating >= 4) return matchesSearch;
    if (activeTab === 'medium' && review.rating === 3) return matchesSearch;
    if (activeTab === 'low' && review.rating <= 2) return matchesSearch;
    if (activeTab === 'unreplied' && !review.replied) return matchesSearch;
    
    return false;
  });
  
  const getRatingStats = () => {
    const totalReviews = dummyReviews.length;
    const totalRating = dummyReviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / totalReviews;
    
    const ratingCounts = {
      5: dummyReviews.filter(r => r.rating === 5).length,
      4: dummyReviews.filter(r => r.rating === 4).length,
      3: dummyReviews.filter(r => r.rating === 3).length,
      2: dummyReviews.filter(r => r.rating === 2).length,
      1: dummyReviews.filter(r => r.rating === 1).length,
    };
    
    return { totalReviews, avgRating, ratingCounts };
  };
  
  const stats = getRatingStats();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <PageBreadcrumb pageName="Reviews" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customer Reviews</h1>
        <p className="text-gray-500">Manage and respond to customer feedback</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>All Reviews</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reviews..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="high">High Rating (4-5)</TabsTrigger>
                <TabsTrigger value="medium">Medium Rating (3)</TabsTrigger>
                <TabsTrigger value="low">Low Rating (1-2)</TabsTrigger>
                <TabsTrigger value="unreplied">Unreplied</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {filteredReviews.length > 0 ? (
                  <div className="space-y-4">
                    {filteredReviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        customerName={review.customerName}
                        rating={review.rating}
                        comment={review.comment}
                        date={new Date(review.createdAt)}
                        foodName={review.foodName}
                        replied={review.replied}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No reviews found matching your criteria</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Review Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500">Average Rating</p>
              <div className="flex items-center justify-center my-2">
                <div className="text-4xl font-bold mr-2">{stats.avgRating.toFixed(1)}</div>
                <div className="text-amber-500 text-2xl">★</div>
              </div>
              <p className="text-sm text-gray-500">Based on {stats.totalReviews} reviews</p>
            </div>
            
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const percentage = (stats.ratingCounts[rating as keyof typeof stats.ratingCounts] / stats.totalReviews) * 100;
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="flex items-center w-8">
                      <span className="font-medium">{rating}</span>
                      <span className="text-amber-500 ml-1">★</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 w-10 text-right">
                      {stats.ratingCounts[rating as keyof typeof stats.ratingCounts]}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6">
              <Button className="w-full">Generate Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reviews;
