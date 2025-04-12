
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search, X } from 'lucide-react';

interface LibrarySearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const LibrarySearch = ({ searchQuery, setSearchQuery }: LibrarySearchProps) => {
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by title, summary or URL..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 pr-9"
      />
      {searchQuery && (
        <button 
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          onClick={clearSearch}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default LibrarySearch;
