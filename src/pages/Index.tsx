
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui/FadeIn';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useHasAssessmentToday } from '@/hooks/useHasAssessmentToday';

const Index = () => {
  const { user } = useAuth();
  const { hasAssessmentToday } = useHasAssessmentToday();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* CTA Section */}
        <section className="py-20 px-6 bg-accent/5">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Begin Your Personalized Journey Today
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  audhd.ai is continuously adapting to provide the most effective support for your neurodivergent mind.
                  Start with a simple assessment and discover strategies tailored specifically to you.
                </p>
                <Link to="/assessment">
                  <Button size="lg">{user && hasAssessmentToday 
                    ? "Re-take Self-Assessment" 
                    : "Start Your Assessment"}
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
