
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { BellRing, Megaphone, Clock, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import NotificationToggleItem from './notifications/NotificationToggleItem';
import EmailFrequencySelector from './notifications/EmailFrequencySelector';
import NotificationsSaveButton from './notifications/NotificationsSaveButton';
import { useNotifications } from './notifications/useNotifications';

const NotificationsSection = () => {
  const { user } = useAuth();
  const { 
    notifications, 
    emailFrequency, 
    setEmailFrequency,
    handleToggle, 
    handleSaveSettings, 
    isPending 
  } = useNotifications();
  
  const notificationSettings = [
    {
      id: 'newTechniques',
      title: 'New Techniques',
      description: 'Get notified when new neurodivergent techniques are available',
      icon: <Megaphone className="h-5 w-5 text-muted-foreground" />
    },
    {
      id: 'assessmentReminders',
      title: 'Assessment Reminders',
      description: 'Receive reminders to complete your periodic assessments',
      icon: <Clock className="h-5 w-5 text-muted-foreground" />
    },
    {
      id: 'chatResponses',
      title: 'Chat Responses',
      description: 'Be notified when you receive responses in your chat conversations',
      icon: <MessageSquare className="h-5 w-5 text-muted-foreground" />
    },
    {
      id: 'newsletterUpdates',
      title: 'Newsletter Updates',
      description: 'Receive our newsletter with the latest neurodiversity research',
      icon: <BellRing className="h-5 w-5 text-muted-foreground" />
    },
    {
      id: 'systemAnnouncements',
      title: 'System Announcements',
      description: 'Important system updates and new features',
      icon: <Megaphone className="h-5 w-5 text-muted-foreground" />
    }
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Notification Preferences</CardTitle>
          <CardDescription>
            Manage how and when you receive notifications about your neurodivergent journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {notificationSettings.map((setting) => (
              <NotificationToggleItem
                key={setting.id}
                id={setting.id}
                title={setting.title}
                description={setting.description}
                icon={setting.icon}
                checked={notifications[setting.id as keyof typeof notifications]}
                onCheckedChange={() => handleToggle(setting.id as keyof typeof notifications)}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t p-6">
          <NotificationsSaveButton 
            onClick={handleSaveSettings}
            isPending={isPending}
          />
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Email Frequency</CardTitle>
          <CardDescription>
            Control how often you receive email notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailFrequencySelector 
            selectedFrequency={emailFrequency}
            onChange={setEmailFrequency}
          />
        </CardContent>
        <CardFooter className="flex justify-end border-t p-6">
          <NotificationsSaveButton 
            onClick={handleSaveSettings}
            isPending={isPending}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationsSection;
