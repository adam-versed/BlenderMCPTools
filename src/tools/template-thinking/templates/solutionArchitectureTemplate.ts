import { ThinkingTemplate } from '../types.js';

export const solutionArchitectureTemplate: ThinkingTemplate = {
  id: 'solution-architecture-template',
  name: 'Solution Architecture Planning',
  category: 'planning',
  description: 'Systematically analyze project requirements and produce structured technical approach and implementation tasks',
  steps: [
    {
      id: 'step-1',
      content: 'Set Initial Context - Break down the project description into core components (aim, problem, users, technical constraints)',
      order: 1,
      isComplete: false
    },
    {
      id: 'step-2',
      content: 'Feature Definition - Form a prioritized feature list using the MoSCoW framework (Must, Should, Could, Won\'t)',
      order: 2,
      isComplete: false
    },
    {
      id: 'step-3',
      content: 'Initial Technical Analysis - Research and validate technical approach, frameworks, services and dependencies',
      order: 3,
      isComplete: false
    },
    {
      id: 'step-4',
      content: 'Create Technical Approach Document - Document architecture decisions, technology stack, and implementation strategy',
      order: 4,
      isComplete: false
    },
    {
      id: 'step-5',
      content: 'Create Task Breakdown - Develop structured task list with dependencies, requirements and acceptance criteria',
      order: 5,
      isComplete: false
    }
  ],
  createdAt: new Date(),
  usageCount: 0,
  isBuiltIn: true,
  artifacts: {
    'technical-approach.md': {
      description: 'Comprehensive technical approach documentation',
      template: `# Technical Approach

## Overview

[Brief overview of the solution approach]

## Architectural Decisions

[Key architectural decisions and their rationales]

## Technology Stack

### Frontend
- Framework: [Framework name and version]
- UI Library: [Library name and version]
- State Management: [Solution name and version]
- Key Dependencies:
  - [Dependency 1]: [Purpose]
  - [Dependency 2]: [Purpose]

### Backend
- Framework: [Framework name and version]
- Database: [Database name and version]
- Authentication: [Auth solution]
- Key Dependencies:
  - [Dependency 1]: [Purpose]
  - [Dependency 2]: [Purpose]

### DevOps & Infrastructure
- Hosting: [Hosting solution]
- CI/CD: [CI/CD pipeline]
- Monitoring: [Monitoring solution]

## Security Considerations

[Key security implementations and considerations]

## Scalability Approach

[How the solution will scale]

## Performance Optimizations

[Performance considerations and implementations]

## Testing Strategy

[Overview of testing approach]

## Implementation Considerations

[Any other important implementation details]
`,
    },
    'tasks.md': {
      description: 'Prioritized task breakdown with dependencies and acceptance criteria',
      template: `# Implementation Tasks

## Overview

[Brief overview of the implementation plan]

## Task List

### TASK-001: [Task Name]

- **Status**: [ ] Not Started
- **Priority**: [High/Medium/Low]
- **Estimated Effort**: [X hours/days]
- **Dependencies**: None

**Requirements**:
- [Specific requirement 1]
- [Specific requirement 2]

**Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Acceptance Criteria**:
- [ ] [Criteria 1]
- [ ] [Criteria 2]

### TASK-002: [Task Name]

- **Status**: [ ] Not Started
- **Priority**: [High/Medium/Low]
- **Estimated Effort**: [X hours/days]
- **Dependencies**: TASK-001

**Requirements**:
- [Specific requirement 1]
- [Specific requirement 2]

**Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Acceptance Criteria**:
- [ ] [Criteria 1]
- [ ] [Criteria 2]
`
    }
  }
};
