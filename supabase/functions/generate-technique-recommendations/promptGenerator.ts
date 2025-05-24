// Generate a detailed prompt for the LLM to create personalized recommendations
export function createRAGPrompt(userData: any) {
  const { 
    assessments, 
    chatHistory, 
    techniqueInteractions, 
    userCharacteristics 
  } = userData;

  // Analyze assessment data
  const latestAssessment = assessments[0] || {};
  const assessmentAnalysis = `
    User's latest assessment shows:
    - Focus Level: ${latestAssessment.focus_level}
    - Energy Level: ${latestAssessment.energy_level}
    - Stress Level: ${latestAssessment.stress_level}
    - Emotional Regulation: ${latestAssessment.emotional_regulation}
    - Task Switching Ability: ${latestAssessment.task_switching}
  `;

  // Analyze user characteristics
  const characteristicsAnalysis = userCharacteristics
    .map(char => `- ${char.characteristic}: ${char.description || ''}`)
    .join('\n');

  // Analyze technique interactions
  const techniqueInteractionSummary = techniqueInteractions
    .map(interaction => `
      Technique: ${interaction.technique_title}
      Feedback: ${interaction.feedback || 'No specific feedback'}
    `)
    .join('\n');

  return `
    You are **AIva**, an AI coach specializing in neurodivergent support. Provide a highly personalized technique recommendation.

    User Profile Analysis:
    ${assessmentAnalysis}

    User Characteristics:
    ${characteristicsAnalysis}

    Previous Technique Interactions:
    ${techniqueInteractionSummary}

    Based on this comprehensive profile, recommend ONE technique that:
    1. Directly addresses the user's specific challenges
    2. Builds upon their existing strengths
    3. Is likely to be both challenging and achievable

    Your recommendation should:
    - Be specific to the user's neurodivergent profile
    - Include clear implementation steps
    - Explain why this technique is particularly suited to this individual
  `;
}