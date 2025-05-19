import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DebugPanel from '@/Features_Test/DebugPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

const DebugLLM: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">LLM API Debugging</h1>
            <p className="text-muted-foreground">
              Debug and test LLM API calls to identify and fix issues with model integration.
            </p>
          </div>
          
          <Tabs defaultValue="debug">
            <TabsList className="mb-6">
              <TabsTrigger value="debug">Debug Tools</TabsTrigger>
              <TabsTrigger value="guide">Troubleshooting Guide</TabsTrigger>
            </TabsList>
            
            <TabsContent value="debug">
              <div className="grid grid-cols-1 gap-6">
                <DebugPanel />
                
                <Card>
                  <CardHeader>
                    <CardTitle>API Response Analysis</CardTitle>
                    <CardDescription>
                      Common error patterns and their solutions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          If you're seeing "Error: No LLM models available", make sure you have at least one enabled model in the LLM configuration.
                        </AlertDescription>
                      </Alert>
                      
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          If you're seeing "401 Unauthorized", check that your API key is correct and has not expired.
                        </AlertDescription>
                      </Alert>
                      
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          If you're seeing "429 Too Many Requests", you may have exceeded your API rate limits. Wait a few minutes and try again.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="guide">
              <Card>
                <CardHeader>
                  <CardTitle>LLM Integration Troubleshooting Guide</CardTitle>
                  <CardDescription>
                    Step-by-step process to diagnose and fix LLM API issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">1. Check LLM Configuration</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Verify that you have at least one enabled LLM model in the database</li>
                        <li>Ensure API keys are correctly formatted and not expired</li>
                        <li>Confirm API URLs are correct and accessible</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">2. Test Direct API Calls</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Use the "Test API Call" button to make a direct call to the model</li>
                        <li>Check the response for any error messages</li>
                        <li>Verify that the model is responding with expected content</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">3. Check Edge Function Logs</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Go to the Supabase dashboard</li>
                        <li>Navigate to Edge Functions</li>
                        <li>Select the function (e.g., "generate-technique-recommendations")</li>
                        <li>Check logs for error messages or unexpected behavior</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">4. Common Issues and Solutions</h3>
                      <div className="space-y-2">
                        <div className="p-3 border rounded-md">
                          <p className="font-medium">Issue: "No LLM models available"</p>
                          <p className="text-sm text-muted-foreground">Solution: Add and enable at least one LLM model in the LLM configuration.</p>
                        </div>
                        <div className="p-3 border rounded-md">
                          <p className="font-medium">Issue: "401 Unauthorized"</p>
                          <p className="text-sm text-muted-foreground">Solution: Update your API key in the LLM configuration.</p>
                        </div>
                        <div className="p-3 border rounded-md">
                          <p className="font-medium">Issue: "429 Too Many Requests"</p>
                          <p className="text-sm text-muted-foreground">Solution: Implement rate limiting or upgrade your API plan.</p>
                        </div>
                        <div className="p-3 border rounded-md">
                          <p className="font-medium">Issue: "Edge Function returned a non-2xx status code"</p>
                          <p className="text-sm text-muted-foreground">Solution: Check the Edge Function logs for detailed error information.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DebugLLM;