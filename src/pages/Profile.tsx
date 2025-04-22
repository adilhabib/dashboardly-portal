
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileForm from "@/components/profile/ProfileForm";
import { useProfileData } from "@/hooks/useProfileData";

const Profile = () => {
  const { user } = useAuth();
  const { profileData, isLoading } = useProfileData(user?.id, user?.email);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 ml-[220px]">
        <div className="max-w-3xl mx-auto">
          <ProfileHeader />
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileAvatar profileData={profileData} userEmail={user?.email} />
                {user && <ProfileForm 
                  initialData={profileData} 
                  userId={user.id}
                  userEmail={user.email || ''}
                />}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
