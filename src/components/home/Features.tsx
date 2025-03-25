
import React from 'react';
import FadeIn from '@/components/ui/FadeIn';
import { Activity, BarChart3, BookOpen, Brain } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Activity size={24} className="text-accent" />,
      title: 'Personalized Assessment',
      description: 'Daily adaptive questionnaires that evolve with your needs and track your unique patterns and experiences.'
    },
    {
      icon: <Brain size={24} className="text-accent" />,
      title: 'Strength Profiling',
      description: 'Visual representation of your cognitive and emotional strengths to help you leverage your natural abilities.'
    },
    {
      icon: <BookOpen size={24} className="text-accent" />,
      title: 'Evidence-Based Techniques',
      description: 'Weekly recommendations based on the latest research, tailored to your specific neurodivergent profile.'
    },
    {
      icon: <BarChart3 size={24} className="text-accent" />,
      title: 'Continuous Progress Tracking',
      description: 'Visualize your journey and celebrate achievements with intuitive progress metrics and insights.'
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Adaptive Support for Your Unique Mind</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              audhd.ai continuously learns and adapts to provide you with the most relevant support for your neurodivergent journey.
            </p>
          </div>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FadeIn key={index} delay={0.1 * index} direction="up">
              <div className="bg-background rounded-2xl p-6 shadow-sm border border-border/50 h-full card-hover">
                <div className="rounded-xl bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        
        <FadeIn delay={0.5}>
          <div className="mt-20 glass-card rounded-2xl p-8 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-x-20 -translate-y-20 blur-3xl"></div>
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Backed by Scientific Research</h3>
                  <p className="text-muted-foreground mb-6">
                    audhd.ai scans and analyzes the latest scientific research on ADHD and Autism daily, 
                    ensuring that our recommendations are always based on the most current evidence.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {['ADHD', 'Autism', 'Executive Function', 'Sensory Processing', 'Cognitive Flexibility'].map((tag, i) => (
                      <span key={i} className="bg-accent/10 text-accent text-sm px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-background rounded-xl p-4 shadow-sm border border-border">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <BookOpen size={16} className="text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Latest Research Update</h4>
                        <p className="text-sm text-muted-foreground">
                          New study on mindfulness techniques specifically adapted for ADHD shows promising results
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Source: Journal of Attention Disorders, 2023
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background rounded-xl p-4 shadow-sm border border-border">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <BookOpen size={16} className="text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Personalized Recommendation</h4>
                        <p className="text-sm text-muted-foreground">
                          Based on your profile, structured visual organization techniques may improve your task completion
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Matched to your strength profile
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Features;
