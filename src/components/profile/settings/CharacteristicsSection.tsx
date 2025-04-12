
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tag, Trash2, Plus, Save, Edit, X, InfoIcon, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Characteristic {
  id: string;
  characteristic: string;
  description: string | null;
  source_url?: string | null;
}

const CharacteristicsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newCharacteristic, setNewCharacteristic] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCharacteristic, setEditCharacteristic] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [traitSources, setTraitSources] = useState<Record<string, string>>({});

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
      setEditingId(null);
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

  const handleAddCharacteristic = async () => {
    if (!newCharacteristic.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a characteristic name.",
        variant: "destructive",
      });
      return;
    }

    let description = newDescription.trim();
    let sourceUrl = '';
    
    // If no description is provided, generate one
    if (!description) {
      try {
        const { description: generatedDesc, source } = await generateDescription(newCharacteristic);
        description = generatedDesc;
        sourceUrl = source;
        
        // Store the source for this trait
        setTraitSources(prev => ({
          ...prev,
          [newCharacteristic]: source
        }));
        
        toast({
          title: "Description Generated",
          description: "A description has been automatically generated for this characteristic.",
        });
      } catch (error) {
        console.error('Error generating description:', error);
        // Continue with empty description if generation fails
      }
    }

    addMutation.mutate({
      characteristic: newCharacteristic.trim(),
      description,
      source_url: sourceUrl
    });
  };

  const handleEditClick = (item: Characteristic) => {
    setEditingId(item.id);
    setEditCharacteristic(item.characteristic);
    setEditDescription(item.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdateCharacteristic = async (id: string) => {
    if (!editCharacteristic.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a characteristic name.",
        variant: "destructive",
      });
      return;
    }

    let description = editDescription.trim();
    let sourceUrl = '';
    
    // Get the current item to check if we need to generate a description
    const currentItem = characteristics.find(item => item.id === id);
    
    // If description is being removed or was never provided, generate one
    if (!description && currentItem) {
      try {
        const { description: generatedDesc, source } = await generateDescription(editCharacteristic);
        description = generatedDesc;
        sourceUrl = source;
        
        // Store the source for this trait
        setTraitSources(prev => ({
          ...prev,
          [editCharacteristic]: source
        }));
        
        toast({
          title: "Description Generated",
          description: "A description has been automatically generated for this characteristic.",
        });
      } catch (error) {
        console.error('Error generating description:', error);
        // Continue with empty description if generation fails
      }
    } else if (currentItem && currentItem.source_url) {
      // Preserve the existing source URL if we're not generating a new description
      sourceUrl = currentItem.source_url;
    }

    updateMutation.mutate({
      id,
      characteristic: editCharacteristic.trim(),
      description,
      source_url: sourceUrl
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

  // Load sources for existing characteristics on component mount
  useEffect(() => {
    const newSources: Record<string, string> = {};
    
    characteristics.forEach(item => {
      if (item.source_url) {
        newSources[item.characteristic] = item.source_url;
      }
    });
    
    if (Object.keys(newSources).length > 0) {
      setTraitSources(prev => ({...prev, ...newSources}));
    }
  }, [characteristics]);

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
                      {editingId === item.id ? (
                        // Edit mode
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`edit-characteristic-${item.id}`}>Characteristic Name</Label>
                            <Input
                              id={`edit-characteristic-${item.id}`}
                              value={editCharacteristic}
                              onChange={(e) => setEditCharacteristic(e.target.value)}
                              placeholder="E.g., ADHD, Autism, Hyperfocus"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-description-${item.id}`}>Description (Optional)</Label>
                            <Textarea
                              id={`edit-description-${item.id}`}
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              placeholder="Describe how this trait affects you..."
                              rows={3}
                            />
                            <FormDescription className="mt-1 text-xs">
                              Leave blank to automatically generate a description from reputable sources.
                            </FormDescription>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              onClick={handleCancelEdit}
                              disabled={updateMutation.isPending}
                            >
                              <X size={16} className="mr-2" />
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => handleUpdateCharacteristic(item.id)}
                              disabled={!editCharacteristic.trim() || updateMutation.isPending}
                            >
                              {updateMutation.isPending ? "Updating..." : (
                                <>
                                  <Save size={16} className="mr-2" />
                                  Save Changes
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{item.characteristic}</h4>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditClick(item)}
                              >
                                <Edit size={16} className="text-muted-foreground" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteCharacteristic(item.id)}
                              >
                                <Trash2 size={16} className="text-destructive" />
                              </Button>
                            </div>
                          </div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground">
                              <p>{item.description}</p>
                              {item.source_url && (
                                <div className="flex items-center mt-2 text-xs text-muted-foreground/80">
                                  <InfoIcon size={12} className="mr-1" />
                                  <span>Source: </span>
                                  <a 
                                    href={item.source_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="ml-1 text-accent hover:underline flex items-center"
                                  >
                                    {new URL(item.source_url).hostname.replace('www.', '')}
                                    <ExternalLink size={10} className="ml-1" />
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </>
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
                          <FormDescription className="mt-1 text-xs">
                            Leave blank to automatically generate a description from reputable sources.
                          </FormDescription>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            onClick={() => {
                              setIsAdding(false);
                              setNewCharacteristic('');
                              setNewDescription('');
                            }}
                            disabled={addMutation.isPending || isGeneratingDescription}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleAddCharacteristic}
                            disabled={!newCharacteristic.trim() || addMutation.isPending || isGeneratingDescription}
                          >
                            {addMutation.isPending || isGeneratingDescription ? "Processing..." : "Add Characteristic"}
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
