
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ExternalLink, Tag } from 'lucide-react';
import LibraryTagSelector from './LibraryTagSelector';

interface LibraryContent {
  id: string;
  url: string;
  title: string;
  summary: string;
  created_at: string;
  tags?: string[];
}

interface LibraryContentItemProps {
  content: LibraryContent;
  onRefresh?: () => void;
}

const LibraryContentItem = ({ content, onRefresh }: LibraryContentItemProps) => {
  const [showTags, setShowTags] = useState(false);

  const handleTagsUpdate = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
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
        
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {content.tags.map(tagName => (
              <span 
                key={tagName} 
                className="inline-flex items-center bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full"
              >
                {tagName}
              </span>
            ))}
          </div>
        )}
        
        <div className="mb-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowTags(!showTags)}
            className="px-2 h-7 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Tag className="h-3.5 w-3.5" />
            {showTags ? "Hide Tags" : "Manage Tags"}
          </Button>
          
          {showTags && (
            <div className="mt-2">
              <LibraryTagSelector 
                contentId={content.id}
                onTagsUpdated={handleTagsUpdate}
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{new Date(content.created_at).toLocaleString()}</span>
          <span className="truncate max-w-[230px]">{content.url}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LibraryContentItem;
