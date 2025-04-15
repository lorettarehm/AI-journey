import React from 'react';
import { render, screen } from '@testing-library/react';
import AssessmentContent from './AssessmentContent';

const mockQuestions = [
  { id: '1', text: 'Question 1', type: 'scale', options: [] },
  { id: '2', text: 'Question 2', type: 'scale', options: [] },
];

describe('AssessmentContent', () => {
  it('renders the current question', () => {
    render(
      <AssessmentContent
        currentQuestionIndex={0}
        answers={{}}
        onAnswer={jest.fn()}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
        questions={mockQuestions}
      />
    );

    expect(screen.getByText('Question 1')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(
      <AssessmentContent
        currentQuestionIndex={0}
        answers={{}}
        onAnswer={jest.fn()}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
        questions={mockQuestions}
      />
    );

    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });
});