
import React from 'react';
import { format } from 'date-fns';
import FadeIn from '@/components/ui/FadeIn';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getStrengthsAndWeaknesses, getInsightHistory } from '@/components/profile/services/insightService';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import InsightHistory from '@/components/profile/InsightHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfileInsights = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch latest insights
  const { data: insights, isLoading, error } = useQuery({
    queryKey: ['userInsights', user?.id],
    queryFn: async () => {
      if (!user) return null;
      return getStrengthsAndWeaknesses(user.id);
    },
    enabled: !!user,
  });
  
  // Fetch insight history
  const { data: insightHistory = [] } = useQuery({
    queryKey: ['insightHistory', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return getInsightHistory(user.id);
    },
    enabled: !!user,
  });

  if (error) {
    console.error('Error fetching insights:', error);
  }

  return (
    <FadeIn delay={0.6}>
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 text-center">Your Neurodiversity Profile</h3>
        
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading your personalized insights...</p>
        ) : error ? (
          <div>
            <p className="text-center text-muted-foreground mb-4">
              We couldn't load your personalized insights. Please try again later.
            </p>
            <div className="flex justify-center">
              <button 
                className="btn-secondary" 
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            <Card className="glass-card max-w-4xl mx-auto mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Current Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground mb-6">
                  {insights?.generalInsight || 
                  "Based on your assessment data, we've identified your key strengths and areas where you might want to focus on improvement."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Strengths to Leverage</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Area</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {insights?.strengths.map((strength, index) => (
                          <TableRow key={index} className="hover:bg-accent/5">
                            <TableCell className="font-medium">{strength.area}</TableCell>
                            <TableCell>{strength.description}</TableCell>
                          </TableRow>
                        ))}
                        {(!insights || insights.strengths.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center text-muted-foreground">
                              Complete an assessment to see your strengths
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold mb-4">Areas for Growth</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Area</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {insights?.weaknesses.map((weakness, index) => (
                          <TableRow key={index} className="hover:bg-accent/5">
                            <TableCell className="font-medium">{weakness.area}</TableCell>
                            <TableCell>{weakness.description}</TableCell>
                          </TableRow>
                        ))}
                        {(!insights || insights.weaknesses.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center text-muted-foreground">
                              Complete an assessment to see your areas for growth
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div className="text-center mt-8">
                  <div className="inline-flex space-x-4">
                    <a href="/techniques" className="btn-primary">
                      View Recommended Techniques
                    </a>
                    <a href="/assessment" className="btn-secondary">Re-take Today's Assessment</a>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <InsightHistory 
              history={insightHistory} 
              className="max-w-4xl mx-auto mt-8" 
            />
          </>
        )}
      </div>
    </FadeIn>
  );
};

export default ProfileInsights;
