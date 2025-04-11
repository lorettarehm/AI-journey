
import React from 'react';
import FadeIn from "@/components/ui/FadeIn";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ResearchProcess: React.FC = () => {
  return (
    <FadeIn delay={0.6}>
      <div className="mt-16 bg-secondary/30 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">About Our Research Process</h2>
        <p className="text-muted-foreground mb-4">
          Our system scans and analyzes the latest scientific research on ADHD and Autism daily, ensuring that our recommendations are always based on the most current evidence.
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="research-sources">
            <AccordionTrigger>Research Sources</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-2">
                We analyze peer-reviewed publications from sources including:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Journal of Attention Disorders</li>
                <li>Journal of Autism and Developmental Disorders</li>
                <li>Developmental Cognitive Neuroscience</li>
                <li>Research in Developmental Disabilities</li>
                <li>Journal of Child Psychology and Psychiatry</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="recommendation-process">
            <AccordionTrigger>Recommendation Process</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Our recommendation engine uses AI profiling to match techniques to individual needs based on assessment data, interaction history, and scientific evidence. Each technique is evaluated for effectiveness, difficulty level, and suitability for different profiles.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="data-freshness">
            <AccordionTrigger>Data Freshness</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Our database is updated daily with the latest research findings. The current database contains techniques extracted from publications dating from 2010 to present, with priority given to more recent studies.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </FadeIn>
  );
};

export default ResearchProcess;
