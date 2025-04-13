
import React from 'react';
import { format } from 'date-fns';
import { ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
                  {format(new Date(technique.interactions[0].created_at), 'dd/MM/yyyy - HH:mm')}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TechniqueSummaryTable;
