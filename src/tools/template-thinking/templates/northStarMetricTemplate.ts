import { ThinkingTemplate } from '../types.js';

export const northStarMetricTemplate: ThinkingTemplate = {
  id: 'north-star-metric-template',
  name: 'North Star Metric Strategy',
  category: 'analysis',
  description: 'Identify a single, powerful measurement that best captures customer value and predicts business growth, then break it down into actionable levers and create an implementation plan.',
  steps: [
    {
      id: 'step-1',
      content: 'Gather essential business context (industry, target audience, value proposition, current metrics, goals, data capabilities)',
      order: 1,
      isComplete: false
    },
    {
      id: 'step-2',
      content: 'Analyze business model and value proposition to understand what drives sustainable success',
      order: 2,
      isComplete: false
    },
    {
      id: 'step-3',
      content: 'Evaluate current KPIs and metrics (retain, replace, or introduce new ones with justification)',
      order: 3,
      isComplete: false
    },
    {
      id: 'step-4',
      content: 'Identify ONE North Star metric that captures customer value and predicts growth (with calculation method)',
      order: 4,
      isComplete: false
    },
    {
      id: 'step-5',
      content: 'Break down the North Star metric into 3-5 actionable, measurable levers that can be influenced',
      order: 5,
      isComplete: false
    },
    {
      id: 'step-6',
      content: 'Prioritize levers by potential impact and create strategic implementation plan with specific actions',
      order: 6,
      isComplete: false
    }
  ],
  createdAt: new Date(),
  usageCount: 0,
  isBuiltIn: true,
  artifacts: {
    'north-star-strategy.md': {
      description: 'Comprehensive North Star metric strategy with actionable implementation plan',
      template: `# Suggested North Star: [Metric Name]

[Brief description of why this metric is ideal for the business]

## Core Value Proposition

[Analysis of the business's fundamental value to customers]

## KPIs Aligned with Long-term Success

[List of recommended KPIs with justification for each]

## North Star Breakdown

### Metric Definition

[Precise definition and calculation method]

### Industry Benchmarks

[Relevant examples and standards]

### Implementation Requirements

[Data and tracking needs]

## Actionable Levers (Ranked by Impact)

1. [Lever 1 Name]

   - Description: [What this lever measures]
   - Impact hypothesis: [Why this moves the North Star]
   - Current status: [Where the business stands now]
   - Improvement actions: [Specific, tactical recommendations]

2. [Lever 2 Name]
   - Description: [What this lever measures]
   - Impact hypothesis: [Why this moves the North Star]
   - Current status: [Where the business stands now]
   - Improvement actions: [Specific, tactical recommendations]

3. [Lever 3 Name]
   - Description: [What this lever measures]
   - Impact hypothesis: [Why this moves the North Star]
   - Current status: [Where the business stands now]
   - Improvement actions: [Specific, tactical recommendations]

## Strategic Implementation Plan

[Week-by-week or month-by-month action plan]

## Measurement Framework

[How to track progress and validate the North Star choice]

## Additional Recommendations

[Further insights or future considerations]`
    }
  }
};
