import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TechniqueCardFeedback from './techniques/card/TechniqueCardFeedback';

const Footer = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <footer className="bg-background border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link 
              to="/" 
              className="text-2xl font-bold tracking-tight flex items-center mb-4"
            >
              <div className="bg-black rounded-lg p-1 mr-2">
                <img 
                  src="/lovable-uploads/7ad3926c-6b1e-49e0-8dc6-5430f621384e.png" 
                  alt="Brain logo" 
                  className="h-6 w-6" 
                />
              </div>
              <span className="text-accent">audhd.ai</span>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs">
              Your neurodiversity companion, evolving with you on your journey.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/assessment" className="text-muted-foreground hover:text-accent transition-colors">
                  Self-Assessment
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-accent transition-colors">
                  Strength Profiling
                </Link>
              </li>
              <li>
                <Link to="/techniques" className="text-muted-foreground hover:text-accent transition-colors">
                  Technique Recommendations
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Our Approach
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Research
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setSupportOpen(true)} 
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Support
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setFeedbackOpen(true)} 
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Feedback
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} audhd.ai. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {feedbackOpen && (
        <TechniqueCardFeedback
          open={feedbackOpen}
          setOpen={setFeedbackOpen}
          type="feedback"
        />
      )}
      
      {supportOpen && (
        <TechniqueCardFeedback
          open={supportOpen}
          setOpen={setSupportOpen}
          type="support"
        />
      )}
    </footer>
  );
};

export default Footer;
