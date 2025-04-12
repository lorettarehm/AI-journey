
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Import our new components
import AvatarUpload from './personal-info/AvatarUpload';
import ProfileInfo from './personal-info/ProfileInfo';
import ProfileForm from './personal-info/ProfileForm';
import LoadingSkeleton from './personal-info/LoadingSkeleton';
import { useProfile } from './personal-info/useProfile';

const PersonalInfoSection = () => {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and how you appear on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
              <AvatarUpload 
                avatarUrl={profile?.avatar_url} 
                fullName={profile?.full_name} 
                email={profile?.email} 
              />
              <ProfileInfo 
                fullName={profile?.full_name} 
                email={profile?.email} 
              />
            </div>
            
            <ProfileForm 
              fullName={profile?.full_name} 
              email={profile?.email} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoSection;
