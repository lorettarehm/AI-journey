
import React from 'react';

interface ProfileInfoProps {
  fullName: string | null;
  email: string | null;
}

const ProfileInfo = ({ fullName, email }: ProfileInfoProps) => {
  return (
    <div>
      <h3 className="font-medium text-lg mb-1">{fullName || 'User'}</h3>
      <p className="text-sm text-muted-foreground">{email}</p>
      <p className="text-xs text-muted-foreground mt-2">
        Click on the camera icon to upload a new profile picture
      </p>
    </div>
  );
};

export default ProfileInfo;
