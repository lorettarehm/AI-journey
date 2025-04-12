
import React, { useState } from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableRow, TableCell, TableBody } from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TechniqueCardHeader from './card/TechniqueCardHeader';
import TechniqueCardDetails from './card/TechniqueCardDetails';
import TechniqueCardFooter from './card/TechniqueCardFooter';
import TechniqueNutshell from './card/TechniqueNutshell';
import { TechniqueType } from './useTechniques';
import { useTechniqueInteractions } from './card/useTechniqueInteractions';

interface TechniqueCardProps {
  technique: TechniqueType;
}

const TechniqueCard: React.FC<TechniqueCardProps> = ({ technique }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { saveInteraction } = useTechniqueInteractions();

  const handleOpenSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
      // Record interaction only when opening a section
      saveInteraction(technique.technique_id, technique.title);
    }
  };

  return (
    <Card className="mb-6 overflow-hidden hover:shadow-md transition-shadow duration-300 border-l-4 border-l-accent">
      <CardContent className="p-0">
        <TechniqueCardHeader 
          title={technique.title}
          difficulty={technique.difficulty_level}
          category={technique.category}
        />
        
        <div className="px-6 py-4">
          <TechniqueNutshell description={technique.description} />
          
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="implementation" className="border-b-0">
              <AccordionTrigger 
                onClick={() => handleOpenSection('implementation')}
                className="py-2 text-sm font-medium hover:no-underline"
              >
                Implementation Steps
              </AccordionTrigger>
              <AccordionContent>
                <TechniqueCardDetails steps={technique.implementation_steps} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {(technique.journal || technique.publication_date || technique.url || technique.doi) && (
            <div className="mt-4 bg-muted/40 rounded-md p-3">
              <h4 className="text-sm font-medium mb-2">Source Information</h4>
              <Table>
                <TableBody>
                  {technique.journal && (
                    <TableRow className="border-b-0">
                      <TableCell className="py-1 pl-0 text-xs font-medium">Journal:</TableCell>
                      <TableCell className="py-1 text-xs">{technique.journal}</TableCell>
                    </TableRow>
                  )}
                  {technique.publication_date && (
                    <TableRow className="border-b-0">
                      <TableCell className="py-1 pl-0 text-xs font-medium">Published:</TableCell>
                      <TableCell className="py-1 text-xs">{technique.publication_date}</TableCell>
                    </TableRow>
                  )}
                  {technique.doi && (
                    <TableRow className="border-b-0">
                      <TableCell className="py-1 pl-0 text-xs font-medium">DOI:</TableCell>
                      <TableCell className="py-1 text-xs">
                        <a 
                          href={`https://doi.org/${technique.doi}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          {technique.doi}
                        </a>
                      </TableCell>
                    </TableRow>
                  )}
                  {technique.url && (
                    <TableRow className="border-b-0">
                      <TableCell className="py-1 pl-0 text-xs font-medium">URL:</TableCell>
                      <TableCell className="py-1 text-xs">
                        <a 
                          href={technique.url}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          View Original Paper
                        </a>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        <TechniqueCardFooter techniqueId={technique.technique_id} />
      </CardContent>
    </Card>
  );
};

export default TechniqueCard;
