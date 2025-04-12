
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LoadingSkeleton from "@/components/profile/settings/personal-info/LoadingSkeleton";

interface ScrapeResult {
  id: string;
  url: string;
  title: string;
  summary: string;
  created_at: string;
}

const WebLibrary = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scrapedContent, setScrapedContent] = useState<ScrapeResult | null>(null);
  const { toast } = useToast();

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to add to your library.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-content', {
        body: { url },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setScrapedContent(data.data);
      
      toast({
        title: "Content Added Successfully",
        description: `${data.data.title || 'Content'} has been added to your library.`,
      });
    } catch (error) {
      console.error('Error adding content:', error);
      toast({
        title: "Content Addition Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Web Content Library</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleScrape} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to add to library (e.g., https://example.com)"
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !url}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Add to Library"
              )}
            </Button>
          </div>
        </form>
        
        {isLoading && (
          <div className="mt-4">
            <LoadingSkeleton 
              variant="text" 
              lines={4} 
              withCard={false}
              pulseIntensity="strong"
            />
          </div>
        )}
        
        {scrapedContent && !isLoading && (
          <div className="mt-4 space-y-4">
            <h3 className="text-lg font-semibold">{scrapedContent.title}</h3>
            <p className="text-sm text-muted-foreground">
              Source: <a href={scrapedContent.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{scrapedContent.url}</a>
            </p>
            <div className="p-4 bg-muted rounded-md">
              <h4 className="text-sm font-medium mb-2">Summary:</h4>
              <p className="text-sm">{scrapedContent.summary}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Added on: {new Date(scrapedContent.created_at).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebLibrary;
