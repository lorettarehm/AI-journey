
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LibraryContent {
  id: string;
  url: string;
  title: string;
  summary: string;
  created_at: string;
  tags?: string[];
}

export function useLibraryContent() {
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
      // Fetch content
      const { data: contentData, error: contentError } = await supabase
        .from('web_library_content')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (contentError) throw contentError;
      
      // Fetch tags for all content
      const { data: tagData, error: tagError } = await supabase
        .from('web_content_tags')
        .select('*');
      
      if (tagError) throw tagError;
      
      // Map tags to content
      const contentWithTags = contentData?.map(content => {
        const contentTags = tagData
          ?.filter(tag => tag.content_id === content.id)
          ?.map(tag => tag.tag_name) || [];
        
        return {
          ...content,
          tags: contentTags
        };
      }) || [];
      
      setContents(contentWithTags);
      setFilteredContents(contentWithTags);
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
          item.url?.toLowerCase().includes(query) ||
          item.tags?.some(tag => tag.toLowerCase().includes(query))
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

  return {
    contents,
    filteredContents,
    isLoading,
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortOrder,
    handleRefresh,
    clearSearch,
    toggleSortOrder
  };
}
