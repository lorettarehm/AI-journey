
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui/FadeIn';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* Testimonials Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Making a Difference</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  See how Evolve has helped people on their neurodivergent journey.
                </p>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Evolve helped me understand my ADHD patterns and leverage my hyperfocus in productive ways.",
                  author: "Alex K.",
                  role: "Software Developer"
                },
                {
                  quote: "The personalized recommendations actually work with my autistic traits instead of against them.",
                  author: "Morgan T.",
                  role: "Graphic Designer"
                },
                {
                  quote: "For the first time, I feel like an app understands how my brain works and adapts to my needs.",
                  author: "Jamie L.",
                  role: "Teacher"
                }
              ].map((testimonial, i) => (
                <FadeIn key={i} delay={0.1 * i}>
                  <div className="bg-background rounded-2xl p-6 border border-border shadow-sm h-full">
                    <div className="mb-6">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.33333 21.3333C7.86667 21.3333 6.66667 20.8 5.73333 19.7333C4.8 18.6667 4.33333 17.3333 4.33333 15.7333C4.33333 13.2 5.2 11.0667 6.93333 9.33334C8.66667 7.60001 10.8 6.73334 13.3333 6.73334V10.6667C12.1333 10.6667 11.1333 11.0667 10.3333 11.8667C9.53333 12.6667 9.13333 13.6667 9.13333 14.8667H13.3333C13.8667 14.8667 14.3333 15.0667 14.7333 15.4667C15.1333 15.8667 15.3333 16.3333 15.3333 16.8667V24C15.3333 24.5333 15.1333 25 14.7333 25.4C14.3333 25.8 13.8667 26 13.3333 26H9.33333V21.3333ZM23.3333 21.3333C21.8667 21.3333 20.6667 20.8 19.7333 19.7333C18.8 18.6667 18.3333 17.3333 18.3333 15.7333C18.3333 13.2 19.2 11.0667 20.9333 9.33334C22.6667 7.60001 24.8 6.73334 27.3333 6.73334V10.6667C26.1333 10.6667 25.1333 11.0667 24.3333 11.8667C23.5333 12.6667 23.1333 13.6667 23.1333 14.8667H27.3333C27.8667 14.8667 28.3333 15.0667 28.7333 15.4667C29.1333 15.8667 29.3333 16.3333 29.3333 16.8667V24C29.3333 24.5333 29.1333 25 28.7333 25.4C28.3333 25.8 27.8667 26 27.3333 26H23.3333V21.3333Z" fill="#4338CA" fillOpacity="0.2"/>
                      </svg>
                    </div>
                    <blockquote className="text-lg mb-6">"{testimonial.quote}"</blockquote>
                    <footer>
                      <div className="font-medium">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </footer>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6 bg-accent/5">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Begin Your Personalized Journey Today
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Evolve is continuously adapting to provide the most effective support for your neurodivergent mind.
                  Start with a simple assessment and discover strategies tailored specifically to you.
                </p>
                <Link to="/assessment">
                  <Button size="lg">Start Your Assessment</Button>
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
