
import React, { useState, useEffect } from 'react';
import { Tag, Plus, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LibraryTagSelectorProps {
  contentId: string;
  onTagsUpdated: () => void;
}

export interface ContentTag {
  id: string;
  content_id: string;
  tag_name: string;
}

const LibraryTagSelector = ({ contentId, onTagsUpdated }: LibraryTagSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<ContentTag[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch all tags for this content
  const fetchContentTags = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('web_content_tags')
        .select('*')
        .eq('content_id', contentId);
      
      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: "Failed to fetch tags",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all unique tags in the system for suggestions
  const fetchAvailableTags = async () => {
    try {
      const { data, error } = await supabase
        .from('web_content_tags')
        .select('tag_name')
        .order('tag_name');
      
      if (error) throw error;
      
      // Extract unique tag names
      const uniqueTags = Array.from(new Set(data?.map(item => item.tag_name) || []));
      setAvailableTags(uniqueTags);
    } catch (error) {
      console.error('Error fetching available tags:', error);
    }
  };

  useEffect(() => {
    fetchContentTags();
    fetchAvailableTags();
  }, [contentId]);

  const addTag = async (tagName: string) => {
    if (!tagName.trim()) return;
    
    try {
      const { error } = await supabase
        .from('web_content_tags')
        .insert({
          content_id: contentId,
          tag_name: tagName.trim()
        });
      
      if (error) throw error;
      
      toast({
        title: "Tag Added",
        description: `Added "${tagName}" to this content.`,
      });
      
      // Refresh tags
      fetchContentTags();
      fetchAvailableTags();
      onTagsUpdated();
      setNewTag('');
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: "Failed to add tag",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const removeTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('web_content_tags')
        .delete()
        .eq('id', tagId);
      
      if (error) throw error;
      
      toast({
        title: "Tag Removed",
        description: "Tag has been removed from this content.",
      });
      
      // Refresh tags
      fetchContentTags();
      onTagsUpdated();
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        title: "Failed to remove tag",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleSelectTag = (selectedTag: string) => {
    // Check if tag already exists for this content
    const exists = tags.some(tag => tag.tag_name.toLowerCase() === selectedTag.toLowerCase());
    if (!exists) {
      addTag(selectedTag);
    }
    setOpen(false);
  };

  const handleCreateTag = () => {
    if (newTag.trim()) {
      addTag(newTag);
      setOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-10">
        {tags.map((tag) => (
          <div 
            key={tag.id} 
            className="flex items-center bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full"
          >
            <span>{tag.tag_name}</span>
            <button 
              onClick={() => removeTag(tag.id)}
              className="ml-1.5 hover:text-primary/80"
              aria-label={`Remove ${tag.tag_name} tag`}
            >
              ×
            </button>
          </div>
        ))}
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 gap-1 border-dashed"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Tag</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-60" align="start">
            <Command>
              <CommandInput 
                placeholder="Search or create tag..." 
                value={newTag}
                onValueChange={setNewTag}
              />
              <CommandList>
                <CommandEmpty>
                  {newTag ? (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full justify-start text-left font-normal mx-1"
                      onClick={handleCreateTag}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create "{newTag}"
                    </Button>
                  ) : (
                    <span className="px-2 py-3.5 text-sm text-muted-foreground">
                      No tags found
                    </span>
                  )}
                </CommandEmpty>
                <CommandGroup heading="Available Tags">
                  {availableTags.map((tag) => (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={() => handleSelectTag(tag)}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      {tag}
                      {tags.some(t => t.tag_name === tag) && (
                        <Check className="ml-auto h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {newTag && !availableTags.some(tag => tag.toLowerCase() === newTag.toLowerCase()) && (
                  <CommandItem
                    value={`create-${newTag}`}
                    onSelect={handleCreateTag}
                    className="text-primary"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create "{newTag}"
                  </CommandItem>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default LibraryTagSelector;
