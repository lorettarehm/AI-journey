import React from 'react';
import FadeIn from '@/components/ui/FadeIn';

const ResearchProcess: React.FC = () => {
  return (
    <FadeIn delay={0.6}>
      <div className="mt-16 border-t border-border pt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Research Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Literature Review</h3>
            <p className="text-sm text-muted-foreground">
              We analyze peer-reviewed studies on neurodiversity interventions from leading journals.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Evidence Evaluation</h3>
            <p className="text-sm text-muted-foreground">
              Each technique is scored based on scientific validity and practical effectiveness.
              <span className="ml-1 text-accent font-medium">🔜 Interactive evidence explorer coming soon!</span>
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Community Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Real-world effectiveness is continuously measured through user feedback and outcomes.
            </p>
          </div>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-8">
          Our database is regularly updated with new research findings and community insights.
        </p>
      </div>
    </FadeIn>
  );
};

export default ResearchProcess;
