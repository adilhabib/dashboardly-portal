
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileData } from "@/types/profile";

interface ProfileAvatarProps {
  profileData: ProfileData | null;
  userEmail?: string;
}

const ProfileAvatar = ({ profileData, userEmail }: ProfileAvatarProps) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="h-20 w-20">
        <AvatarImage src={profileData?.avatar_url} alt={profileData?.name || userEmail} />
        <AvatarFallback className="text-xl">
          {profileData?.name?.charAt(0)?.toUpperCase() || userEmail?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-medium">{profileData?.name || userEmail}</h3>
        <p className="text-sm text-muted-foreground">
          {userEmail}
        </p>
      </div>
    </div>
  );
};

export default ProfileAvatar;
