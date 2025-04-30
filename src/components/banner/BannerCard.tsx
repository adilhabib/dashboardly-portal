
import { FC } from 'react';
import { ExternalLink, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface Banner {
  id: number;
  image_url: string;
  target_url: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

interface BannerCardProps {
  banner: Banner;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

const BannerCard: FC<BannerCardProps> = ({ banner, onEdit, onDelete, onToggleActive }) => {
  const updatedTimeAgo = banner.updated_at ? 
    formatDistanceToNow(new Date(banner.updated_at), { addSuffix: true }) : 
    'unknown time';

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        <img 
          src={banner.image_url} 
          alt="Banner"
          className="object-cover w-full h-full transition-transform hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/640x360?text=Image+Not+Found';
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge variant={banner.is_active ? "default" : "outline"} className="font-medium">
            {banner.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      <CardContent className="pt-4">
        {banner.target_url && (
          <div className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2 truncate">
            <ExternalLink size={14} className="mr-1" />
            <a href={banner.target_url} target="_blank" rel="noopener noreferrer" className="truncate">
              {banner.target_url}
            </a>
          </div>
        )}
        <p className="text-xs text-gray-500">
          Updated {updatedTimeAgo}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between pt-0 pb-2">
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit size={14} className="mr-1" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-700">
            <Trash2 size={14} className="mr-1" /> Delete
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleActive} 
          title={banner.is_active ? "Deactivate banner" : "Activate banner"}
        >
          {banner.is_active ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BannerCard;
