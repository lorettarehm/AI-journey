
import React from 'react';
import { Settings } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ProfileHeader = () => {
  return (
    <FadeIn>
      <div className="flex flex-col md:flex-row justify-between items-start mb-12">
        <div>
          <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Your Profile
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile Overview</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore your neurodivergent strengths and patterns based on your assessments.
          </p>
        </div>
        <Link to="/profile/settings">
          <Button className="mt-6 md:mt-0 flex items-center">
            <Settings size={16} className="mr-2" />
            Profile Settings
          </Button>
        </Link>
      </div>
    </FadeIn>
  );
};

export default ProfileHeader;
