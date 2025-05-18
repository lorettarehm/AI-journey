import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LLMTestingExample from './testExample';

/**
 * Example page for LLM testing functionality
 */
const LLMTestingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">LLM API Testing</h1>
            <p className="text-muted-foreground">
              Generate curl commands to test LLM API calls directly before they're made by the application.
            </p>
          </div>
          
          <LLMTestingExample />
          
          <div className="mt-8 p-4 bg-muted rounded-md">
            <h2 className="text-lg font-medium mb-2">How to Use</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Select an LLM model from the dropdown</li>
              <li>Enter your prompt in the text area</li>
              <li>Click "Generate curl Command"</li>
              <li>Copy the generated command</li>
              <li>Paste and run the command in your terminal</li>
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              This tool helps you test API calls directly, which can be useful for debugging or verifying API keys.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LLMTestingPage;