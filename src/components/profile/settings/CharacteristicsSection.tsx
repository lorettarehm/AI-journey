
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Tag } from 'lucide-react';
import { useCharacteristics } from './characteristics/useCharacteristics';
import CharacteristicItem from './characteristics/CharacteristicItem';
import AddCharacteristicForm from './characteristics/AddCharacteristicForm';
import CommonTraits from './characteristics/CommonTraits';
import InfoTooltip from './characteristics/InfoTooltip';

const CharacteristicsSection = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { characteristics, isLoading } = useCharacteristics();

  const handleSelectCommonTrait = (trait: string) => {
    setIsAdding(true);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">Neurodivergent Characteristics</CardTitle>
              <CardDescription>
                Add your neurodivergent traits and characteristics to help us personalize your experience.
              </CardDescription>
            </div>
            <InfoTooltip 
              content={
                <div className="text-sm space-y-2">
                  <p>Adding your neurodivergent traits helps us:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Personalize content and recommendations</li>
                    <li>Suggest relevant coping techniques</li>
                    <li>Connect you with helpful resources</li>
                  </ul>
                  <p>Your information is private and only used to enhance your experience.</p>
                </div>
              } 
              side="left"
            />
          </div>
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
                  {characteristics.map((item) => (
                    <CharacteristicItem key={item.id} item={item} />
                  ))}
                  
                  {/* Form to add new characteristic */}
                  {isAdding && (
                    <AddCharacteristicForm onCancel={() => setIsAdding(false)} />
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
          <CardFooter className="flex-col items-start">
            <CommonTraits onSelectTrait={handleSelectCommonTrait} />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default CharacteristicsSection;
