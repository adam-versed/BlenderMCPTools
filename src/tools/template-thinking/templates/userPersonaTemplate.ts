import { ThinkingTemplate } from '../types.js';

export const userPersonaTemplate: ThinkingTemplate = {
  id: 'user-persona-template',
  name: 'User Persona Generator',
  category: 'analysis',
  description: 'Create detailed, actionable user personas that accurately reflect target audience segments to guide product design, marketing, and business strategy.',
  steps: [
    {
      id: 'step-1',
      content: 'Analyze business concept (problem being solved, solution overview, key features)',
      order: 1,
      isComplete: false
    },
    {
      id: 'step-2',
      content: 'Identify 2-4 distinct user segments with brief descriptions of each',
      order: 2,
      isComplete: false
    },
    {
      id: 'step-3',
      content: 'Develop detailed persona profile (name, age, occupation, location) for primary segment',
      order: 3,
      isComplete: false
    },
    {
      id: 'step-4',
      content: 'Define challenges, pain points, and goals for the persona',
      order: 4,
      isComplete: false
    },
    {
      id: 'step-5',
      content: 'Describe motivations, decision factors, and hesitations for the persona',
      order: 5,
      isComplete: false
    },
    {
      id: 'step-6',
      content: 'Create usage context and technology comfort profile',
      order: 6,
      isComplete: false
    },
    {
      id: 'step-7',
      content: 'Generate a first-person narrative that brings the persona to life',
      order: 7,
      isComplete: false
    },
    {
      id: 'step-8',
      content: 'Formulate 3-5 strategic questions to help businesses better understand this persona',
      order: 8,
      isComplete: false
    }
  ],
  createdAt: new Date(),
  usageCount: 0,
  isBuiltIn: true,
  artifacts: {
    'user-persona.md': {
      description: 'Comprehensive user persona with actionable insights for business planning',
      template: `# User Persona: [Name]

## Business Analysis

- **Problem Statement**: [The core problem being solved]
- **Solution Overview**: [The product/service and its approach]
- **Key Features**: [Essential capabilities and processes]

## Audience Segmentation

[Brief description of 2-4 distinct user segments]

## Persona Details

### Profile
- **Name**: [Full name]
- **Age**: [Age]
- **Occupation**: [Job title and industry]
- **Location**: [City/region and living situation]
- **Education**: [Highest level and relevant fields]
- **Income Level**: [Income bracket or financial situation]

### Challenges
- [Specific problem 1]
- [Specific problem 2]
- [Specific problem 3]

### Pain Points
- [Emotional frustration 1]
- [Practical frustration 1]
- [Emotional frustration 2]
- [Practical frustration 2]

### Goals
- **Short-term**: [Goal 1], [Goal 2]
- **Long-term**: [Goal 1], [Goal 2]

### Motivations
- [Underlying driver 1]
- [Underlying driver 2]
- [Underlying driver 3]

### Decision Factors
- [Factor 1]
- [Factor 2]
- [Factor 3]

### Hesitations
- [Concern 1]
- [Concern 2]
- [Objection 1]

### Usage Context
- **When**: [Timing of product usage]
- **Where**: [Location of product usage]
- **How**: [Method of product interaction]
- **Frequency**: [How often they would use it]

### Technology Comfort
- [Level of tech familiarity]
- [Specific platforms or tools used]
- [Technology preferences and habits]

### Information Sources
- [Source 1]
- [Source 2]
- [Source 3]

## Narrative

"[100-200 word first-person story that brings the persona to life, including daily experiences, interaction with the problem, and expectations from solutions]"

## Strategic Questions

1. [Question to understand persona better]
2. [Question to improve product-market fit]
3. [Question to address key hesitation]
4. [Question to leverage motivation]
5. [Question to enhance marketing approach]

## Actionable Recommendations

- **Product Development**: [Recommendation 1], [Recommendation 2]
- **Marketing Strategy**: [Recommendation 1], [Recommendation 2]
- **User Experience**: [Recommendation 1], [Recommendation 2]
- **Customer Support**: [Recommendation 1], [Recommendation 2]`
    }
  }
};
