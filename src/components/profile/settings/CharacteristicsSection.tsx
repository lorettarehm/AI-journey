
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tag, Trash2, Plus, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Characteristic {
  id: string;
  characteristic: string;
  description: string | null;
}

const CharacteristicsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newCharacteristic, setNewCharacteristic] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

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
      return data || [];
    },
    enabled: !!user,
  });

  // Add new characteristic
  const addMutation = useMutation({
    mutationFn: async (newItem: { characteristic: string; description: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_characteristics')
        .insert({
          user_id: user.id,
          characteristic: newItem.characteristic,
          description: newItem.description || null
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characteristics', user?.id] });
      setIsAdding(false);
      setNewCharacteristic('');
      setNewDescription('');
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

  const handleAddCharacteristic = () => {
    if (!newCharacteristic.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a characteristic name.",
        variant: "destructive",
      });
      return;
    }

    addMutation.mutate({
      characteristic: newCharacteristic.trim(),
      description: newDescription.trim()
    });
  };

  const handleDeleteCharacteristic = (id: string) => {
    if (window.confirm('Are you sure you want to remove this characteristic?')) {
      deleteMutation.mutate(id);
    }
  };

  // Common neurodivergent traits that users can quickly add
  const commonTraits = [
    "ADHD", "Autism", "Dyslexia", "Dyscalculia", "Dyspraxia", 
    "Hyperfocus", "Sensory Sensitivity", "Pattern Recognition",
    "Creative Thinking", "Hyperlexia", "Synesthesia"
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Neurodivergent Characteristics</CardTitle>
          <CardDescription>
            Add your neurodivergent traits and characteristics to help us personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-6 bg-accent/10 rounded w-1/3 animate-pulse"></div>
              <div className="h-24 bg-accent/5 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              {characteristics.length === 0 && !isAdding ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                  <Tag size={36} className="mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">No Characteristics Added</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Add your neurodivergent characteristics to help personalize your experience.
                  </p>
                  <Button onClick={() => setIsAdding(true)} variant="secondary">
                    <Plus size={16} className="mr-2" />
                    Add Characteristic
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* List of existing characteristics */}
                  {characteristics.map((item: Characteristic) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-card">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{item.characteristic}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteCharacteristic(item.id)}
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {/* Form to add new characteristic */}
                  {isAdding && (
                    <div className="p-4 border rounded-lg bg-card">
                      <h4 className="font-medium mb-4">Add New Characteristic</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="characteristic">Characteristic Name</Label>
                          <Input
                            id="characteristic"
                            value={newCharacteristic}
                            onChange={(e) => setNewCharacteristic(e.target.value)}
                            placeholder="E.g., ADHD, Autism, Hyperfocus"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description (Optional)</Label>
                          <Textarea
                            id="description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="Describe how this trait affects you..."
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            onClick={() => {
                              setIsAdding(false);
                              setNewCharacteristic('');
                              setNewDescription('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleAddCharacteristic}
                            disabled={!newCharacteristic.trim() || addMutation.isPending}
                          >
                            {addMutation.isPending ? "Adding..." : "Add Characteristic"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Button to add more characteristics */}
                  {!isAdding && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setIsAdding(true)}
                    >
                      <Plus size={16} className="mr-2" />
                      Add Another Characteristic
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
        {!isAdding && characteristics.length > 0 && (
          <CardFooter className="flex-col items-start border-t p-6">
            <h4 className="font-medium mb-3">Common Neurodivergent Traits</h4>
            <div className="flex flex-wrap gap-2">
              {commonTraits.map((trait) => (
                <Badge 
                  key={trait} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-accent/10"
                  onClick={() => {
                    setIsAdding(true);
                    setNewCharacteristic(trait);
                  }}
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default CharacteristicsSection;
