
import React from 'react';
import { format } from 'date-fns';
import { ThumbsUp, ThumbsDown, Clock, Brain, Battery, Zap } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TechniqueSummary {
  id: string;
  title: string;
  interactions: TechniqueInteraction[];
  helpful: number;
  notHelpful: number;
  assessment: LatestAssessment | null;
}

interface TechniqueInteraction {
  id: string;
  technique_id: string;
  technique_title: string;
  feedback: 'helpful' | 'not-helpful' | null;
  created_at: string;
}

interface LatestAssessment {
  id: string;
  completed_at: string;
  focus_level: number;
  energy_level: number;
  creativity_score: number;
  stress_level: number;
  emotional_regulation: number;
  organization: number;
  pattern_recognition: number;
  problem_solving: number;
  time_awareness: number;
}

interface TechniqueSummaryTableProps {
  techniqueSummary: TechniqueSummary[];
  latestAssessment: LatestAssessment | null;
}

const TechniqueSummaryTable = ({ techniqueSummary, latestAssessment }: TechniqueSummaryTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Technique</TableHead>
            <TableHead>Interactions</TableHead>
            <TableHead>Helpful</TableHead>
            <TableHead>Not Helpful</TableHead>
            <TableHead>Last Interaction</TableHead>
            {latestAssessment && (
              <>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center">
                        <Brain className="h-4 w-4 mr-1" /> Focus
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Current focus level from latest assessment</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center">
                        <Battery className="h-4 w-4 mr-1" /> Energy
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Current energy level from latest assessment</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center">
                        <Zap className="h-4 w-4 mr-1" /> Creativity
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Current creativity score from latest assessment</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {techniqueSummary.map((technique) => (
            <TableRow key={technique.id}>
              <TableCell className="font-medium">{technique.title}</TableCell>
              <TableCell>{technique.interactions.length}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <ThumbsUp className="h-4 w-4 text-accent mr-2" />
                  {technique.helpful}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <ThumbsDown className="h-4 w-4 text-destructive mr-2" />
                  {technique.notHelpful}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  {format(new Date(technique.interactions[0].created_at), 'MMM d, yyyy - h:mm a')}
                </div>
              </TableCell>
              {latestAssessment && (
                <>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor: `rgba(67, 56, 202, ${latestAssessment.focus_level / 100})`,
                          color: latestAssessment.focus_level > 50 ? 'white' : 'black'
                        }}
                      >
                        {latestAssessment.focus_level}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor: `rgba(245, 158, 11, ${latestAssessment.energy_level / 100})`,
                          color: latestAssessment.energy_level > 50 ? 'white' : 'black'
                        }}
                      >
                        {latestAssessment.energy_level}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor: `rgba(16, 185, 129, ${latestAssessment.creativity_score / 100})`,
                          color: latestAssessment.creativity_score > 50 ? 'white' : 'black'
                        }}
                      >
                        {latestAssessment.creativity_score}
                      </div>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TechniqueSummaryTable;
