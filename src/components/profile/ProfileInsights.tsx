
import React from 'react';
import { format } from 'date-fns'; // Ensure date-fns is imported
import FadeIn from '@/components/ui/FadeIn';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getStrengthsAndWeaknesses } from '@/components/profile/services/insightService';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const ProfileInsights = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: insights, isLoading, error } = useQuery({
    queryKey: ['userInsights', user?.id],
    queryFn: async () => {
      if (!user) return null;
      return getStrengthsAndWeaknesses(user.id);
    },
    enabled: !!user,
  });

  if (error) {
    console.error('Error fetching insights:', error);
  }

  return (
    <FadeIn delay={0.6}>
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-4 text-center">Insights Based on Your Profile</h3>
        
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
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 text-center">
              {insights?.generalInsight || 
              "Based on your assessment data, we've identified your key strengths and areas where you might want to focus on improvement."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
              <div className="glass-card p-6 rounded-xl">
                <h4 className="text-xl font-semibold mb-4 text-center">Strengths to Leverage</h4>
                <Table>
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

              <div className="glass-card p-6 rounded-xl">
                <h4 className="text-xl font-semibold mb-4 text-center">Areas for Growth</h4>
                <Table>
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

            <div className="text-center">
              <div className="inline-flex space-x-4">
                <a href="/techniques" className="btn-primary">
                  View Recommended Techniques
                </a>
                <a href="/assessment" className="btn-secondary">Re-take Today's Assessment</a>
              </div>
            </div>
          </>
        )}
      </div>
    </FadeIn>
  );
};

export default ProfileInsights;
