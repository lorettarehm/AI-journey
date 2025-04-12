import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Set up Supabase client
const supabaseUrl = 'https://sjeaxjdujzdrlkkfdzjc.supabase.co'
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Type definitions
interface ResearchPaper {
  title: string;
  authors: string[];
  publication_date: string;
  journal: string;
  abstract: string;
}

interface Technique {
  title: string;
  description: string;
  target_condition: string[];
  effectiveness_score?: number;
  difficulty_level?: string;
  category?: string;
  keywords?: string[];
  evidence_strength?: string;
  implementation_steps?: string[];
  journal?: string;
  publication_date?: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  count?: number;
  message?: string;
}

// Main request handler
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchQuery, limit = 50 } = await req.json();

    if (!searchQuery) {
      return new Response(
        JSON.stringify({ success: false, error: 'Search query is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Check existing techniques count
    const existingCount = await getExistingTechniquesCount();
    
    if (existingCount >= 50) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Database already contains 50+ techniques, no new techniques added",
          count: existingCount
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process research papers and techniques
    await processResearchPapers();
    await addAdditionalTechniques();

    // Fetch and return updated techniques
    const techniques = await fetchTechniques(limit);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: techniques,
        count: techniques.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Function to get count of existing techniques
async function getExistingTechniquesCount(): Promise<number> {
  const { count, error } = await supabase
    .from('technique_recommendations')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    throw new Error(`Error counting techniques: ${error.message}`);
  }
  
  return count || 0;
}

// Function to fetch techniques with limit
async function fetchTechniques(limit: number): Promise<any[]> {
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
async function processResearchPapers(): Promise<void> {
  const researchPapers = generateResearchPapers();
  
  for (const paper of researchPapers) {
    // Check if paper already exists
    const existingPaper = await getPaperByTitle(paper.title);
    
    if (!existingPaper) {
      // Insert new paper
      const paperData = await insertPaper(paper);
      
      if (paperData) {
        // Extract and process techniques from the paper
        const techniques = extractTechniquesFromPaper(paper);
        await processTechniques(techniques, paperData[0].id);
      }
    }
  }
}

// Get paper by title
async function getPaperByTitle(title: string): Promise<any> {
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
async function insertPaper(paper: ResearchPaper): Promise<any> {
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
async function processTechniques(techniques: Technique[], paperId: string): Promise<void> {
  for (const technique of techniques) {
    // Check if technique already exists
    const existingTechnique = await getTechniqueByTitle(technique.title);
    
    if (!existingTechnique) {
      // Insert new technique
      const techniqueData = await insertTechnique(technique, paperId);
      
      if (techniqueData) {
        // Add metadata for the technique
        const metadata = generateTechniqueMetadata(technique);
        await insertTechniqueMetadata(metadata, techniqueData[0].id);
      }
    }
  }
}

// Get technique by title
async function getTechniqueByTitle(title: string): Promise<any> {
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
async function insertTechnique(technique: Technique, paperId: string): Promise<any> {
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
async function insertTechniqueMetadata(metadata: any, techniqueId: string): Promise<void> {
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
async function addAdditionalTechniques(): Promise<void> {
  const additionalTechniques = generateAdditionalTechniques();
  
  for (const technique of additionalTechniques) {
    // Check if technique already exists
    const existingTechnique = await getRecommendationByTitle(technique.title);
    
    if (!existingTechnique) {
      // Insert new technique recommendation
      await insertTechniqueRecommendation(technique);
    }
  }
}

// Get recommendation by title
async function getRecommendationByTitle(title: string): Promise<any> {
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
async function insertTechniqueRecommendation(technique: Technique): Promise<void> {
  const { error } = await supabase
    .from('technique_recommendations')
    .insert(technique);

  if (error) {
    console.error('Error inserting technique:', error);
  }
}

// Data generation functions
function generateTechniqueMetadata(technique: Technique): any {
  // Create metadata based on technique properties
  return {
    suitable_for_profiles: {
      age_ranges: ["adolescent", "adult"],
      severity_levels: ["mild", "moderate"]
    },
    contraindications: {
      conditions: technique.target_condition.includes('anxiety') ? 
        [] : ["severe_anxiety_during_implementation"]
    },
    related_techniques: []
  };
}

// Function to generate diverse research papers
function generateResearchPapers(): ResearchPaper[] {
  return [
    {
      title: "Cognitive Behavioral Therapy for ADHD: A Meta-Analysis",
      authors: ["Johnson, R.", "Thompson, L.", "Patel, S."],
      publication_date: "2023-02-18",
      journal: "Journal of Attention Disorders",
      abstract: "This meta-analysis examines the efficacy of cognitive behavioral therapy approaches for adults with ADHD, showing significant improvements in executive functioning and self-regulation."
    },
    {
      title: "Assistive Technology Interventions for Autism: A Systematic Review",
      authors: ["Zhang, Y.", "Wilson, K.", "Ahmed, N."],
      publication_date: "2023-01-10",
      journal: "Journal of Autism and Developmental Disorders",
      abstract: "This review evaluates digital and technological supports for individuals with autism spectrum disorder, highlighting effective interventions for communication and daily living skills."
    },
    {
      title: "The Role of Physical Exercise in Managing ADHD Symptoms",
      authors: ["Martinez, C.", "Brown, A.", "Nguyen, T."],
      publication_date: "2022-11-15",
      journal: "Neuroscience & Biobehavioral Reviews",
      abstract: "This article investigates how different forms of physical activity can help regulate attention, improve executive function, and reduce hyperactivity in individuals with ADHD."
    },
    {
      title: "Social Skills Training for Neurodivergent Adolescents",
      authors: ["Taylor, J.", "Singh, A.", "Lee, M."],
      publication_date: "2023-03-05",
      journal: "Journal of Child Psychology and Psychiatry",
      abstract: "An evaluation of structured social skills interventions for neurodivergent teens, showing improvements in peer relationships and communication abilities."
    },
    {
      title: "Time Management Strategies for Adults with Executive Function Challenges",
      authors: ["Robinson, D.", "Garcia, E.", "Williams, T."],
      publication_date: "2022-10-20",
      journal: "Journal of Applied Psychology",
      abstract: "This research evaluates various time management approaches for adults with executive function difficulties, identifying effective strategies for improving productivity and reducing stress."
    },
    {
      title: "Environmental Modifications for Sensory Regulation in Educational Settings",
      authors: ["Anderson, K.", "Murphy, S.", "Collins, R."],
      publication_date: "2023-04-12",
      journal: "Research in Developmental Disabilities",
      abstract: "This study explores how classroom environmental adaptations can support sensory regulation for students with autism and ADHD, improving focus and reducing anxiety."
    },
    {
      title: "Mindfulness-Based Interventions for Emotional Regulation in ADHD",
      authors: ["Kim, J.", "Peterson, H.", "Gonzalez, M."],
      publication_date: "2022-09-30",
      journal: "Journal of Clinical Psychology",
      abstract: "A randomized controlled trial of mindfulness programs for adults with ADHD, showing significant improvements in emotional regulation and reduced impulsivity."
    },
    {
      title: "Digital Organization Tools for Executive Dysfunction: A Comparative Analysis",
      authors: ["Wright, P.", "Sharma, R.", "Davis, L."],
      publication_date: "2023-02-28",
      journal: "Computers in Human Behavior",
      abstract: "This research evaluates the effectiveness of various digital tools and applications designed to support organization and planning for individuals with executive dysfunction."
    },
    {
      title: "Neurofeedback Training for Attention Regulation in ADHD",
      authors: ["Lopez, A.", "Chen, B.", "Miller, S."],
      publication_date: "2022-12-05",
      journal: "Applied Psychophysiology and Biofeedback",
      abstract: "This study examines the efficacy of neurofeedback protocols for improving sustained attention and reducing distractibility in children and adults with ADHD."
    },
    {
      title: "Structured Visual Supports for Autism: Beyond Visual Schedules",
      authors: ["Patel, A.", "Rodriguez, C.", "Iverson, J."],
      publication_date: "2023-01-25",
      journal: "Autism Research",
      abstract: "This research explores innovative visual support strategies for individuals with autism spectrum disorder, extending beyond traditional visual schedules to enhance communication and independence."
    },
    // New research papers
    {
      title: "Deep Pressure Stimulation for Anxiety in Neurodivergent Individuals",
      authors: ["Chen, M.", "Baker, L.", "Nichols, T."],
      publication_date: "2023-05-11",
      journal: "Journal of Neurodevelopmental Disorders",
      abstract: "A comprehensive analysis of deep pressure interventions for anxiety management in neurodivergent populations, with particular focus on portable and accessible solutions."
    },
    {
      title: "Music-Based Interventions for Enhancing Executive Function",
      authors: ["Ramirez, S.", "Johnson, K.", "Lee, H."],
      publication_date: "2023-06-22",
      journal: "Music Therapy Perspectives",
      abstract: "This study examines the effects of structured music activities on executive function skills in children and adults with ADHD and autism, showing promising improvements in working memory and cognitive flexibility."
    },
    {
      title: "Digital Habit Formation Tools for ADHD: A Longitudinal Study",
      authors: ["O'Connor, P.", "Williams, M.", "Patel, R."],
      publication_date: "2023-04-30",
      journal: "Journal of Technology in Mental Health",
      abstract: "An 18-month analysis of digital applications designed to support habit formation in adults with ADHD, identifying key design features that lead to sustainable behavioral change."
    }
  ];
}

// Helper function to extract techniques from papers
function extractTechniquesFromPaper(paper: ResearchPaper): Technique[] {
  const techniques = [];
  
  // Cognitive Behavioral Therapy techniques
  if (paper.title.includes("Cognitive Behavioral")) {
    techniques.push(
      {
        title: "Structured Problem-Solving Framework",
        description: "A step-by-step approach to breaking down complex problems into manageable components, identifying solutions, and evaluating outcomes specifically adapted for individuals with executive function challenges.",
        target_condition: ['adhd', 'executive dysfunction'],
        effectiveness_score: 0.82,
        difficulty_level: 'intermediate',
        category: 'organization',
        keywords: ['problem-solving', 'executive function', 'structured approach', 'decision-making'],
        evidence_strength: 'strong',
        implementation_steps: [
          "Identify and clearly define the specific problem",
          "Break down the problem into smaller components",
          "Brainstorm multiple potential solutions without judgment",
          "Evaluate each solution's pros and cons",
          "Select and implement the most promising solution",
          "Evaluate the outcome and adjust if necessary"
        ]
      },
      {
        title: "Cognitive Restructuring for Negative Thought Patterns",
        description: "A technique for identifying and challenging unhelpful thought patterns that contribute to anxiety, low self-esteem, and avoidance behaviors common in neurodivergent individuals.",
        target_condition: ['adhd', 'anxiety'],
        effectiveness_score: 0.79,
        difficulty_level: 'intermediate',
        category: 'focus',
        keywords: ['cognitive distortions', 'thought challenging', 'self-talk', 'reframing'],
        evidence_strength: 'strong',
        implementation_steps: [
          "Identify recurring negative thoughts and beliefs",
          "Record thoughts in a structured thought diary",
          "Identify cognitive distortions in thinking patterns",
          "Generate evidence for and against each thought",
          "Create balanced alternative perspectives",
          "Practice replacing distorted thoughts with balanced ones"
        ]
      }
    );
  }
  
  // Assistive Technology interventions
  if (paper.title.includes("Assistive Technology")) {
    techniques.push(
      {
        title: "Augmentative Communication Technology Integration",
        description: "A systematic approach to implementing and personalizing digital communication tools for individuals with communication challenges, focusing on consistency across environments.",
        target_condition: ['autism', 'communication disorders'],
        effectiveness_score: 0.88,
        difficulty_level: 'intermediate',
        category: 'social',
        keywords: ['AAC', 'digital communication', 'speech support', 'non-verbal'],
        evidence_strength: 'strong',
        implementation_steps: [
          "Assess individual communication needs and abilities",
          "Select appropriate technology based on assessment",
          "Customize vocabulary and interface for relevance",
          "Create implementation plan across all environments",
          "Train all communication partners consistently",
          "Establish regular review and update schedule"
        ]
      },
      {
        title: "Executive Function App Ecosystem",
        description: "A coordinated system of digital tools to support planning, time management, and organization, with integration across platforms to create a comprehensive support system.",
        target_condition: ['adhd', 'executive dysfunction'],
        effectiveness_score: 0.84,
        difficulty_level: 'beginner',
        category: 'organization',
        keywords: ['digital planning', 'reminders', 'task management', 'synchronization'],
        evidence_strength: 'moderate',
        implementation_steps: [
          "Identify specific executive function challenges",
          "Select core digital calendar/task management system",
          "Add complementary tools for reminders and time tracking",
          "Set up cross-platform synchronization",
          "Create recurring maintenance routine",
          "Implement progressive notification system"
        ]
      }
    );
  }
  
  // Physical Exercise interventions
  if (paper.title.includes("Physical Exercise")) {
    techniques.push(
      {
        title: "High-Intensity Interval Training for ADHD",
        description: "A structured exercise protocol alternating between intense activity bursts and recovery periods, specifically designed to optimize dopamine regulation and executive function in individuals with ADHD.",
        target_condition: ['adhd'],
        effectiveness_score: 0.76,
        difficulty_level: 'intermediate',
        category: 'focus',
        keywords: ['exercise', 'physical activity', 'dopamine', 'regulation'],
        evidence_strength: 'moderate',
        implementation_steps: [
          "Begin with appropriate medical clearance",
          "Start with 5-minute warm-up of light activity",
          "Perform 30 seconds of high-intensity exercise",
          "Recovery period of 90 seconds of light activity",
          "Repeat for 4-8 cycles depending on fitness level",
          "Cool down with 5 minutes of stretching",
          "Perform 3 times per week, preferably before demanding cognitive tasks"
        ]
      },
      {
        title: "Rhythmic Movement Integration",
        description: "A daily practice combining rhythmic physical movements with cognitive challenges to improve neural integration, attention control, and sensory processing.",
        target_condition: ['adhd', 'autism', 'sensory processing'],
        effectiveness_score: 0.72,
        difficulty_level: 'beginner',
        category: 'sensory',
        keywords: ['rhythm', 'coordination', 'bilateral integration', 'movement'],
        evidence_strength: 'moderate',
        implementation_steps: [
          "Start with simple cross-lateral movements (e.g., touching opposite elbow to knee)",
          "Practice basic rhythmic patterns following a beat",
          "Gradually add cognitive elements (counting, reciting)",
          "Incorporate balance challenges",
          "Practice for 10-15 minutes daily",
          "Progress to more complex movement sequences"
        ]
      }
    );
  }
  
  // Social Skills Training
  if (paper.title.includes("Social Skills")) {
    techniques.push(
      {
        title: "Social Scripts with Flexible Response Mapping",
        description: "A structured method for learning and practicing social interactions through prepared scripts with branching response options, helping to build social confidence and flexibility.",
        target_condition: ['autism', 'social anxiety'],
        effectiveness_score: 0.85,
        difficulty_level: 'beginner',
        category: 'social',
        keywords: ['social interaction', 'communication', 'scripts', 'flexibility'],
        evidence_strength: 'strong',
        implementation_steps: [
          "Identify specific challenging social situations",
          "Create base scripts for common interactions",
          "Develop multiple response options for each interaction point",
          "Practice with trusted support person",
          "Role-play with increasing variation",
          "Gradually implement in low-stress real situations",
          "Debrief and refine after each real-world practice"
        ]
      },
      {
        title: "Incremental Exposure Hierarchy for Social Situations",
        description: "A gradual approach to building confidence in social settings through carefully planned exposure to increasingly challenging social scenarios with specific goals and supports.",
        target_condition: ['autism', 'social anxiety', 'adhd'],
        effectiveness_score: 0.79,
        difficulty_level: 'intermediate',
        category: 'social',
        keywords: ['exposure therapy', 'anxiety reduction', 'social confidence', 'hierarchy'],
        evidence_strength: 'strong',
        implementation_steps: [
          "List social situations from least to most challenging",
          "Identify specific anxiety triggers in each situation",
          "Create concrete success criteria for each exposure",
          "Begin with easiest situation with supports",
          "Practice coping strategies before each exposure",
          "Gradually move up hierarchy as comfort develops",
          "Celebrate and document each successful step"
        ]
      }
    );
  }
  
  // Time Management Strategies
  if (paper.title.includes("Time Management")) {
    techniques.push(
      {
        title: "Time Blocking with Visual Boundaries",
        description: "A comprehensive time management approach combining pre-scheduled time blocks with visual and environmental cues to enhance time perception and task completion.",
        target_condition: ['adhd', 'executive dysfunction'],
        effectiveness_score: 0.86,
        difficulty_level: 'beginner',
        category: 'organization',
        keywords: ['time management', 'scheduling', 'visual cues', 'boundaries'],
        evidence_strength: 'strong',
        implementation_steps: [
          "Assess realistic task duration times (adding 50% buffer)",
          "Create a visual template for daily/weekly schedule",
          "Pre-schedule recurring blocks for essential activities",
          "Establish visual environmental markers for each type of task",
          "Set up transition alerts 5 minutes before block changes",
          "Implement physical environment changes for different blocks",
          "Review and adjust block allocations weekly"
        ]
      },
      {
        title: "Time Perception Training Protocol",
        description: "A systematic program to improve internal time awareness through regular exercises and calibration activities, helping individuals better estimate and manage time intervals.",
        target_condition: ['adhd', 'time blindness'],
        effectiveness_score: 0.74,
        difficulty_level: 'intermediate',
        category: 'organization',
        keywords: ['time perception', 'time estimation', 'temporal awareness', 'calibration'],
        evidence_strength: 'moderate',
        implementation_steps: [
          "Practice daily time estimation exercises (guessing elapsed time)",
          "Use analog timers for visual time representation",
          "Create personal time benchmarks for common activities",
          "Implement regular time check-ins during tasks",
          "Record and review actual vs. estimated task durations",
          "Gradually extend time periods between external clock checks",
          "Use body-based cues (breathing, movement) as time markers"
        ]
      }
    );
  }
  
  // Environmental Modifications
  if (paper.title.includes("Environmental Modifications")) {
    techniques.push(
      {
        title: "Sensory Zoning System",
        description: "A comprehensive approach to organizing living or working spaces into distinct sensory zones with consistent sensory profiles, allowing for intentional modulation of sensory input.",
        target_condition: ['autism', 'sensory processing', 'adhd'],
        effectiveness_score: 0.87,
        difficulty_level: 'intermediate',
        category: 'sensory',
        keywords: ['sensory environment', 'zones', 'spatial organization', 'sensory mapping'],
        evidence_strength: 'strong',
        implementation_steps: [
          "Conduct personal sensory profile assessment",
          "Map existing environments for sensory characteristics",
          "Designate specific zones for different sensory needs",
          "Create clear visual and physical boundaries between zones",
          "Design high-arousal, neutral, and calming zones",
          "Implement consistent sensory features within each zone",
          "Create transition protocols between different zones"
        ]
      },
      {
        title: "Acoustic Environment Optimization",
        description: "A targeted approach to identifying and modifying sound environments to reduce auditory distractions and sensory overload while enhancing helpful auditory input.",
        target_condition: ['autism', 'adhd', 'sensory processing'],
        effectiveness_score: 0.82,
        difficulty_level: 'beginner',
        category: 'sensory',
        keywords: ['acoustics', 'sound sensitivity', 'auditory environment', 'noise reduction'],
        evidence_strength: 'strong',
        implementation_steps: [
          "Conduct auditory sensitivity assessment",
          "Create sound map of environments",
          "Identify specific distracting sound sources",
          "Implement targeted acoustic modifications (sound absorption panels, white noise)",
          "Establish protocols for different auditory needs (headphones, quiet zones)",
          "Create personalized auditory focus tools (playlists, sound masking)",
          "Develop transition supports between different acoustic environments"
        ]
      }
    );
  }
  
  // Mindfulness-Based Interventions
  if (paper.title.includes("Mindfulness-Based")) {
    techniques.push(
      {
        title: "ADHD-Adapted Mindfulness Protocol",
        description: "A modified mindfulness practice specifically designed for individuals with attention difficulties, using shorter sessions, more guidance, and movement integration.",
        target_condition: ['adhd', 'anxiety'],
        effectiveness_score: 0.75,
        difficulty_level: 'beginner',
        category: 'focus',
        keywords: ['mindfulness', 'attention training', 'present moment', 'meditation'],
        evidence_strength: 'strong',
        implementation_steps: [
          "Begin with ultra-short (2-minute) guided practices",
          "Incorporate movement as attention anchor",
          "Use novel attention anchors on rotation",
          "Practice with environmental distractions gradually introduced",
          "Implement 'attention shifting' rather than sustained focus",
          "Add specialized 'thought labeling' for ADHD thought patterns",
          "Gradually extend duration as skills develop"
        ]
      },
      {
        title: "Emotional Awareness and Regulation Framework",
        description: "A structured approach to identifying emotional states and implementing specific regulation strategies, building emotional self-awareness and resilience.",
        target_condition: ['adhd', 'autism', 'emotional dysregulation'],
        effectiveness_score: 0.81,
        difficulty_level: 'intermediate',
        category: 'focus',
        keywords: ['emotional regulation', 'self-awareness', 'coping strategies', 'emotional literacy'],
        evidence_strength: 'strong',
        implementation_steps: [
          "Create personalized emotional vocabulary",
          "Develop body-sensation map for emotional states",
          "Establish early-warning system for emotional escalation",
          "Match regulation strategies to specific emotional states",
          "Practice emotion identification in low-stress situations",
          "Implement regular emotional check-ins",
          "Develop situation-specific coping plans"
        ]
      }
    );
  }
  
  // Digital Organization Tools
  if (paper.title.includes("Digital Organization")) {
    techniques.push(
      {
        title: "External Memory System Implementation",
        description: "A comprehensive approach to creating reliable external memory and information management systems using digital tools, reducing cognitive load and executive function demands.",
        target_condition: ['adhd', 'executive dysfunction'],
        effectiveness_score: 0.89,
        difficulty_level: 'beginner',
        category: 'organization',
        keywords: ['external memory', 'information management', 'digital systems', 'cognitive offloading'],
        evidence_strength: 'strong',
        implementation_steps: [
          "Select primary digital capture tool (notes app, voice recorder)",
          "Establish consistent information processing routine",
          "Create standardized organizational structure across devices",
          "Implement automated backup and synchronization",
          "Develop contextual tagging system",
          "Set up regular review and maintenance schedule",
          "Create retrieval practice exercises"
        ]
      },
      {
        title: "Virtual Body Doubling System",
        description: "A structured approach to implementing virtual accountability through scheduled co-working sessions, specifically designed to enhance task initiation and completion.",
        target_condition: ['adhd', 'task avoidance'],
        effectiveness_score: 0.78,
        difficulty_level: 'beginner',
        category: 'organization',
        keywords: ['accountability', 'body doubling', 'task initiation', 'co-working'],
        evidence_strength: 'moderate',
        implementation_steps: [
          "Identify tasks that benefit from external accountability",
          "Select appropriate body doubling format (live video, recorded session, app)",
          "Create structured session format with clear start/end",
          "Establish pre-session task planning routine",
          "Implement check-in points during longer sessions",
          "Develop specific transition support to independent work",
          "Create post-session review process"
        ]
      }
    );
  }
  
  // Neurofeedback Training
  if (paper.title.includes("Neurofeedback")) {
    techniques.push(
      {
        title: "Attention State Recognition Training",
        description: "A practical approach to developing awareness of attention states through systematic observation and recording, building metacognitive skills for attention management.",
        target_condition: ['adhd'],
        effectiveness_score: 0.72,
        difficulty_level: 'intermediate',
        category: 'focus',
        keywords: ['metacognition', 'attention awareness', 'self-monitoring', 'state recognition'],
        evidence_strength: 'moderate',
        implementation_steps: [
          "Learn to identify different attention states (hyperfocus, scattered, foggy, etc.)",
          "Create personalized attention state vocabulary",
          "Practice recognition through regular check-ins",
          "Implement physical anchors for state identification",
          "Develop transition strategies between different states",
          "Match tasks to optimal attention states when possible",
          "Create recovery protocols for non-optimal states"
        ]
      },
      {
        title: "Progressive Attention Span Development",
        description: "A systematic method for gradually extending focus duration through structured practice sessions with increasing duration and complexity.",
        target_condition: ['adhd', 'attention deficits'],
        effectiveness_score: 0.76,
        difficulty_level: 'beginner',
        category: 'focus',
        keywords: ['attention span', 'focus training', 'progressive training', 'sustained attention'],
        evidence_strength: 'moderate',
        implementation_steps: [
          "Establish current baseline attention span",
          "Create graduated series of focus activities with clear stopping points",
          "Begin with high-interest tasks slightly below baseline duration",
          "Implement visual timers with incremental increases",
          "Add systematic distractions as skills improve",
          "Record and celebrate progressive improvements",
          "Transfer skills from practice to functional tasks"
        ]
      }
    );
  }
  
  // Visual Supports
  if (paper.title.includes("Visual Supports")) {
    techniques.push(
      {
        title: "Visual Task Deconstruction System",
        description: "A comprehensive method for breaking down complex tasks into visually-represented steps, reducing executive function demands and supporting task completion.",
        target_condition: ['autism', 'executive dysfunction', 'adhd'],
        effectiveness_score: 0.91,
        difficulty_level: 'beginner',
        category: 'organization',
        keywords: ['visual supports', 'task analysis', 'sequential processing', 'independence'],
        evidence_strength: 'strong',
        implementation_steps: [
          "Select high-priority complex tasks for breakdown",
          "Create step-by-step visual representation (photos, icons, etc.)",
          "Include decision points and contingency options",
          "Add visual cues for potential challenges",
          "Incorporate progress tracking element",
          "Test and refine with user feedback",
          "Create digital and portable versions"
        ]
      },
      {
        title: "Visual Context Preparation Protocol",
        description: "A structured method for using visual supports to prepare for transitions and new environments, reducing anxiety and supporting successful adaptation.",
        target_condition: ['autism', 'anxiety', 'adhd'],
        effectiveness_score: 0.85,
        difficulty_level: 'beginner',
        category: 'sensory',
        keywords: ['transitions', 'visual preparation', 'environmental preview', 'anxiety reduction'],
        evidence_strength: 'strong',
        implementation_steps: [
          "Identify challenging transitions or new environments",
          "Gather visual information about the environment (photos, maps, videos)",
          "Create structured visual preview with key elements highlighted",
          "Develop visual schedule for the transition process",
          "Include sensory information and coping options",
          "Review visual materials repeatedly before transition",
          "Create portable version for reference during transition"
        ]
      }
    );
  }
  
  // Deep Pressure Stimulation
  if (paper.title.includes("Deep Pressure Stimulation")) {
    techniques.push(
      {
        title: "Portable Deep Pressure Protocol",
        description: "A systematic approach to implementing portable deep pressure interventions for anxiety management in daily life situations.",
        target_condition: ['autism', 'anxiety', 'sensory processing'],
        effectiveness_score: 0.83,
        difficulty_level: 'beginner',
        category: 'sensory',
        keywords: ['deep pressure', 'anxiety management', 'sensory intervention', 'self-regulation'],
        evidence_strength: 'strong',
        implementation_steps: [
          "Complete sensory preference assessment for pressure intensity",
          "Select appropriate portable tools (weighted items, compression garments)",
          "Develop individualized application schedule",
          "Identify anxiety escalation signals as intervention triggers",
          "Create discrete application methods for public settings",
          "Establish intensity progression protocol",
          "Track effectiveness using standardized anxiety scale"
        ]
      },
      {
        title: "Environmental Deep Pressure Integration",
        description: "A comprehensive approach to incorporating deep pressure elements into home and work environments for ongoing sensory regulation support.",
        target_condition: ['autism', 'sensory processing', 'anxiety'],
        effectiveness_score: 0.78,
        difficulty_level: 'intermediate',
        category: 'sensory',
        keywords: ['environmental design', 'sensory integration', 'home adaptation', 'pressure elements'],
        evidence_strength: 'moderate',
        implementation_steps: [
          "Conduct environmental assessment of primary living/working spaces",
          "Identify key locations for deep pressure integration",
          "Select appropriate permanent fixtures (seating, sleep systems)",
          "Create designated high-pressure retreat spaces",
          "Establish transition routines between pressure zones",
          "Incorporate both passive and active pressure options",
          "Develop maintenance schedule for pressure equipment"
        ]
      }
    );
  }
  
  // Music-Based Interventions
  if (paper.title.includes("Music-Based Interventions")) {
    techniques.push(
      {
        title: "Structured Rhythmic Entrainment Protocol",
        description: "A systematic approach using rhythmic musical activities to improve executive function, attention, and self-regulation through progressive complexity.",
        target_condition: ['adhd', 'executive dysfunction'],
        effectiveness_score: 0.81,
        difficulty_level: 'beginner',
        category: 'focus',
        keywords: ['rhythm', 'music therapy', 'entrainment', 'attention training'],
        evidence_strength: 'moderate',
        implementation_steps: [
          "Establish baseline rhythmic synchronization ability",
          "Begin with simple, consistent beat-keeping activities",
          "Progressively introduce rhythmic variation and complexity",
          "Incorporate cross-body movements to rhythmic patterns",
          "Add cognitive tasks during rhythmic maintenance",
          "Transfer rhythmic structure to non-musical tasks",
          "Develop personal rhythmic anchors for focus support"
        ]
      },
      {
        title: "Personalized Auditory Working Memory System",
        description: "A music-based approach to strengthening working memory capacity through structured musical pattern recognition and reproduction activities.",
        target_condition: ['adhd', 'autism', 'working memory deficits'],
        effectiveness_score: 0.76,
        difficulty_level: 'intermediate',
        category: 'focus',
        keywords: ['working memory', 'musical patterns', 'auditory processing', 'sequential memory'],
        evidence_strength: 'moderate',
        implementation_steps: [
          "Assess baseline musical pattern recognition ability",
          "Create progressive sequence of pattern complexity",
          "Begin with short melodic/rhythmic patterns for reproduction",
          "Gradually extend pattern length and complexity",
          "Add verbal elements to musical patterns",
          "Implement transfer exercises to non-musical content",
          "Create personalized musical working memory exercises"
        ]
      }
    );
  }
  
  // Digital Habit Formation
  if (paper.title.includes("Digital Habit Formation")) {
    techniques.push(
      {
        title: "Micro-Habit Installation Protocol",
        description: "A structured approach to developing sustainable habits through ultra-small behavioral targets with digital tracking and reinforcement.",
        target_condition: ['adhd', 'executive dysfunction'],
        effectiveness_score: 0.85,
        difficulty_level: 'beginner',
        category: 'organization',
        keywords: ['habit formation', 'micro-habits', 'digital tracking', 'consistency'],
        evidence_strength: 'moderate',
        implementation_steps: [
          "Select high-impact behavior domains for improvement",
          "Define micro-habits (1-2 minute behaviors)",
          "Identify precise implementation triggers",
          "Set up digital tracking with immediate feedback",
          "Create consistent reinforcement schedule",
          "Implement progressive scaling of habit complexity",
          "Establish recovery protocols for missed days"
        ]
      },
      {
        title: "Context-Based Digital Reminder System",
        description: "A comprehensive approach to creating context-aware digital reminders that support habit formation through environmentally-triggered cues.",
        target_condition: ['adhd', 'working memory deficits'],
        effectiveness_score: 0.79,
        difficulty_level: 'beginner',
        category: 'organization',
        keywords: ['reminders', 'context awareness', 'environmental cues', 'location-based'],
        evidence_strength: 'moderate',
        implementation_steps: [
          "Identify key contexts for habit implementation",
          "Set up location/time/activity-based triggers",
          "Create progressive reminder reduction schedule",
          "Implement variable reinforcement model",
          "Develop context-specific reminder formats",
          "Create data visualization of context-behavior patterns",
          "Adjust reminders based on adherence data"
        ]
      }
    );
  }
  
  return techniques;
}

// Function to generate additional techniques
function generateAdditionalTechniques(): Technique[] {
  return [
    {
      title: "Metacognitive Error Monitoring System",
      description: "A systematic approach to developing personalized error awareness and correction strategies, particularly helpful for individuals who struggle with overlooked details and careless errors.",
      target_condition: ['adhd', 'executive dysfunction'],
      effectiveness_score: 0.87,
      difficulty_level: 'intermediate',
      category: 'focus',
      keywords: ['error awareness', 'self-monitoring', 'correction strategies', 'metacognition'],
      evidence_strength: 'moderate',
      implementation_steps: [
        "Create personalized error profile through task analysis",
        "Develop specific checklists for high-error-risk activities",
        "Implement structured pauses at strategic points",
        "Practice verbalization of checking process",
        "Create visual reminders of common error types",
        "Set up environmental modifications to support accuracy",
        "Track error patterns to identify improvement areas"
      ]
    },
    {
      title: "Sensory Transition Preparation Protocol",
      description: "A comprehensive approach to reducing sensory overwhelm during environment changes through pre-exposure, simulation, and graduated exposure strategies.",
      target_condition: ['autism', 'sensory processing', 'anxiety'],
      effectiveness_score: 0.83,
      difficulty_level: 'beginner',
      category: 'sensory',
      keywords: ['transitions', 'sensory preparation', 'environmental adaptation', 'exposure'],
      evidence_strength: 'strong',
      implementation_steps: [
        "Identify challenging sensory transition points",
        "Create sensory preview materials (audio recordings, photos)",
        "Practice with graduated exposure exercises",
        "Develop transition timing adjustments",
        "Create pre-transition calming routine",
        "Implement post-transition sensory recovery protocol",
        "Use transition objects for sensory consistency"
      ]
    },
    {
      title: "Hyperfocus Channeling Technique",
      description: "A structured approach to productively directing intense focus states toward meaningful activities while maintaining awareness and preventing negative hyperfocus consequences.",
      target_condition: ['adhd'],
      effectiveness_score: 0.78,
      difficulty_level: 'intermediate',
      category: 'focus',
      keywords: ['hyperfocus', 'flow state', 'productivity', 'attention management'],
      evidence_strength: 'moderate',
      implementation_steps: [
        "Identify personal hyperfocus triggers and patterns",
        "Create environment optimized for positive hyperfocus",
        "Set up boundary timers with physical interruptions",
        "Develop re-entry transitions for after hyperfocus",
        "Create pre-hyperfocus preparation checklist",
        "Establish physical need reminders (hydration, movement)",
        "Implement post-hyperfocus recovery protocol"
      ]
    },
    {
      title: "Rejection Sensitivity Management Framework",
      description: "A comprehensive approach to identifying, preparing for, and processing perceived social rejection for individuals with rejection sensitive dysphoria.",
      target_condition: ['adhd', 'anxiety', 'rejection sensitivity'],
      effectiveness_score: 0.82,
      difficulty_level: 'intermediate',
      category: 'social',
      keywords: ['rejection sensitivity', 'emotional regulation', 'social anxiety', 'resilience'],
      evidence_strength: 'moderate',
      implementation_steps: [
        "Develop personal rejection sensitivity profile",
        "Create cognitive scripts for reframing rejection thoughts",
        "Establish grounding techniques for emotional intensity",
        "Implement graduated exposure to mild rejection scenarios",
        "Develop delay protocol for responding when triggered",
        "Create social support activation plan",
        "Practice self-compassion exercises for rejection events"
      ]
    },
    {
      title: "Tactile Grounding System",
      description: "A specialized approach using tactile sensory tools to maintain focus, regulate arousal, and provide sensory input for individuals with sensory seeking needs.",
      target_condition: ['adhd', 'autism', 'sensory processing'],
      effectiveness_score: 0.84,
      difficulty_level: 'beginner',
      category: 'sensory',
      keywords: ['fidgets', 'tactile input', 'sensory tools', 'grounding techniques'],
      evidence_strength: 'strong',
      implementation_steps: [
        "Conduct tactile preference assessment",
        "Create personalized tactile tool kit",
        "Establish specific tool-situation pairings",
        "Develop socially appropriate access methods",
        "Implement rotation schedule to maintain effectiveness",
        "Create tactile anchor points in primary environments",
        "Develop transition protocol for different settings"
      ]
    },
    {
      title: "Split-Task Attention Protocol",
      description: "A specialized approach for managing sustained attention challenges by alternating between different tasks in structured intervals, leveraging novelty to maintain focus.",
      target_condition: ['adhd', 'attention deficits'],
      effectiveness_score: 0.76,
      difficulty_level: 'intermediate',
      category: 'focus',
      keywords: ['task switching', 'attention management', 'novelty', 'productivity'],
      evidence_strength: 'moderate',
      implementation_steps: [
        "Identify compatible task pairs for alternation",
        "Establish optimal task switching intervals",
        "Create distinct environmental setups for each task",
        "Implement transition signals and routines",
        "Use physical movement during task transitions",
        "Develop progress tracking for each task stream",
        "Adjust intervals based on performance data"
      ]
    },
    {
      title: "Non-Linear Project System",
      description: "A flexible approach to project management that accommodates variable focus, energy levels, and interest through modular project components and non-sequential execution.",
      target_condition: ['adhd', 'executive dysfunction'],
      effectiveness_score: 0.81,
      difficulty_level: 'intermediate',
      category: 'organization',
      keywords: ['project management', 'non-linear', 'modular tasks', 'flexibility'],
      evidence_strength: 'moderate',
      implementation_steps: [
        "Break projects into independent, completable modules",
        "Create multiple entry point options for each project",
        "Develop clear documentation of module interdependencies",
        "Implement visual tracking of module completion",
        "Create energy/interest-based module selection protocol",
        "Develop momentum-building sequence suggestions",
        "Establish completion rituals for maintaining motivation"
      ]
    },
    {
      title: "Narrative Memory System",
      description: "A technique for transforming abstract or detailed information into narrative structures that leverage episodic memory strengths common in many neurodivergent individuals.",
      target_condition: ['adhd', 'autism', 'learning disabilities'],
      effectiveness_score: 0.85,
      difficulty_level: 'beginner',
      category: 'focus',
      keywords: ['memory', 'storytelling', 'information processing', 'visualization'],
      evidence_strength: 'moderate',
      implementation_steps: [
        "Identify information requiring enhanced retention",
        "Create narrative framework with emotional elements",
        "Develop vivid sensory details for key information",
        "Implement character/setting associations for concepts",
        "Practice regular narrative review and elaboration",
        "Create illustrative elements to enhance retention",
        "Develop retrieval practice using narrative cues"
      ]
    },
    {
      title: "Energy-Matched Task Allocation System",
      description: "A comprehensive approach to matching tasks to predictable energy patterns, leveraging peak periods and accommodating low-energy phases in daily planning.",
      target_condition: ['adhd', 'chronic fatigue', 'executive dysfunction'],
      effectiveness_score: 0.88,
      difficulty_level: 'beginner',
      category: 'organization',
      keywords: ['energy management', 'task allocation', 'productivity', 'pacing'],
      evidence_strength: 'strong',
      implementation_steps: [
        "Track energy patterns across days/weeks",
        "Categorize tasks by cognitive/energy demands",
        "Create energy-based task allocation template",
        "Develop backup plans for unexpected energy fluctuations",
        "Implement energy conservation protocols",
        "Create transition buffers between high-demand tasks",
        "Establish renewal activities for energy replenishment"
      ]
    },
    {
      title: "Specialized Interest Bridging Protocol",
      description: "A structured method for connecting specialized interests to academic, professional, or functional skill development, leveraging intrinsic motivation and existing knowledge structures.",
      target_condition: ['autism', 'adhd'],
      effectiveness_score: 0.89,
      difficulty_level: 'intermediate',
      category: 'focus',
      keywords: ['special interests', 'motivation', 'skill transfer', 'engagement'],
      evidence_strength: 'strong',
      implementation_steps: [
        "Document detailed aspects of specialized interests",
        "Identify skill targets for development",
        "Create explicit connections between interest and skills",
        "Develop graduated challenge sequence using interest context",
        "Implement regular reflection on skill transferability",
        "Create social sharing opportunities for interest-based work",
        "Develop branching interests through structured exploration"
      ]
    }
  ];
}
