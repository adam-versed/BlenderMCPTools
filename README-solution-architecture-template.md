# Solution Architecture Template

## Overview

The Solution Architecture Template is designed to systematically analyze project requirements and produce structured technical approach documentation and implementation tasks. This template guides users through a comprehensive process for planning software architecture and implementation.

## Template Steps

1. **Set Initial Context**: Break down the project description into core components including aim, problem statement, user types, and technical constraints.

2. **Feature Definition**: Form a prioritized feature list using the MoSCoW framework (Must-Have, Should-Have, Could-Have, Won't-Have) for efficient MVP planning.

3. **Initial Technical Analysis**: Research and validate technical approach, frameworks, services, and dependencies through methodical analysis and research.

4. **Create Technical Approach Document**: Document architecture decisions, technology stack, and implementation strategy based on the analysis.

5. **Create Task Breakdown**: Develop a structured task list with dependencies, requirements, and acceptance criteria for implementation.

## Generated Artifacts

The template produces two standardized documents:

### 1. technical-approach.md

A comprehensive technical approach document that includes:
- Solution overview
- Architectural decisions with rationales
- Technology stack (frontend, backend, DevOps)
- Security considerations
- Scalability approach
- Performance optimizations
- Testing strategy
- Implementation considerations

### 2. tasks.md

A detailed task breakdown document that includes:
- Implementation plan overview
- Prioritized tasks with:
  - Status tracking
  - Priority levels
  - Effort estimates
  - Dependencies
  - Specific requirements
  - Implementation steps
  - Acceptance criteria

## Using the Template

To use the Solution Architecture Template:

1. Start a session with the template:
   ```typescript
   const result = await templateThinkingTool.processThought({
     templateId: 'solution-architecture-template'
   }, context);
   ```

2. Work through each step, updating the content as you go:
   ```typescript
   const updateResult = await templateThinkingTool.processThought({
     sessionId: result.sessionId,
     stepId: result.activeStep.id,
     content: '...'  // Your analysis for the current step
   }, context);
   ```

3. Retrieve artifact templates when needed:
   ```typescript
   const artifactTemplate = await templateThinkingTool.processThought({
     command: {
       type: 'get-artifact-template',
       templateId: 'solution-architecture-template',
       sessionId: 'technical-approach.md'  // or 'tasks.md'
     }
   }, context);
   ```

## Best Practices

- Thoroughly analyze the project description before proceeding to later steps
- Use the MoSCoW framework rigorously for feature prioritization
- Research and validate technical choices with authoritative sources
- Ensure consistent technical choices across both artifact documents
- Organize tasks to allow parallel implementation where possible
- Include test-driven development steps in all implementation tasks