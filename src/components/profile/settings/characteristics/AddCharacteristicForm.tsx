
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCharacteristics } from './useCharacteristics';
import InfoTooltip from './InfoTooltip';

interface AddCharacteristicFormProps {
  onCancel: () => void;
}

const AddCharacteristicForm: React.FC<AddCharacteristicFormProps> = ({ onCancel }) => {
  const { toast } = useToast();
  const { addMutation, generateDescription, isGeneratingDescription } = useCharacteristics();
  
  const [newCharacteristic, setNewCharacteristic] = useState('');
  const [newDescription, setNewDescription] = useState('');

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
    
    setNewCharacteristic('');
    setNewDescription('');
    onCancel();
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h4 className="font-medium mb-4">Add New Characteristic</h4>
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Label htmlFor="characteristic">Characteristic Name</Label>
            <InfoTooltip content={
              <div className="text-sm">
                <p>Enter the name of your neurodivergent trait or characteristic.</p>
                <p className="mt-1">Examples: ADHD, Autism, Hyperfocus, Sensory Processing Sensitivity</p>
              </div>
            } />
          </div>
          <Input
            id="characteristic"
            value={newCharacteristic}
            onChange={(e) => setNewCharacteristic(e.target.value)}
            placeholder="E.g., ADHD, Autism, Hyperfocus"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Label htmlFor="description">Description (Optional)</Label>
            <InfoTooltip content={
              <div className="text-sm">
                <p>Describe how this trait affects you in your daily life.</p>
                <p className="mt-1">If left blank, we'll generate a general description from reputable sources.</p>
              </div>
            } />
          </div>
          <Textarea
            id="description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Describe how this trait affects you..."
            rows={3}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Leave blank to automatically generate a description from reputable sources.
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            onClick={onCancel}
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
  );
};

export default AddCharacteristicForm;
