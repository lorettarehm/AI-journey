
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechniqueCard from '@/components/techniques/TechniqueCard';
import FadeIn from '@/components/ui/FadeIn';
import { BookOpen, Filter, Search } from 'lucide-react';

const Techniques = () => {
  // Sample technique data
  const techniques = [
    {
      id: 1,
      title: 'Time Blocking with Visual Cues',
      description: 'Using visual representations of time blocks can help leverage your pattern recognition strengths to improve time management. This technique involves creating color-coded blocks of time in your schedule and associating each color with specific types of activities.',
      category: 'Time Management',
      source: 'Journal of Attention Disorders, 2023',
      researchBased: true,
    },
    {
      id: 2,
      title: 'Mind Mapping for Task Organization',
      description: 'Mind mapping is a visual thinking tool that leverages your natural creativity. It can help you organize tasks by creating a visual representation of ideas, tasks, and their relationships. This technique is particularly effective for individuals with strong visual-spatial abilities.',
      category: 'Organization',
      source: 'Cognitive Psychology Review, 2022',
      researchBased: true,
    },
    {
      id: 3,
      title: 'Body Doubling for Focus Enhancement',
      description: 'Body doubling involves working alongside another person to maintain focus and motivation. The presence of another person (either physically or virtually) can provide accountability and reduce the tendency to become distracted. This technique leverages social reinforcement to improve task completion.',
      category: 'Focus',
      source: 'ADHD Community Resources',
      researchBased: false,
    },
    {
      id: 4,
      title: 'Sensory Calibration Technique',
      description: 'This approach helps you identify and manage sensory sensitivities by creating a personalized sensory profile and implementing tailored strategies. By understanding your unique sensory needs, you can create environments that minimize overwhelming stimuli and optimize focus conditions.',
      category: 'Sensory Management',
      source: 'Autism Research Journal, 2023',
      researchBased: true,
    },
    {
      id: 5,
      title: 'Task Chunking with Visual Progress Tracking',
      description: 'Breaking down large tasks into smaller, manageable chunks and tracking progress visually can help overcome executive function challenges. This technique combines visual cues with incremental accomplishment to maintain motivation and reduce overwhelm.',
      category: 'Task Management',
      source: 'Executive Function Research Institute, 2022',
      researchBased: true,
    },
    {
      id: 6,
      title: 'Alternating Focus Method',
      description: 'This technique involves alternating between high-focus tasks and creative tasks based on your natural energy patterns. By scheduling tasks in alignment with your cognitive strengths at different times of day, you can optimize productivity while reducing mental fatigue.',
      category: 'Energy Management',
      source: 'Neurodiversity in the Workplace, 2023',
      researchBased: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="flex flex-col md:flex-row justify-between items-start mb-12">
              <div>
                <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                  Evidence-Based Support
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Personalized Techniques</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Discover strategies tailored to your neurodivergent profile and backed by the latest research.
                </p>
              </div>
              <div className="mt-6 md:mt-0 flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search techniques..." 
                    className="input-primary pl-10"
                  />
                </div>
                <button className="btn-secondary flex items-center">
                  <Filter size={16} className="mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <div className="glass-card rounded-2xl p-6 mb-12">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-4 mt-1">
                  <BookOpen size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Latest Research Update</h3>
                  <p className="text-muted-foreground">
                    A recent study published in the Journal of Attention Disorders found that visual scheduling 
                    techniques improved time management by 40% for individuals with ADHD. Based on your profile, 
                    we've added new recommendations that leverage your visual-spatial strengths.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techniques.map((technique, index) => (
              <FadeIn key={technique.id} delay={0.1 * Math.min(index, 5)}>
                <TechniqueCard
                  title={technique.title}
                  description={technique.description}
                  category={technique.category}
                  source={technique.source}
                  researchBased={technique.researchBased}
                  onFeedback={(feedback) => console.log(`Feedback for ${technique.id}:`, feedback)}
                />
              </FadeIn>
            ))}
          </div>
          
          <FadeIn delay={0.4}>
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold mb-4">Continuously Evolving Resources</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                Evolve analyzes new research daily to ensure you always have access to the most 
                effective, evidence-based techniques for your neurodivergent mind.
              </p>
              <button className="btn-primary">
                Request Specific Topic
              </button>
            </div>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Techniques;
