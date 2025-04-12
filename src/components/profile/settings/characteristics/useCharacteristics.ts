
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Characteristic } from './types';
import { useToast } from '@/hooks/use-toast';

export const useCharacteristics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  // Fetch user characteristics
  const { data: characteristics = [], isLoading } = useQuery({
    queryKey: ['characteristics', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_characteristics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Characteristic[];
    },
    enabled: !!user,
  });

  // Add new characteristic
  const addMutation = useMutation({
    mutationFn: async (newItem: { characteristic: string; description: string; source_url?: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_characteristics')
        .insert({
          user_id: user.id,
          characteristic: newItem.characteristic,
          description: newItem.description || null,
          source_url: newItem.source_url || null
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characteristics', user?.id] });
      toast({
        title: "Characteristic Added",
        description: "Your neurodivergent characteristic has been added successfully.",
      });
    },
    onError: (error) => {
      console.error("Error adding characteristic:", error);
      toast({
        title: "Error",
        description: "Failed to add characteristic. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update characteristic
  const updateMutation = useMutation({
    mutationFn: async (item: { id: string; characteristic: string; description: string | null; source_url?: string | null }) => {
      const { error } = await supabase
        .from('user_characteristics')
        .update({
          characteristic: item.characteristic,
          description: item.description,
          source_url: item.source_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);
        
      if (error) throw error;
      return item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characteristics', user?.id] });
      toast({
        title: "Characteristic Updated",
        description: "Your characteristic has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating characteristic:", error);
      toast({
        title: "Error",
        description: "Failed to update characteristic. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete characteristic
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_characteristics')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['characteristics', user?.id] });
      toast({
        title: "Characteristic Removed",
        description: "The characteristic has been removed from your profile.",
      });
    },
    onError: (error) => {
      console.error("Error deleting characteristic:", error);
      toast({
        title: "Error",
        description: "Failed to remove characteristic. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate description for a trait
  const generateDescription = async (trait: string): Promise<{description: string, source: string}> => {
    setIsGeneratingDescription(true);
    
    try {
      const response = await fetch(`https://sjeaxjdujzdrlkkfdzjc.supabase.co/functions/v1/fetch-trait-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession()}`
        },
        body: JSON.stringify({ trait }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate description');
      }
      
      const data = await response.json();
      return {
        description: data.description || '',
        source: data.source || ''
      };
    } catch (error) {
      console.error('Error generating description:', error);
      return {
        description: `${trait} is a neurodivergent characteristic that affects how individuals process information and interact with the world.`,
        source: 'https://www.understood.org/'
      };
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return {
    characteristics,
    isLoading,
    addMutation,
    updateMutation,
    deleteMutation,
    generateDescription,
    isGeneratingDescription
  };
};
