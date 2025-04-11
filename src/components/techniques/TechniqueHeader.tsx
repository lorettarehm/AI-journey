
import React from 'react';
import FadeIn from "@/components/ui/FadeIn";

const TechniqueHeader: React.FC = () => {
  return (
    <FadeIn>
      <div className="text-center mb-12">
        <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          Evidence-Based Strategies
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Neurodivergent Techniques</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover and learn practical strategies tailored for your unique neurodivergent mind.
          We suggest 4 techniques at a time that might be helpful.
        </p>
      </div>
    </FadeIn>
  );
};

export default TechniqueHeader;
