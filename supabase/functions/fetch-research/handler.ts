
import { corsHeaders } from './cors.ts';
import { 
  getExistingTechniquesCount, 
  fetchTechniques,
  processResearchPapers,
  addAdditionalTechniques
} from './database.ts';

export async function handleRequest(req, supabase, corsHeaders) {
  const { searchQuery, limit = 50 } = await req.json();

  if (!searchQuery) {
    return new Response(
      JSON.stringify({ success: false, error: 'Search query is required' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
  
  // Check existing techniques count
  const existingCount = await getExistingTechniquesCount(supabase);
  
  if (existingCount >= 100) {
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Database already contains 100+ techniques, no new techniques added",
        count: existingCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Process research papers and techniques
  await processResearchPapers(supabase);
  await addAdditionalTechniques(supabase);

  // Fetch and return updated techniques
  const techniques = await fetchTechniques(supabase, limit);

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: techniques,
      count: techniques.length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
