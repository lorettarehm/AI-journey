
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

interface EmptyLibraryStateProps {
  isFiltered: boolean;
  clearSearch?: () => void;
}

const EmptyLibraryState = ({ isFiltered, clearSearch }: EmptyLibraryStateProps) => {
  if (isFiltered) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <h3 className="text-lg font-semibold mb-2">No matching content</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            {clearSearch && (
              <Button variant="outline" className="mt-4" onClick={clearSearch}>
                Clear Search
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold mb-2">Your library is empty</h3>
          <p className="text-muted-foreground">
            Use the form above to add content from websites to your library.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyLibraryState;
