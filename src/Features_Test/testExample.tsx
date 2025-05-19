import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateCurlCommand, listAvailableModels } from './llmTesting';
import { Loader2 } from 'lucide-react';
import CurlCommandPopup from './CurlCommandPopup';

/**
 * Example component showing how to use the LLM testing functionality
 */
const LLMTestingExample: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("You are a helpful AI assistant. Please provide a concise answer to this question: What is ADHD?");
  const [models, setModels] = useState<Array<{ id: string; name: string; enabled: boolean }>>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedModelName, setSelectedModelName] = useState<string>("");
  const [curlCommand, setCurlCommand] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  // Load available models on component mount
  useEffect(() => {
    const loadModels = async () => {
      const availableModels = await listAvailableModels();
      setModels(availableModels);
      
      // Select the first enabled model by default
      const firstEnabledModel = availableModels.find(model => model.enabled);
      if (firstEnabledModel) {
        setSelectedModelId(firstEnabledModel.id);
        setSelectedModelName(firstEnabledModel.name);
      }
    };
    
    loadModels();
  }, []);

  // Handle model selection change
  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    const selectedModel = models.find(model => model.id === modelId);
    if (selectedModel) {
      setSelectedModelName(selectedModel.name);
    }
  };

  // Generate curl command
  const handleGenerateCurl = async () => {
    setLoading(true);
    try {
      const command = await generateCurlCommand(prompt, selectedModelId);
      setCurlCommand(command);
      setPopupOpen(true);
    } catch (error) {
      console.error('Error generating curl command:', error);
      setCurlCommand(`# Error generating curl command: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            <Select value={selectedModelId} onValueChange={handleModelChange}>
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

      {/* Popup dialog for displaying the curl command */}
      <CurlCommandPopup
        open={popupOpen}
        onOpenChange={setPopupOpen}
        curlCommand={curlCommand}
        modelName={selectedModelName}
      />
    </>
  );
};

export default LLMTestingExample;