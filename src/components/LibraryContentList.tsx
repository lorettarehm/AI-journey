
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LoadingSkeleton from "@/components/profile/settings/personal-info/LoadingSkeleton";
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface LibraryContent {
  id: string;
  url: string;
  title: string;
  summary: string;
  created_at: string;
}

const LibraryContentList = () => {
  const [contents, setContents] = useState<LibraryContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
      <h2 className="text-2xl font-bold">Library Contents ({contents.length})</h2>
      
      {contents.map((content) => (
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
    </div>
  );
};

export default LibraryContentList;
