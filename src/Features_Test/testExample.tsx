import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateCurlCommand, listAvailableModels } from './llmTesting';
import { Loader2, Copy, Check } from 'lucide-react';

/**
 * Example component showing how to use the LLM testing functionality
 */
const LLMTestingExample: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("You are a helpful AI assistant. Please provide a concise answer to this question: What is ADHD?");
  const [models, setModels] = useState<Array<{ id: string; name: string; enabled: boolean }>>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [curlCommand, setCurlCommand] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Load available models on component mount
  useEffect(() => {
    const loadModels = async () => {
      const availableModels = await listAvailableModels();
      setModels(availableModels);
      
      // Select the first enabled model by default
      const firstEnabledModel = availableModels.find(model => model.enabled);
      if (firstEnabledModel) {
        setSelectedModelId(firstEnabledModel.id);
      }
    };
    
    loadModels();
  }, []);

  // Generate curl command
  const handleGenerateCurl = async () => {
    setLoading(true);
    try {
      const command = await generateCurlCommand(prompt, selectedModelId);
      setCurlCommand(command);
    } catch (error) {
      console.error('Error generating curl command:', error);
      setCurlCommand(`# Error generating curl command: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Copy curl command to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>LLM API Testing</CardTitle>
        <CardDescription>
          Generate curl commands to test LLM API calls directly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Model</label>
          <Select value={selectedModelId} onValueChange={setSelectedModelId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map(model => (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  disabled={!model.enabled}
                >
                  {model.name} {!model.enabled && "(Disabled)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            placeholder="Enter your prompt here..."
          />
        </div>
        
        {curlCommand && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Generated curl Command</label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopy}
                disabled={!curlCommand}
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
              {curlCommand}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateCurl} 
          disabled={loading || !selectedModelId || !prompt.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate curl Command"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LLMTestingExample;