
import React from 'react';
import { Settings } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ProfileHeader = () => {
  return (
    <FadeIn>
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-8 md:mb-12">
        <div className="text-center md:text-left">
          <span className="inline-block bg-accent/10 text-accent px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
            Your Profile
          </span>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Profile Overview</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Explore your neurodivergent strengths and patterns based on your assessments.
          </p>
        </div>
        <Link to="/profile/settings">
          <Button className="flex items-center">
            <Settings size={16} className="mr-2" />
            Profile Settings
          </Button>
        </Link>
      </div>
    </FadeIn>
  );
};

export default ProfileHeader;
