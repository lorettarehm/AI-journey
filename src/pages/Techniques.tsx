
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechniquePage from '@/components/techniques/TechniquePage';

const Techniques = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <TechniquePage />
      </main>
      <Footer />
    </div>
  );
};

export default Techniques;
