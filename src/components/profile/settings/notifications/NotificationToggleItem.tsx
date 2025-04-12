
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { LucideIcon } from 'lucide-react';

interface NotificationToggleItemProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onCheckedChange: () => void;
}

const NotificationToggleItem = ({
  id,
  title,
  description,
  icon,
  checked,
  onCheckedChange,
}: NotificationToggleItemProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex gap-3">
        {icon}
        <div>
          <Label htmlFor={id} className="text-base font-medium">
            {title}
          </Label>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <Switch 
        id={id}
        checked={checked} 
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};

export default NotificationToggleItem;
