
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar } from 'lucide-react';
import AssessmentTable from './assessment/AssessmentTable';
import EmptyAssessment from './assessment/EmptyAssessment';

const AssessmentHistory = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const pageSize = 5; // Number of assessments per page

  const { data: assessmentData, isLoading } = useQuery({
    queryKey: ['assessmentHistory', user?.id, page],
    queryFn: async () => {
      if (!user) return { assessments: [], count: 0 };
      
      // First, get the total count
      const { count, error: countError } = await supabase
        .from('assessment_results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      if (countError) throw countError;
      
      // Then get the paginated data
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .range(from, to);
        
      if (error) throw error;
      
      return { 
        assessments: data || [], 
        count: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    },
    enabled: !!user,
  });

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (assessmentData && page < assessmentData.totalPages) {
      setPage(page + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-accent/10 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-accent/5 rounded"></div>
      </div>
    );
  }

  const { assessments = [], totalPages = 1 } = assessmentData || {};

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Calendar size={20} className="mr-2 text-accent" />
        Assessment History
      </h3>
      
      {assessments.length > 0 ? (
        <>
          <AssessmentTable assessments={assessments} />
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button 
                onClick={handlePrevPage} 
                disabled={page === 1}
                className={`px-4 py-2 rounded ${page === 1 ? 'bg-muted text-muted-foreground' : 'bg-accent/10 text-accent hover:bg-accent/20'}`}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button 
                onClick={handleNextPage} 
                disabled={page >= totalPages}
                className={`px-4 py-2 rounded ${page >= totalPages ? 'bg-muted text-muted-foreground' : 'bg-accent/10 text-accent hover:bg-accent/20'}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyAssessment />
      )}
    </div>
  );
};

export default AssessmentHistory;
