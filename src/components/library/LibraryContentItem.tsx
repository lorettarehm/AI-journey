
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface LibraryContent {
  id: string;
  url: string;
  title: string;
  summary: string;
  created_at: string;
}

interface LibraryContentItemProps {
  content: LibraryContent;
}

const LibraryContentItem = ({ content }: LibraryContentItemProps) => {
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
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{new Date(content.created_at).toLocaleString()}</span>
          <span className="truncate max-w-[230px]">{content.url}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LibraryContentItem;
