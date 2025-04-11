
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

// List of research APIs to fetch from (example sources)
const RESEARCH_APIS = [
  {
    name: 'PubMed',
    url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi',
    queryParams: (query: string) => `?db=pubmed&term=${query}&retmode=json&retmax=10&sort=relevance`,
    resultExtractor: (data: any) => data.esearchresult.idlist,
  },
  // Add more research APIs as needed
]

// Define API response type
interface ApiResponse {
  success: boolean
  data?: any
  error?: string
}

// Handle HTTP request
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchQuery, limit = 10 } = await req.json()

    if (!searchQuery) {
      return new Response(
        JSON.stringify({ success: false, error: 'Search query is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Fetch papers from research APIs - in a real implementation, you would
    // use actual API credentials and proper error handling
    
    // For demo purposes, we'll insert some sample data
    const samplePapers = [
      {
        title: "Mindfulness-Based Cognitive Therapy for ADHD: A Systematic Review",
        authors: ["Smith, J.", "Johnson, A.", "Williams, B."],
        publication_date: "2023-03-15",
        journal: "Journal of Attention Disorders",
        abstract: "This systematic review examines the efficacy of mindfulness-based cognitive therapy for adults with ADHD, showing promising results in reducing core symptoms.",
        doi: "10.1177/10870547231234567",
        url: "https://example.com/journal/adhd-mindfulness",
      },
      {
        title: "Sensory Processing Interventions for Autism Spectrum Disorder",
        authors: ["Chen, L.", "Garcia, M.", "Taylor, S."],
        publication_date: "2023-02-10",
        journal: "Journal of Autism and Developmental Disorders",
        abstract: "This research evaluates various sensory processing interventions for individuals with autism spectrum disorder, identifying effective approaches for different sensory profiles.",
        doi: "10.1007/s10803-023-5678-9",
        url: "https://example.com/journal/autism-sensory",
      },
      {
        title: "Executive Function Training in Neurodivergent Children",
        authors: ["Brown, K.", "Lee, H.", "Robinson, P."],
        publication_date: "2023-01-20",
        journal: "Developmental Cognitive Neuroscience",
        abstract: "A controlled study of executive function training techniques in children with ADHD and autism, showing significant improvements in task switching and working memory.",
        doi: "10.1016/j.dcn.2023.101234",
        url: "https://example.com/journal/executive-function",
      }
    ]

    // Store papers in database
    for (const paper of samplePapers) {
      const { data: existingPaper, error: checkError } = await supabase
        .from('research_papers')
        .select('id')
        .eq('title', paper.title)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing paper:', checkError)
        continue
      }

      if (!existingPaper) {
        const { data: paperData, error: insertError } = await supabase
          .from('research_papers')
          .insert(paper)
          .select()

        if (insertError) {
          console.error('Error inserting paper:', insertError)
          continue
        }

        // Extract techniques from the paper (in a real implementation, 
        // this would use an AI model to analyze the paper)
        const techniques = extractTechniquesFromPaper(paper)
        
        for (const technique of techniques) {
          const { data: techniqueData, error: techniqueError } = await supabase
            .from('research_techniques')
            .insert({
              ...technique,
              paper_id: paperData[0].id
            })
            .select()

          if (techniqueError) {
            console.error('Error inserting technique:', techniqueError)
            continue
          }

          // Add metadata for the technique
          const metadata = generateTechniqueMetadata(technique)
          const { error: metadataError } = await supabase
            .from('technique_metadata')
            .insert({
              ...metadata,
              technique_id: techniqueData[0].id
            })

          if (metadataError) {
            console.error('Error inserting metadata:', metadataError)
          }
        }
      }
    }

    // Fetch techniques from the database
    const { data: techniques, error: fetchError } = await supabase
      .from('technique_recommendations')
      .select('*')
      .limit(limit)

    if (fetchError) {
      throw new Error(`Error fetching techniques: ${fetchError.message}`)
    }

    return new Response(
      JSON.stringify({ success: true, data: techniques }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Helper function to extract techniques from papers (mock implementation)
function extractTechniquesFromPaper(paper: any): any[] {
  // In a real implementation, this would use an AI model to extract techniques
  // For demo purposes, we'll return sample techniques based on the paper title
  if (paper.title.includes('Mindfulness')) {
    return [{
      title: "Mindfulness Meditation for ADHD",
      description: "A structured mindfulness practice specifically adapted for individuals with ADHD to improve attention regulation and reduce impulsivity.",
      target_condition: ['adhd'],
      effectiveness_score: 0.78,
      difficulty_level: 'intermediate',
      category: 'focus',
      keywords: ['mindfulness', 'meditation', 'attention', 'impulsivity'],
      evidence_strength: 'moderate',
      implementation_steps: [
        "Start with short 5-minute sessions",
        "Focus on breath awareness",
        "Gradually increase duration as comfort develops",
        "Practice body scan techniques",
        "Apply mindful awareness to daily activities"
      ]
    }]
  } else if (paper.title.includes('Sensory')) {
    return [{
      title: "Sensory Diet for Autism",
      description: "A personalized schedule of sensory activities designed to address specific sensory processing needs for individuals with autism.",
      target_condition: ['autism'],
      effectiveness_score: 0.85,
      difficulty_level: 'intermediate',
      category: 'sensory',
      keywords: ['sensory processing', 'sensory integration', 'routine', 'regulation'],
      evidence_strength: 'strong',
      implementation_steps: [
        "Assess individual sensory preferences and aversions",
        "Create a schedule of sensory activities throughout the day",
        "Include a mix of calming and alerting activities",
        "Ensure activities address all sensory systems",
        "Review and adjust regularly based on responses"
      ]
    }]
  } else if (paper.title.includes('Executive Function')) {
    return [{
      title: "Task Breakdown System",
      description: "A visual strategy for breaking complex tasks into smaller, manageable steps to improve executive functioning.",
      target_condition: ['adhd', 'autism'],
      effectiveness_score: 0.82,
      difficulty_level: 'beginner',
      category: 'organization',
      keywords: ['executive function', 'task management', 'visual supports', 'planning'],
      evidence_strength: 'moderate',
      implementation_steps: [
        "Identify a challenging task",
        "Break it into 3-5 concrete steps",
        "Create visual representations for each step",
        "Arrange in sequential order",
        "Check off steps as completed",
        "Reward completion of full task"
      ]
    }]
  }
  
  return []
}

// Helper function to generate technique metadata (mock implementation)
function generateTechniqueMetadata(technique: any): any {
  // In a real implementation, this would use an AI model to generate metadata
  // For demo purposes, we'll return sample metadata
  return {
    suitable_for_profiles: {
      age_ranges: technique.target_condition.includes('adhd') ? ['child', 'teen', 'adult'] : ['child', 'teen'],
      severity_levels: ['mild', 'moderate'],
      comorbidities: technique.category === 'sensory' ? ['anxiety', 'sensory processing disorder'] : ['anxiety', 'depression']
    },
    contraindications: {
      conditions: technique.category === 'focus' ? ['severe anxiety'] : [],
      medications: [],
      age_restrictions: technique.difficulty_level === 'advanced' ? ['young children'] : []
    },
    related_techniques: [],
    // In a real implementation, this would be a vector embedding
    ai_embeddings: Array(1536).fill(0).map(() => Math.random())
  }
}
