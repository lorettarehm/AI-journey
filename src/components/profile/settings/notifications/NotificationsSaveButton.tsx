
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';

interface NotificationsSaveButtonProps {
  onClick: () => void;
  isPending: boolean;
}

const NotificationsSaveButton = ({ onClick, isPending }: NotificationsSaveButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      disabled={isPending}
    >
      {isPending ? (
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
  );
};

export default NotificationsSaveButton;
