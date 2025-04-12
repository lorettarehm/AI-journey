
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, BellRing, Megaphone, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const NotificationsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // In a real implementation, this would be fetched from the user's preferences in the database
  const [notifications, setNotifications] = useState({
    newTechniques: true,
    assessmentReminders: true,
    chatResponses: false,
    newsletterUpdates: true,
    systemAnnouncements: true,
  });
  
  // Simulating saving the notification preferences
  const updateNotificationsMutation = useMutation({
    mutationFn: async (settings: typeof notifications) => {
      // In a real implementation, this would make a call to update the user's preferences in the database
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate API call
      return settings;
    },
    onSuccess: (data) => {
      setNotifications(data);
      toast({
        title: "Notification Preferences Updated",
        description: "Your notification settings have been saved successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating notification settings:", error);
      toast({
        title: "Update Failed",
        description: "There was an error saving your notification preferences. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleToggle = (setting: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSaveSettings = () => {
    updateNotificationsMutation.mutate(notifications);
  };

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
              <div key={setting.id} className="flex items-start justify-between">
                <div className="flex gap-3">
                  {setting.icon}
                  <div>
                    <Label htmlFor={setting.id} className="text-base font-medium">
                      {setting.title}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <Switch 
                  id={setting.id}
                  checked={notifications[setting.id as keyof typeof notifications]} 
                  onCheckedChange={() => handleToggle(setting.id as keyof typeof notifications)}
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t p-6">
          <Button 
            onClick={handleSaveSettings}
            disabled={updateNotificationsMutation.isPending}
          >
            {updateNotificationsMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </>
            )}
          </Button>
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
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="realtime"
                name="emailFrequency"
                className="form-radio h-4 w-4 text-primary border-muted-foreground focus:ring-primary"
                defaultChecked
              />
              <Label htmlFor="realtime">Real-time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="daily"
                name="emailFrequency"
                className="form-radio h-4 w-4 text-primary border-muted-foreground focus:ring-primary"
              />
              <Label htmlFor="daily">Daily digest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="weekly"
                name="emailFrequency"
                className="form-radio h-4 w-4 text-primary border-muted-foreground focus:ring-primary"
              />
              <Label htmlFor="weekly">Weekly digest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="none"
                name="emailFrequency"
                className="form-radio h-4 w-4 text-primary border-muted-foreground focus:ring-primary"
              />
              <Label htmlFor="none">No emails</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t p-6">
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationsSection;
