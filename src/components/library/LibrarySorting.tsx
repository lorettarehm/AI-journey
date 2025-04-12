
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LibrarySortingProps {
  sortField: string;
  setSortField: (field: string) => void;
  sortOrder: 'asc' | 'desc';
  toggleSortOrder: () => void;
  handleRefresh: () => void;
}

const LibrarySorting = ({ 
  sortField, 
  setSortField, 
  sortOrder, 
  toggleSortOrder, 
  handleRefresh 
}: LibrarySortingProps) => {
  return (
    <div className="flex gap-2">
      <Select 
        value={sortField} 
        onValueChange={(value) => setSortField(value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at">Date Added</SelectItem>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="url">URL</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleSortOrder}
        title={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
      >
        <ArrowUpDown className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="icon" onClick={handleRefresh} title="Refresh content">
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default LibrarySorting;
