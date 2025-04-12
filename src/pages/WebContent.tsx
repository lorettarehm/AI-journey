
import React from 'react';
import WebScraper from '@/components/WebScraper';
import ScrapedContentList from '@/components/ScrapedContentList';

const WebContent = () => {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Web Content Management</h1>
      
      <div className="mb-10">
        <WebScraper />
      </div>
      
      <div>
        <ScrapedContentList />
      </div>
    </div>
  );
};

export default WebContent;
