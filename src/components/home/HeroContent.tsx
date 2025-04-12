import React from 'react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui/FadeIn';
const HeroContent = () => {
  return <div>
      <FadeIn>
        <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          Your Neurodiversity Companion
        </span>
      </FadeIn>
      
      <FadeIn delay={0.1}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-balance mb-6">
          Empowering your unique <span className="text-accent">neurodivergent</span> journey
        </h1>
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
          audhd.ai is an adaptive AI companion that helps individuals with ADHD and Autism 
          thrive through personalized assessments, evidence-based techniques, and continuous learning.
        </p>
      </FadeIn>
      
      <FadeIn delay={0.3}>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/assessment" className="btn-primary text-center">
            Start Your Assessment
          </Link>
          
        </div>
      </FadeIn>
    </div>;
};
export default HeroContent;