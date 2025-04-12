
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileSettingsSidebar from '@/components/profile/settings/ProfileSettingsSidebar';
import CharacteristicsSection from '@/components/profile/settings/CharacteristicsSection';
import DocumentsSection from '@/components/profile/settings/DocumentsSection';
import PersonalInfoSection from '@/components/profile/settings/PersonalInfoSection';
import NotificationsSection from '@/components/profile/settings/NotificationsSection';
import PrivacySecuritySection from '@/components/profile/settings/PrivacySecuritySection';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import FadeIn from '@/components/ui/FadeIn';

const ProfileSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('#neurodivergent');
  
  // If user is not authenticated, redirect to auth page
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Handle hash changes for section navigation
  useEffect(() => {
    const hash = location.hash || '#neurodivergent';
    setActiveSection(hash);
  }, [location.hash]);

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case '#personal':
        return <PersonalInfoSection />;
      case '#neurodivergent':
        return <CharacteristicsSection />;
      case '#documents':
        return <DocumentsSection />;
      case '#notifications':
        return <NotificationsSection />;
      case '#privacy':
        return <PrivacySecuritySection />;
      default:
        return <CharacteristicsSection />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <FadeIn>
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Settings
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile Settings</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Customize your profile by adding your neurodivergent characteristics and documents to better tailor your experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <ProfileSettingsSidebar />
              
              <div className="lg:col-span-3">
                {renderActiveSection()}
              </div>
            </div>
          </div>
        </FadeIn>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfileSettings;
