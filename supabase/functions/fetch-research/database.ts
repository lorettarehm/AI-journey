
import { ResearchPaper, Technique } from './types.ts';
import { generateResearchPapers, extractTechniquesFromPaper, generateTechniqueMetadata, generateAdditionalTechniques } from './data-generators.ts';

// Function to get count of existing techniques
export async function getExistingTechniquesCount(supabase): Promise<number> {
  const { count, error } = await supabase
    .from('technique_recommendations')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    throw new Error(`Error counting techniques: ${error.message}`);
  }
  
  return count || 0;
}

// Function to fetch techniques with limit
export async function fetchTechniques(supabase, limit: number): Promise<any[]> {
  const { data, error } = await supabase
    .from('technique_recommendations')
    .select('*')
    .limit(limit);

  if (error) {
    throw new Error(`Error fetching techniques: ${error.message}`);
  }

  return data || [];
}

// Process and store research papers and their techniques
export async function processResearchPapers(supabase): Promise<void> {
  const researchPapers = generateResearchPapers();
  
  for (const paper of researchPapers) {
    // Check if paper already exists
    const existingPaper = await getPaperByTitle(supabase, paper.title);
    
    if (!existingPaper) {
      // Insert new paper
      const paperData = await insertPaper(supabase, paper);
      
      if (paperData) {
        // Extract and process techniques from the paper
        const techniques = extractTechniquesFromPaper(paper);
        await processTechniques(supabase, techniques, paperData[0].id);
      }
    }
  }
}

// Get paper by title
async function getPaperByTitle(supabase, title: string): Promise<any> {
  const { data, error } = await supabase
    .from('research_papers')
    .select('id')
    .eq('title', title)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking existing paper:', error);
  }

  return data;
}

// Insert paper into database
async function insertPaper(supabase, paper: ResearchPaper): Promise<any> {
  const { data, error } = await supabase
    .from('research_papers')
    .insert(paper)
    .select();

  if (error) {
    console.error('Error inserting paper:', error);
    return null;
  }

  return data;
}

// Process techniques from a paper
async function processTechniques(supabase, techniques: Technique[], paperId: string): Promise<void> {
  for (const technique of techniques) {
    // Check if technique already exists
    const existingTechnique = await getTechniqueByTitle(supabase, technique.title);
    
    if (!existingTechnique) {
      // Insert new technique
      const techniqueData = await insertTechnique(supabase, technique, paperId);
      
      if (techniqueData) {
        // Add metadata for the technique
        const metadata = generateTechniqueMetadata(technique);
        await insertTechniqueMetadata(supabase, metadata, techniqueData[0].id);
      }
    }
  }
}

// Get technique by title
async function getTechniqueByTitle(supabase, title: string): Promise<any> {
  const { data, error } = await supabase
    .from('research_techniques')
    .select('id')
    .eq('title', title)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking existing technique:', error);
  }

  return data;
}

// Insert technique into database
async function insertTechnique(supabase, technique: Technique, paperId: string): Promise<any> {
  const { data, error } = await supabase
    .from('research_techniques')
    .insert({
      ...technique,
      paper_id: paperId
    })
    .select();

  if (error) {
    console.error('Error inserting technique:', error);
    return null;
  }

  return data;
}

// Insert technique metadata
async function insertTechniqueMetadata(supabase, metadata: any, techniqueId: string): Promise<void> {
  const { error } = await supabase
    .from('technique_metadata')
    .insert({
      ...metadata,
      technique_id: techniqueId
    });

  if (error) {
    console.error('Error inserting metadata:', error);
  }
}

// Add additional techniques directly to recommendations
export async function addAdditionalTechniques(supabase): Promise<void> {
  const additionalTechniques = generateAdditionalTechniques();
  
  for (const technique of additionalTechniques) {
    // Check if technique already exists
    const existingTechnique = await getRecommendationByTitle(supabase, technique.title);
    
    if (!existingTechnique) {
      // Insert new technique recommendation
      await insertTechniqueRecommendation(supabase, technique);
    }
  }
}

// Get recommendation by title
async function getRecommendationByTitle(supabase, title: string): Promise<any> {
  const { data, error } = await supabase
    .from('technique_recommendations')
    .select('technique_id')
    .eq('title', title)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking existing technique:', error);
  }

  return data;
}

// Insert technique recommendation
async function insertTechniqueRecommendation(supabase, technique: Technique): Promise<void> {
  const { error } = await supabase
    .from('technique_recommendations')
    .insert(technique);

  if (error) {
    console.error('Error inserting technique:', error);
  }
}
