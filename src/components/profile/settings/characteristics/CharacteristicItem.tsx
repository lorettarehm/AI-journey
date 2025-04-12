
import React, { useState } from 'react';
import { Characteristic } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';
import { Edit, Trash2, Save, X, InfoIcon, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCharacteristics } from './useCharacteristics';
import InfoTooltip from './InfoTooltip';

interface CharacteristicItemProps {
  item: Characteristic;
}

const CharacteristicItem: React.FC<CharacteristicItemProps> = ({ item }) => {
  const { toast } = useToast();
  const { updateMutation, deleteMutation, generateDescription } = useCharacteristics();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editCharacteristic, setEditCharacteristic] = useState(item.characteristic);
  const [editDescription, setEditDescription] = useState(item.description || '');

  const handleEditClick = () => {
    setIsEditing(true);
    setEditCharacteristic(item.characteristic);
    setEditDescription(item.description || '');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateCharacteristic = async () => {
    if (!editCharacteristic.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a characteristic name.",
        variant: "destructive",
      });
      return;
    }

    let description = editDescription.trim();
    let sourceUrl = item.source_url || '';
    
    // If description is being removed or was never provided, generate one
    if (!description) {
      try {
        const { description: generatedDesc, source } = await generateDescription(editCharacteristic);
        description = generatedDesc;
        sourceUrl = source;
        
        toast({
          title: "Description Generated",
          description: "A description has been automatically generated for this characteristic.",
        });
      } catch (error) {
        console.error('Error generating description:', error);
        // Continue with empty description if generation fails
      }
    }

    updateMutation.mutate({
      id: item.id,
      characteristic: editCharacteristic.trim(),
      description,
      source_url: sourceUrl
    });
    
    setIsEditing(false);
  };

  const handleDeleteCharacteristic = () => {
    if (window.confirm('Are you sure you want to remove this characteristic?')) {
      deleteMutation.mutate(item.id);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      {isEditing ? (
        // Edit mode
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Label htmlFor={`edit-characteristic-${item.id}`}>Characteristic Name</Label>
              <InfoTooltip content={
                <div className="text-sm">
                  <p>The name of your neurodivergent trait or characteristic.</p>
                  <p className="mt-1">Be specific to help us better personalize your experience.</p>
                </div>
              } />
            </div>
            <Input
              id={`edit-characteristic-${item.id}`}
              value={editCharacteristic}
              onChange={(e) => setEditCharacteristic(e.target.value)}
              placeholder="E.g., ADHD, Autism, Hyperfocus"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Label htmlFor={`edit-description-${item.id}`}>Description (Optional)</Label>
              <InfoTooltip content={
                <div className="text-sm">
                  <p>Describe how this trait affects your daily life and experiences.</p>
                  <p className="mt-1">Personal descriptions help us better understand your unique needs.</p>
                </div>
              } />
            </div>
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
              onClick={handleUpdateCharacteristic}
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
                onClick={handleEditClick}
              >
                <Edit size={16} className="text-muted-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDeleteCharacteristic}
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
  );
};

export default CharacteristicItem;
