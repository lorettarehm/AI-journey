
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LoadingSkeleton from "@/components/profile/settings/personal-info/LoadingSkeleton";
import { Button } from '@/components/ui/button';
import { ExternalLink, Search, ArrowUpDown, RefreshCw, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LibraryContent {
  id: string;
  url: string;
  title: string;
  summary: string;
  created_at: string;
}

const LibraryContentList = () => {
  const [contents, setContents] = useState<LibraryContent[]>([]);
  const [filteredContents, setFilteredContents] = useState<LibraryContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const fetchLibraryContents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('web_library_content')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setContents(data || []);
      setFilteredContents(data || []);
    } catch (error) {
      console.error('Error fetching library contents:', error);
      toast({
        title: "Failed to Fetch Content",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryContents();
  }, []);

  // Filter and sort contents when dependencies change
  useEffect(() => {
    let result = [...contents];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.title?.toLowerCase().includes(query) || 
          item.summary?.toLowerCase().includes(query) ||
          item.url?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
      
      if (sortField === 'created_at') {
        valueA = new Date(a.created_at).getTime();
        valueB = new Date(b.created_at).getTime();
      } else if (sortField === 'title') {
        valueA = a.title?.toLowerCase() || '';
        valueB = b.title?.toLowerCase() || '';
      } else {
        valueA = a[sortField as keyof LibraryContent] || '';
        valueB = b[sortField as keyof LibraryContent] || '';
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredContents(result);
  }, [contents, searchQuery, sortField, sortOrder]);

  const handleRefresh = () => {
    fetchLibraryContents();
    toast({
      title: "Refreshing Content",
      description: "Fetching the latest library content"
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <LoadingSkeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
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
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Library Contents ({filteredContents.length})</h2>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button variant="outline" size="icon" onClick={handleRefresh} title="Refresh content">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
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
        </div>
      </div>
      
      {filteredContents.length === 0 ? (
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center p-6">
              <h3 className="text-lg font-semibold mb-2">No matching content</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button variant="outline" className="mt-4" onClick={clearSearch}>
                Clear Search
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {filteredContents.map((content) => (
            <Card key={content.id} className="w-full overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start gap-2">
                  <span>{content.title || 'Untitled Content'}</span>
                  <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                    <a href={content.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Source
                    </a>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-md mb-3">
                  <p className="text-sm">{content.summary}</p>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{new Date(content.created_at).toLocaleString()}</span>
                  <span className="truncate max-w-[230px]">{content.url}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default LibraryContentList;
