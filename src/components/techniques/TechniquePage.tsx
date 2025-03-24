
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/ui/FadeIn";
import { Brain, Zap, Lightbulb, BookOpen } from "lucide-react";

interface TechniqueType {
  id: string;
  title: string;
  description: string;
  steps: string[];
  category: 'focus' | 'organization' | 'sensory' | 'social';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const sampleTechniques: TechniqueType[] = [
  {
    id: "tech1",
    title: "Pomodoro Technique",
    description: "A time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.",
    steps: [
      "Choose a task to be accomplished",
      "Set the timer for 25 minutes",
      "Work on the task until the timer rings",
      "Take a short 5-minute break",
      "After four pomodoros, take a longer break (15-30 minutes)"
    ],
    category: 'focus',
    difficulty: 'beginner'
  },
  {
    id: "tech2",
    title: "Body Doubling",
    description: "A technique where another person works alongside you, providing passive accountability and reducing procrastination.",
    steps: [
      "Find a friend, family member, or online body doubling service",
      "Set a specific time to work together",
      "Each person works on their own tasks in the same physical or virtual space",
      "Check in occasionally to maintain accountability"
    ],
    category: 'focus',
    difficulty: 'beginner'
  },
  {
    id: "tech3",
    title: "Sensory Regulation Toolkit",
    description: "A personalized collection of tools and strategies to help manage sensory sensitivities and maintain optimal arousal levels.",
    steps: [
      "Identify your sensory sensitivities and preferences",
      "Gather items that help with sensory regulation (noise-cancelling headphones, fidget toys, etc.)",
      "Create environmental modifications when possible (lighting, temperature, etc.)",
      "Use your toolkit proactively before sensory overload occurs"
    ],
    category: 'sensory',
    difficulty: 'intermediate'
  },
  {
    id: "tech4",
    title: "Time Blindness Management",
    description: "Strategies to compensate for difficulty perceiving and managing time, common in ADHD.",
    steps: [
      "Use visual timers to make time passage visible",
      "Break tasks into smaller time estimates",
      "Set multiple alarms and reminders",
      "Schedule buffer time between activities",
      "Track how long activities actually take vs. how long you think they'll take"
    ],
    category: 'organization',
    difficulty: 'intermediate'
  }
];

const TechniquePage: React.FC = () => {
  return (
    <div className="container max-w-4xl py-12">
      <FadeIn>
        <div className="text-center mb-12">
          <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Evidence-Based Strategies
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Neurodivergent Techniques</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and learn practical strategies tailored for your unique neurodivergent mind.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {sampleTechniques.map((technique, index) => (
          <FadeIn key={technique.id} delay={0.1 * index}>
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                {technique.category === 'focus' && <Zap className="h-5 w-5 text-yellow-500" />}
                {technique.category === 'organization' && <Brain className="h-5 w-5 text-blue-500" />}
                {technique.category === 'sensory' && <Lightbulb className="h-5 w-5 text-purple-500" />}
                {technique.category === 'social' && <BookOpen className="h-5 w-5 text-green-500" />}
                <h3 className="text-lg font-medium">{technique.title}</h3>
              </div>
              <p className="text-muted-foreground mb-4">{technique.description}</p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`item-${technique.id}`}>
                  <AccordionTrigger>How to implement</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-2 pl-2">
                      {technique.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs px-2 py-1 rounded-full bg-muted">
                  {technique.difficulty}
                </span>
                <Button variant="outline" size="sm">Save for later</Button>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      
      <FadeIn delay={0.4}>
        <div className="text-center">
          <Button className="mx-auto">Load more techniques</Button>
        </div>
      </FadeIn>
    </div>
  );
};

export default TechniquePage;
