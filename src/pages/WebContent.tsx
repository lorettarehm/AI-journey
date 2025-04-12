
import React from 'react';
import WebLibrary from '@/components/WebLibrary';
import LibraryContentList from '@/components/LibraryContentList';

const WebContent = () => {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Web Content Library</h1>
      
      <div className="mb-10">
        <WebLibrary />
      </div>
      
      <div>
        <LibraryContentList />
      </div>
    </div>
  );
};

export default WebContent;
