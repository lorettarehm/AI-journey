
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  avatarUrl: string | null;
  fullName: string | null;
  email: string | null;
}

const AvatarUpload = ({ avatarUrl, fullName, email }: AvatarUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Avatar upload mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;

      // Upload to storage
      const {
        error: uploadError
      } = await supabase.storage.from('avatars').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: urlData
      } = supabase.storage.from('avatars').getPublicUrl(fileName);

      // Update profile with new avatar URL
      const {
        error: updateError
      } = await supabase.from('profiles').update({
        avatar_url: urlData.publicUrl,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      if (updateError) throw updateError;
      return urlData.publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile', user?.id]
      });
      setIsUploading(false);
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully."
      });
    },
    onError: error => {
      console.error("Error uploading avatar:", error);
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your avatar. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Avatar image must be less than 2MB.",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }
    setIsUploading(true);
    await uploadAvatarMutation.mutate(file);
  };

  return (
    <div className="relative">
      <Avatar className="h-24 w-24 border-2">
        <AvatarImage src={avatarUrl || ''} alt="Profile" />
        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
          {fullName?.charAt(0) || email?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <label
        htmlFor="avatar-upload"
        className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
      >
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={isUploading}
        />
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
      </label>
    </div>
  );
};

export default AvatarUpload;
