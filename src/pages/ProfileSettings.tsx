
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileSettingsSidebar from '@/components/profile/settings/ProfileSettingsSidebar';
import CharacteristicsSection from '@/components/profile/settings/CharacteristicsSection';
import DocumentsSection from '@/components/profile/settings/DocumentsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { FileStack, BookMarked, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is not authenticated, redirect to auth page
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 px-6">
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
              <Tabs defaultValue="characteristics" className="w-full">
                <TabsList className="mb-8">
                  <TabsTrigger value="characteristics" className="flex items-center">
                    <User size={16} className="mr-2" />
                    Characteristics
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center">
                    <FileStack size={16} className="mr-2" />
                    Documents
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="characteristics">
                  <CharacteristicsSection />
                </TabsContent>
                
                <TabsContent value="documents">
                  <DocumentsSection />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfileSettings;
