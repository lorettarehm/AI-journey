import React, { useState, useEffect } from 'react';
import { Copy, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CurlCommandPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curlCommand: string;
  modelName?: string;
}

const CurlCommandPopup: React.FC<CurlCommandPopupProps> = ({
  open,
  onOpenChange,
  curlCommand,
  modelName
}) => {
  const [copied, setCopied] = useState(false);

  // Reset copied state when dialog opens
  useEffect(() => {
    if (open) {
      setCopied(false);
    }
  }, [open]);

  const handleCopy = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {modelName ? `Curl Command for ${modelName}` : 'Curl Command for Testing'}
          </DialogTitle>
          <DialogDescription>
            Copy and run this command in your terminal to test the API call directly
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mt-4 flex-1 overflow-auto">
          <div className="absolute top-2 right-2 z-10 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="h-8 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs whitespace-pre-wrap min-h-[200px] max-h-[400px]">
            {curlCommand}
          </pre>
        </div>
        
        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CurlCommandPopup;