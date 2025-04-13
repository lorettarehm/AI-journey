
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

interface AssessmentDetailProps {
  assessment: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AssessmentDetail = ({ assessment, open, onOpenChange }: AssessmentDetailProps) => {
  if (!assessment) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assessment Details</DialogTitle>
          <DialogDescription>
            Completed {format(new Date(assessment.completed_at), 'PPP')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{assessment.description || 'No description available'}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Scores</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div className="bg-secondary/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Focus</div>
                <div className="text-lg font-medium">{assessment.focus_level}/100</div>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Energy</div>
                <div className="text-lg font-medium">{assessment.energy_level}/100</div>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Emotional</div>
                <div className="text-lg font-medium">{assessment.emotional_state}/100</div>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Stress</div>
                <div className="text-lg font-medium">{assessment.stress_level}/100</div>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Creativity</div>
                <div className="text-lg font-medium">{assessment.creativity_score}/100</div>
              </div>
            </div>
          </div>
          
          {assessment.scoring_rationale && (
            <div>
              <h3 className="text-lg font-medium mb-2">Scoring Rationale</h3>
              <div className="whitespace-pre-line bg-muted p-4 rounded-lg text-sm">
                {assessment.scoring_rationale}
              </div>
            </div>
          )}
          
          {assessment.questions_asked && assessment.questions_asked.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Questions</h3>
              <div className="space-y-2">
                {assessment.questions_asked.map((question: any, index: number) => {
                  const response = assessment.responses_given?.[question.id];
                  return (
                    <div key={question.id} className="bg-muted p-3 rounded-lg">
                      <div className="font-medium">{index + 1}. {question.text}</div>
                      {response !== undefined && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Response: {response}
                        </div>
                      )}
                      {question.category && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Category: {question.category}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentDetail;
