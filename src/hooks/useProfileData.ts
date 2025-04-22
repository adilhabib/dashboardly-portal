
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";

export const useProfileData = (userId: string | undefined, userEmail: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError && profileError.code !== 'PGSQL_ERROR_NODATA') {
          throw profileError;
        }

        const { data: customerData, error: customerError } = await supabase
          .from('customer')
          .select('*')
          .eq('id', userId)
          .single();

        if (customerError && customerError.code !== 'PGSQL_ERROR_NODATA') {
          throw customerError;
        }

        const combinedData: ProfileData = {
          ...profileData,
          ...customerData,
          email: userEmail,
          bio: profileData?.bio || "",
        };

        setProfileData(combinedData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, userEmail, toast]);

  return { profileData, isLoading };
};
