
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Mail, Phone, MapPin } from 'lucide-react';

interface ProfileCardProps {
  customer: any;
  customerDetails: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ customer, customerDetails }) => {
  return (
    <Card className="shadow-sm mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{customer.name}</CardTitle>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit size={16} />
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
              {customer.email && (
                <div className="flex items-center gap-2 mt-2">
                  <Mail size={16} className="text-gray-400" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.phone_number && (
                <div className="flex items-center gap-2 mt-2">
                  <Phone size={16} className="text-gray-400" />
                  <span>{customer.phone_number}</span>
                </div>
              )}
            </div>
            
            {customer.address && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{customer.address}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {customerDetails?.dietary_restrictions && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Dietary Restrictions</h3>
                <p className="mt-1">{customerDetails.dietary_restrictions}</p>
              </div>
            )}
            
            {customerDetails?.preferences && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Preferences</h3>
                <p className="mt-1">{customerDetails.preferences}</p>
              </div>
            )}
            
            {customerDetails?.favorite_foods && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Favorite Foods</h3>
                <p className="mt-1">{customerDetails.favorite_foods}</p>
              </div>
            )}
            
            {customerDetails?.delivery_instructions && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Delivery Instructions</h3>
                <p className="mt-1">{customerDetails.delivery_instructions}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
