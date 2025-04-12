
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

type NotificationSettings = {
  newTechniques: boolean;
  assessmentReminders: boolean;
  chatResponses: boolean;
  newsletterUpdates: boolean;
  systemAnnouncements: boolean;
};

export const useNotifications = () => {
  const { toast } = useToast();
  
  // Initial notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newTechniques: true,
    assessmentReminders: true,
    chatResponses: false,
    newsletterUpdates: true,
    systemAnnouncements: true,
  });

  const [emailFrequency, setEmailFrequency] = useState('realtime');
  
  // Simulating saving the notification preferences
  const updateNotificationsMutation = useMutation({
    mutationFn: async (settings: NotificationSettings) => {
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

  const handleToggle = (setting: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSaveSettings = () => {
    updateNotificationsMutation.mutate(notifications);
  };

  return {
    notifications,
    emailFrequency,
    setEmailFrequency,
    handleToggle,
    handleSaveSettings,
    isPending: updateNotificationsMutation.isPending
  };
};
