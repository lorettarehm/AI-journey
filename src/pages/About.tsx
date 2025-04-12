
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeIn from '@/components/ui/FadeIn';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-32 pb-20 px-6">
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Our Mission
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">About audhd.ai</h1>
            </div>

            <div className="space-y-6">
              <p className="text-lg">
                Welcome to audhd.ai, a compassionate digital platform designed specifically for individuals with neurodivergent traits, including ADHD, autism, dyslexia, and other cognitive variations. Our mission is to empower neurodivergent individuals by providing personalized tools and insights that celebrate cognitive diversity.
              </p>

              <h2 className="text-2xl font-semibold mt-8">Our Approach</h2>
              <p>
                At audhd.ai, we recognize that neurodivergence is not a deficit but a different way of processing information and experiencing the world. Our platform combines evidence-based research with AI technology to create a supportive environment where users can:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>Understand their unique cognitive profile through comprehensive self-assessments</li>
                <li>Discover and develop their inherent strengths through personalized insights</li>
                <li>Access tailored techniques and strategies that complement their thinking style</li>
                <li>Track progress and growth over time with intuitive visualization tools</li>
                <li>Connect with AI assistance that adapts to individual needs and preferences</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8">Our Values</h2>
              <p>
                Every aspect of audhd.ai is built around core values that guide our development:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-muted/40 p-6 rounded-lg">
                  <h3 className="font-medium text-xl mb-2">Neurodiversity Affirmation</h3>
                  <p>We celebrate cognitive differences and focus on strengths rather than deficits.</p>
                </div>
                
                <div className="bg-muted/40 p-6 rounded-lg">
                  <h3 className="font-medium text-xl mb-2">Evidence-Based Approaches</h3>
                  <p>Our recommendations and insights are grounded in scientific research and best practices.</p>
                </div>
                
                <div className="bg-muted/40 p-6 rounded-lg">
                  <h3 className="font-medium text-xl mb-2">User Empowerment</h3>
                  <p>We provide tools for self-knowledge and personal growth, not diagnoses or medical advice.</p>
                </div>
                
                <div className="bg-muted/40 p-6 rounded-lg">
                  <h3 className="font-medium text-xl mb-2">Privacy & Security</h3>
                  <p>We maintain the highest standards for protecting your personal information and data.</p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mt-8">Our Team</h2>
              <p>
                audhd.ai was created by a diverse team of neurodivergent and neurotypical professionals, including cognitive scientists, mental health specialists, software engineers, and UX designers. Our team members bring both professional expertise and lived experience to create a platform that truly understands and serves the neurodivergent community.
              </p>

              <p className="mt-8 text-lg">
                We're on a journey to create a world where neurodivergence is recognized as a valuable form of human diversity. Thank you for being part of this mission.
              </p>
            </div>
          </div>
        </FadeIn>
      </main>

      <Footer />
    </div>
  );
};

export default About;
