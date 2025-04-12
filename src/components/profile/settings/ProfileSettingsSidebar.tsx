
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, FileText, Bell, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfileSettingsSidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hash = location.hash || '#neurodivergent';

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const menuItems = [
    { 
      icon: <User size={18} />, 
      label: 'Personal Information', 
      hash: '#personal',
      active: hash === '#personal'
    },
    { 
      icon: <Settings size={18} />, 
      label: 'Neurodivergent Traits', 
      hash: '#neurodivergent',
      active: hash === '#neurodivergent' || hash === ''
    },
    { 
      icon: <FileText size={18} />, 
      label: 'Documents', 
      hash: '#documents',
      active: hash === '#documents'
    },
    { 
      icon: <Bell size={18} />, 
      label: 'Notifications', 
      hash: '#notifications',
      active: hash === '#notifications'
    },
    { 
      icon: <Shield size={18} />, 
      label: 'Privacy & Security', 
      hash: '#privacy',
      active: hash === '#privacy'
    },
  ];

  const handleMenuClick = (hash) => {
    navigate(`/profile/settings${hash}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
              <AvatarFallback className="bg-primary/10 text-primary">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{profile?.full_name || 'User'}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <nav>
            <ul className="divide-y divide-border">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleMenuClick(item.hash)}
                    className={`w-full text-left flex items-center gap-3 px-6 py-4 text-sm hover:bg-accent/5 transition-colors ${
                      item.active ? 'bg-accent/10 text-accent font-medium' : ''
                    }`}
                  >
                    {item.icon}
                    {item.label}
                    {item.active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsSidebar;
