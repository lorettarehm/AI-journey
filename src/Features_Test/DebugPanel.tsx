import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Bug, RefreshCw } from 'lucide-react';
import { generateCurlCommand, listAvailableModels } from './llmTesting';
import CurlCommandPopup from './CurlCommandPopup';
import { supabase } from '@/integrations/supabase/client';

interface DebugPanelProps {
  className?: string;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ className }) => {
  const [models, setModels] = useState<Array<{ id: string; name: string; enabled: boolean }>>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedModelName, setSelectedModelName] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("You are a helpful AI assistant. Please provide a concise answer to this question: What is ADHD?");
  const [curlCommand, setCurlCommand] = useState<string>("");
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string>("");
  const [testError, setTestError] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("models");

  // Load available models on component mount
  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    try {
      const availableModels = await listAvailableModels();
      setModels(availableModels);
      
      // Select the first enabled model by default
      const firstEnabledModel = availableModels.find(model => model.enabled);
      if (firstEnabledModel) {
        setSelectedModelId(firstEnabledModel.id);
        setSelectedModelName(firstEnabledModel.name);
      }
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
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

  // Test the model directly
  const handleTestModel = async () => {
    if (!selectedModelId) return;
    
    setTestLoading(true);
    setTestResult("");
    setTestError(null);
    
    try {
      // Get the model details
      const { data: model, error: modelError } = await supabase
        .from('llm_models')
        .select('*')
        .eq('id', selectedModelId)
        .single();
      
      if (modelError) throw new Error(`Error fetching model: ${modelError.message}`);
      if (!model) throw new Error('Model not found');
      
      // Make the API call
      const response = await fetch(model.api_url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${model.api_key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
          },
        }),
      });
      
      const responseData = await response.text();
      
      if (!response.ok) {
        throw new Error(`API error (${response.status}): ${responseData}`);
      }
      
      try {
        // Try to parse as JSON for pretty display
        const jsonData = JSON.parse(responseData);
        setTestResult(JSON.stringify(jsonData, null, 2));
      } catch {
        // If not valid JSON, display as is
        setTestResult(responseData);
      }
    } catch (error) {
      console.error('Error testing model:', error);
      setTestError(error.message || 'An unknown error occurred');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bug className="mr-2 h-5 w-5" />
          LLM API Debugging
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="test">Test API</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="models">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Available Models</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadModels}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="border rounded-md divide-y">
                {models.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No models found
                  </div>
                ) : (
                  models.map(model => (
                    <div 
                      key={model.id} 
                      className={`p-3 flex justify-between items-center cursor-pointer hover:bg-muted/50 ${
                        selectedModelId === model.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => {
                        setSelectedModelId(model.id);
                        setSelectedModelName(model.name);
                      }}
                    >
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {model.id}</div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        model.enabled 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {model.enabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="test">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Selected Model</label>
                <div className="p-2 border rounded-md bg-muted/50">
                  {selectedModelName || 'No model selected'}
                </div>
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
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleGenerateCurl} 
                  disabled={loading || !selectedModelId || !prompt.trim()}
                  variant="outline"
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
                
                <Button 
                  onClick={handleTestModel} 
                  disabled={testLoading || !selectedModelId || !prompt.trim()}
                >
                  {testLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test API Call"
                  )}
                </Button>
              </div>
              
              {testError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{testError}</AlertDescription>
                </Alert>
              )}
              
              {testResult && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Response</label>
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                    {testResult}
                  </pre>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Edge Function Logs</label>
                <p className="text-xs text-muted-foreground">
                  Edge function logs are not directly accessible from the browser. 
                  Check the Supabase dashboard for logs.
                </p>
                <div className="p-4 bg-muted rounded-md text-xs">
                  <p>To view logs:</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Go to the Supabase dashboard</li>
                    <li>Navigate to Edge Functions</li>
                    <li>Select the function you want to debug</li>
                    <li>Click on "Logs" to view recent invocations</li>
                  </ol>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Popup dialog for displaying the curl command */}
      <CurlCommandPopup
        open={popupOpen}
        onOpenChange={setPopupOpen}
        curlCommand={curlCommand}
        modelName={selectedModelName}
      />
    </Card>
  );
};

export default DebugPanel;