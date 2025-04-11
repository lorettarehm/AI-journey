
import React from 'react';
import FadeIn from '@/components/ui/FadeIn';

const ProfileInsights = () => {
  return (
    <FadeIn delay={0.6}>
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold mb-4">Insights Based on Your Profile</h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          Your assessment data indicates you have strengths in creativity and pattern recognition, 
          which can be leveraged to help with task organization and time management.
        </p>
        <div className="inline-flex space-x-4">
          <a href="/techniques" className="btn-primary">
            View Recommended Techniques
          </a>
          <a href="/assessment" className="btn-secondary">
            Take Today's Assessment
          </a>
        </div>
      </div>
    </FadeIn>
  );
};

export default ProfileInsights;
