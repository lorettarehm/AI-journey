
// Sample questions for the assessment
export const sampleQuestions = [
  {
    id: '1',
    text: 'How difficult was it to focus on tasks today?',
    type: 'scale' as const,
    options: [
      { value: 1, label: 'Not difficult' },
      { value: 2, label: '' },
      { value: 3, label: '' },
      { value: 4, label: '' },
      { value: 5, label: 'Very difficult' },
    ],
  },
  {
    id: '2',
    text: 'How would you rate your energy level today?',
    type: 'scale' as const,
    options: [
      { value: 1, label: 'Very low' },
      { value: 2, label: '' },
      { value: 3, label: '' },
      { value: 4, label: '' },
      { value: 5, label: 'Very high' },
    ],
  },
  {
    id: '3',
    text: 'Which of these best describes your ability to organize tasks today?',
    type: 'multiple-choice' as const,
    options: [
      { value: 1, label: 'I had significant difficulty organizing tasks' },
      { value: 2, label: 'I struggled somewhat with organization' },
      { value: 3, label: 'I was moderately organized' },
      { value: 4, label: 'I was well organized throughout the day' },
    ],
  },
  {
    id: '4',
    text: 'How often did you feel overwhelmed by sensory input today?',
    type: 'multiple-choice' as const,
    options: [
      { value: 1, label: 'Not at all' },
      { value: 2, label: 'Once or twice' },
      { value: 3, label: 'Several times' },
      { value: 4, label: 'Throughout most of the day' },
    ],
  },
  {
    id: '5',
    text: 'How would you rate your overall mood today?',
    type: 'scale' as const,
    options: [
      { value: 1, label: 'Very low' },
      { value: 2, label: '' },
      { value: 3, label: '' },
      { value: 4, label: '' },
      { value: 5, label: 'Very high' },
    ],
  },
];
