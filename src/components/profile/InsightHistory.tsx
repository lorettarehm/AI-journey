
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserInsights } from './services/insightService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InsightHistoryProps {
  history: UserInsights[];
  className?: string;
}

const InsightHistory: React.FC<InsightHistoryProps> = ({ history, className = '' }) => {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  
  if (!history || history.length === 0) {
    return (
      <Card className={`${className} glass-card`}>
        <CardHeader>
          <CardTitle className="text-xl">Insight History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No insight history available yet. Complete an assessment to generate insights.</p>
        </CardContent>
      </Card>
    );
  }
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  return (
    <Card className={`${className} glass-card`}>
      <CardHeader>
        <CardTitle className="text-xl">Insight History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((insight) => (
            <div key={insight.id} className="border rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-accent/5"
                onClick={() => insight.id && toggleExpand(insight.id)}
              >
                <div>
                  <p className="font-medium">{insight.generalInsight}</p>
                  {insight.createdAt && (
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(insight.createdAt), 'dd/MM/yyyy - HH:mm')}
                    </p>
                  )}
                </div>
                <div>
                  {expandedId === insight.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              
              {expandedId === insight.id && (
                <div className="p-4 border-t bg-accent/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Strengths</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Area</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {insight.strengths.length > 0 ? (
                            insight.strengths.map((strength, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{strength.area}</TableCell>
                                <TableCell>{strength.description}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center">No strengths recorded</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Areas for Growth</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Area</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {insight.weaknesses.length > 0 ? (
                            insight.weaknesses.map((weakness, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{weakness.area}</TableCell>
                                <TableCell>{weakness.description}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center">No areas for growth recorded</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightHistory;
