
import React from 'react';
import WebLibrary from '@/components/WebLibrary';
import LibraryContentList from '@/components/LibraryContentList';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WebContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container max-w-4xl py-8">
          <h1 className="text-3xl font-bold mb-6">Web Content Library</h1>
          
          <div className="mb-10">
            <WebLibrary />
          </div>
          
          <div>
            <LibraryContentList />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WebContent;
