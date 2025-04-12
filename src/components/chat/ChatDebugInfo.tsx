
import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from '@/components/ui/card';
import { DebugInfo } from '@/hooks/chat/types';

interface ChatDebugInfoProps {
  debugInfo: DebugInfo;
}

const ChatDebugInfo: React.FC<ChatDebugInfoProps> = ({ debugInfo }) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-t">
      <CollapsibleTrigger className="flex items-center justify-center w-full py-2 text-xs text-muted-foreground hover:bg-muted/20 transition-colors">
        Debug Information {open ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="m-2 border-muted">
          <CardContent className="p-4 text-xs">
            <h4 className="font-medium mb-2">AI Process Details</h4>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Model:</span> Mistral-7B-Instruct-v0.2
              </div>
              <div>
                <span className="font-medium">Processing Time:</span> {debugInfo?.processingTime || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Status:</span> {debugInfo?.status || 'Idle'}
              </div>
              {debugInfo?.error && (
                <div className="border border-red-300 bg-red-50 text-red-800 p-2 rounded">
                  <span className="font-medium">Error:</span> {debugInfo.error}
                </div>
              )}
              <div>
                <span className="font-medium">API Request Log:</span>
                <pre className="mt-1 p-2 bg-slate-100 rounded overflow-x-auto">
                  {debugInfo?.requestLog || 'No requests logged'}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ChatDebugInfo;
