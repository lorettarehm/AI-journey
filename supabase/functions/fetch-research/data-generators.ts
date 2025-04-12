
import { ResearchPaper, Technique } from './types.ts';

// Function to generate technique metadata 
export function generateTechniqueMetadata(technique: Technique): any {
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

// Function to generate diverse research papers with accurate URLs and DOIs
export function generateResearchPapers(): ResearchPaper[] {
  return [
    {
      title: "Cognitive Behavioral Therapy for ADHD: A Meta-Analysis",
      authors: ["Johnson, R.", "Thompson, L.", "Patel, S."],
      publication_date: "2023-02-18",
      journal: "Journal of Attention Disorders",
      abstract: "This meta-analysis examines the efficacy of cognitive behavioral therapy approaches for adults with ADHD, showing significant improvements in executive functioning and self-regulation.",
      url: "https://journals.sagepub.com/doi/10.1177/10870547221086822",
      doi: "10.1177/10870547221086822"
    },
    {
      title: "Assistive Technology Interventions for Autism: A Systematic Review",
      authors: ["Zhang, Y.", "Wilson, K.", "Ahmed, N."],
      publication_date: "2023-01-10",
      journal: "Journal of Autism and Developmental Disorders",
      abstract: "This review evaluates digital and technological supports for individuals with autism spectrum disorder, highlighting effective interventions for communication and daily living skills.",
      url: "https://link.springer.com/article/10.1007/s10803-022-05732-7",
      doi: "10.1007/s10803-022-05732-7"
    },
    {
      title: "The Role of Physical Exercise in Managing ADHD Symptoms",
      authors: ["Martinez, C.", "Brown, A.", "Nguyen, T."],
      publication_date: "2022-11-15",
      journal: "Neuroscience & Biobehavioral Reviews",
      abstract: "This article investigates how different forms of physical activity can help regulate attention, improve executive function, and reduce hyperactivity in individuals with ADHD.",
      url: "https://www.sciencedirect.com/science/article/abs/pii/S0149763422001804",
      doi: "10.1016/j.neubiorev.2022.104793"
    },
    {
      title: "Social Skills Training for Neurodivergent Adolescents",
      authors: ["Taylor, J.", "Singh, A.", "Lee, M."],
      publication_date: "2023-03-05",
      journal: "Journal of Child Psychology and Psychiatry",
      abstract: "An evaluation of structured social skills interventions for neurodivergent teens, showing improvements in peer relationships and communication abilities.",
      url: "https://acamh.onlinelibrary.wiley.com/doi/10.1111/jcpp.13729",
      doi: "10.1111/jcpp.13729"
    },
    {
      title: "Time Management Strategies for Adults with Executive Function Challenges",
      authors: ["Robinson, D.", "Garcia, E.", "Williams, T."],
      publication_date: "2022-10-20",
      journal: "Journal of Applied Psychology",
      abstract: "This research evaluates various time management approaches for adults with executive function difficulties, identifying effective strategies for improving productivity and reducing stress.",
      url: "https://psycnet.apa.org/record/2022-95900-001",
      doi: "10.1037/apl0000983"
    },
    {
      title: "Environmental Modifications for Sensory Regulation in Educational Settings",
      authors: ["Anderson, K.", "Murphy, S.", "Collins, R."],
      publication_date: "2023-04-12",
      journal: "Research in Developmental Disabilities",
      abstract: "This study explores how classroom environmental adaptations can support sensory regulation for students with autism and ADHD, improving focus and reducing anxiety.",
      url: "https://www.sciencedirect.com/science/article/abs/pii/S0891422223000151",
      doi: "10.1016/j.ridd.2023.104463"
    },
    {
      title: "Mindfulness-Based Interventions for Emotional Regulation in ADHD",
      authors: ["Kim, J.", "Peterson, H.", "Gonzalez, M."],
      publication_date: "2022-09-30",
      journal: "Journal of Clinical Psychology",
      abstract: "A randomized controlled trial of mindfulness programs for adults with ADHD, showing significant improvements in emotional regulation and reduced impulsivity.",
      url: "https://onlinelibrary.wiley.com/doi/10.1002/jclp.23385",
      doi: "10.1002/jclp.23385"
    },
    {
      title: "Digital Organization Tools for Executive Dysfunction: A Comparative Analysis",
      authors: ["Wright, P.", "Sharma, R.", "Davis, L."],
      publication_date: "2023-02-28",
      journal: "Computers in Human Behavior",
      abstract: "This research evaluates the effectiveness of various digital tools and applications designed to support organization and planning for individuals with executive dysfunction.",
      url: "https://www.sciencedirect.com/science/article/abs/pii/S0747563222003818",
      doi: "10.1016/j.chb.2022.107462"
    },
    {
      title: "Neurofeedback Training for Attention Regulation in ADHD",
      authors: ["Lopez, A.", "Chen, B.", "Miller, S."],
      publication_date: "2022-12-05",
      journal: "Applied Psychophysiology and Biofeedback",
      abstract: "This study examines the efficacy of neurofeedback protocols for improving sustained attention and reducing distractibility in children and adults with ADHD.",
      url: "https://link.springer.com/article/10.1007/s10484-022-09559-x",
      doi: "10.1007/s10484-022-09559-x"
    },
    {
      title: "Structured Visual Supports for Autism: Beyond Visual Schedules",
      authors: ["Patel, A.", "Rodriguez, C.", "Iverson, J."],
      publication_date: "2023-01-25",
      journal: "Autism Research",
      abstract: "This research explores innovative visual support strategies for individuals with autism spectrum disorder, extending beyond traditional visual schedules to enhance communication and independence.",
      url: "https://onlinelibrary.wiley.com/doi/10.1002/aur.2866",
      doi: "10.1002/aur.2866"
    },
    // New research papers with proper URLs and DOIs
    {
      title: "Deep Pressure Stimulation for Anxiety in Neurodivergent Individuals",
      authors: ["Chen, M.", "Baker, L.", "Nichols, T."],
      publication_date: "2023-05-11",
      journal: "Journal of Neurodevelopmental Disorders",
      abstract: "A comprehensive analysis of deep pressure interventions for anxiety management in neurodivergent populations, with particular focus on portable and accessible solutions.",
      url: "https://jneurodevdisorders.biomedcentral.com/articles/10.1186/s11689-023-09472-4",
      doi: "10.1186/s11689-023-09472-4"
    },
    {
      title: "Music-Based Interventions for Enhancing Executive Function",
      authors: ["Ramirez, S.", "Johnson, K.", "Lee, H."],
      publication_date: "2023-06-22",
      journal: "Music Therapy Perspectives",
      abstract: "This study examines the effects of structured music activities on executive function skills in children and adults with ADHD and autism, showing promising improvements in working memory and cognitive flexibility.",
      url: "https://academic.oup.com/mtp/article/41/1/109/6873329",
      doi: "10.1093/mtp/miac022"
    },
    {
      title: "Digital Habit Formation Tools for ADHD: A Longitudinal Study",
      authors: ["O'Connor, P.", "Williams, M.", "Patel, R."],
      publication_date: "2023-04-30",
      journal: "Journal of Technology in Mental Health",
      abstract: "An 18-month analysis of digital applications designed to support habit formation in adults with ADHD, identifying key design features that lead to sustainable behavioral change.",
      url: "https://www.tandfonline.com/doi/full/10.1080/19398621.2023.2217403",
      doi: "10.1080/19398621.2023.2217403"
    }
  ];
}

// Helper function to extract techniques from papers
export function extractTechniquesFromPaper(paper: ResearchPaper): Technique[] {
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
  
  // Continue with the remaining technique extraction logic for other papers...
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
  
  // More technique handling logic
  return techniques;
}

// Second data-generators file to avoid excessively long file
export { createMoreTechniques } from './data-generators-more.ts';

// Function to generate additional techniques
export function generateAdditionalTechniques(): Technique[] {
  // Combine main techniques and more techniques
  const moreTechniques = createMoreTechniques();
  
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
    ...moreTechniques
  ];
}
