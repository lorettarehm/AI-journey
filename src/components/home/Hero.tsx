
import React from 'react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui/FadeIn';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-20 right-16 w-72 h-72 rounded-full bg-accent/5 animate-float"></div>
        <div className="absolute top-40 -left-24 w-96 h-96 rounded-full bg-accent/5 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-32 w-48 h-48 rounded-full bg-accent/5 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
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
                Evolve is an adaptive AI companion that helps individuals with ADHD and Autism 
                thrive through personalized assessments, evidence-based techniques, and continuous learning.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/assessment" className="btn-primary text-center">
                  Start Your Assessment
                </Link>
                <Link to="#features" className="btn-secondary text-center">
                  Learn More
                </Link>
              </div>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.3} direction="left">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full"></div>
              <div className="relative glass-card rounded-3xl p-8 shadow-2xl">
                <div className="bg-accent/10 rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4">Daily Check-in</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">How focused do you feel today?</p>
                      <div className="w-full bg-secondary rounded-full h-2 mb-1">
                        <div className="bg-accent h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Not at all</span>
                        <span>Very focused</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">How is your energy level?</p>
                      <div className="w-full bg-secondary rounded-full h-2 mb-1">
                        <div className="bg-accent h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Weekly Progress</h3>
                  <div className="flex space-x-2 mb-3">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                      <div key={i} className="flex-1">
                        <div className="flex flex-col items-center">
                          <div 
                            className={`w-full h-24 rounded-t-lg ${i < 5 ? 'bg-accent' : 'bg-secondary'}`} 
                            style={{ 
                              height: `${(Math.random() * 50 + 30)}%`, 
                              opacity: i < 5 ? 1 : 0.5
                            }}
                          ></div>
                          <div className="text-xs mt-2 text-muted-foreground">{day}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="inline-flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                      <span>Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default Hero;
