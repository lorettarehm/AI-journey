
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Save } from 'lucide-react';

interface ProfileFormProps {
  fullName: string | null;
  email: string | null;
}

const ProfileForm = ({ fullName, email }: ProfileFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      full_name: fullName || '',
      email: email || ''
    }
  });

  // Update form values when props change
  React.useEffect(() => {
    form.reset({
      full_name: fullName || '',
      email: email || user?.email || ''
    });
  }, [fullName, email, form, user?.email]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values: {
      full_name: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      const {
        error
      } = await supabase.from('profiles').update({
        full_name: values.full_name,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      if (error) throw error;
      return values;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile', user?.id]
      });
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully."
      });
    },
    onError: error => {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = async (values: {
    full_name: string;
  }) => {
    await updateProfileMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input {...field} disabled placeholder="Your email" />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed. This is managed by your authentication provider.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="mt-4" disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
