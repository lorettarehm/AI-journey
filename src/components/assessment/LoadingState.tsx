import React from 'react';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LoadingState = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-6">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-accent" />
          <h2 className="text-xl font-medium">Loading assessment questions...</h2>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoadingState;