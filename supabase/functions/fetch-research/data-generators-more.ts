
import { Technique } from './types.ts';

// Additional techniques to avoid making data-generators.ts too large
export function createMoreTechniques(): Technique[] {
  return [
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
