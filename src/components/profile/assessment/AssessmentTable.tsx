
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Assessment {
  id: string;
  completed_at: string;
  focus_level: number;
  energy_level: number;
  creativity_score: number;
  stress_level: number;
}

interface AssessmentTableProps {
  assessments: Assessment[];
}

const AssessmentTable = ({ assessments }: AssessmentTableProps) => {
  // Create a Map to deduplicate assessments by ID if needed
  const uniqueAssessments = Array.from(
    new Map(assessments.map(assessment => [assessment.id, assessment])).values()
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Focus</TableHead>
            <TableHead>Energy</TableHead>
            <TableHead>Creativity</TableHead>
            <TableHead>Stress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uniqueAssessments.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell>
                {formatDistanceToNow(new Date(assessment.completed_at), { addSuffix: true })}
              </TableCell>
              <TableCell>{assessment.focus_level}/100</TableCell>
              <TableCell>{assessment.energy_level}/100</TableCell>
              <TableCell>{assessment.creativity_score}/100</TableCell>
              <TableCell>{assessment.stress_level}/100</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssessmentTable;
