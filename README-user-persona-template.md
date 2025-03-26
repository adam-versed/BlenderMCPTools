# User Persona Generator Template

## Overview

The User Persona Generator Template is designed to create detailed, actionable user personas that accurately reflect target audience segments for business and product development. This template guides users through a systematic process to analyze business concepts, identify audience segments, and develop comprehensive personas that inform product design, marketing strategies, and business decisions.

## Template Steps

1. **Analyze Business Concept**: Understand the core problem being solved, solution overview, and key features of the product or service.

2. **Identify User Segments**: Determine 2-4 distinct audience segments with brief descriptions of each target group.

3. **Develop Persona Profile**: Create a detailed profile for the primary segment including name, age, occupation, location, education, and income level.

4. **Define Challenges and Goals**: Outline specific problems faced, emotional and practical frustrations, and both short-term and long-term objectives.

5. **Describe Motivations and Decision Factors**: Detail underlying drivers, influences on choices, and concerns or objections about potential solutions.

6. **Create Usage Context**: Specify when, where, and how they would use the product, their familiarity with relevant technology, and where they seek information.

7. **Generate Narrative**: Develop a 100-200 word first-person story that brings the persona to life, including daily experiences, interaction with the problem, and expectations.

8. **Formulate Strategic Questions**: Create 3-5 focused questions to help businesses better understand and serve this persona.

## Generated Artifact

The template produces a comprehensive user persona document:

### user-persona.md

A complete user persona that includes:
- Business analysis (problem statement, solution overview, key features)
- Audience segmentation overview
- Detailed persona profile and characteristics
- Challenges, pain points, and goals
- Motivations, decision factors, and hesitations
- Usage context and technology comfort
- First-person narrative
- Strategic questions for business planning
- Actionable recommendations for product development, marketing, UX, and support

## Using the Template

To use the User Persona Generator Template:

1. Start a session with the template:
   ```typescript
   const result = await templateThinkingTool.processThought({
     templateId: 'user-persona-template'
   }, context);
   ```

2. Progress through each step, providing detailed analysis at each stage:
   ```typescript
   const updateResult = await templateThinkingTool.processThought({
     sessionId: result.sessionId,
     stepId: result.activeStep.id,
     content: '...'  // Your analysis for the current step
   }, context);
   ```

3. Retrieve the artifact template when needed:
   ```typescript
   const artifactTemplate = await templateThinkingTool.processThought({
     command: {
       type: 'get-artifact-template',
       templateId: 'user-persona-template',
       sessionId: 'user-persona.md'
     }
   }, context);
   ```

## Best Practices

- Focus on gathering comprehensive business and product information before defining personas
- Base personas on real data and research whenever possible
- Emphasize behaviors and attitudes rather than just demographics
- Create personas that are realistic and specific enough to guide decision-making
- Ensure each persona has distinct characteristics that warrant different product considerations
- Connect persona traits directly to product features and business decisions
- Include both emotional and practical aspects of the user's experience
- Make the narrative authentic and relatable
- Ensure strategic questions provide actionable insights
- Develop personas that all stakeholders can understand and reference