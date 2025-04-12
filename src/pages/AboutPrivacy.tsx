
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeIn from '@/components/ui/FadeIn';

const AboutPrivacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Information
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Test</h1>
            </div>
            
            {/* Content intentionally left blank as requested */}
          </div>
        </FadeIn>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPrivacy;
