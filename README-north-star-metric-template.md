# North Star Metric Strategy Template

## Overview

The North Star Metric Strategy Template is designed to help businesses identify a single, powerful measurement that best captures customer value and predicts sustainable growth. This template guides users through a systematic process to analyze their business model, evaluate metrics, identify their North Star, and create an actionable implementation plan.

## Template Steps

1. **Gather Essential Business Context**: Collect comprehensive information about the business, including industry, target audience, value proposition, current metrics, strategic goals, and data capabilities.

2. **Analyze Business Model and Value Proposition**: Perform a deep analysis of the core business model to understand what truly drives sustainable success and customer value.

3. **Evaluate Current KPIs and Metrics**: Critically assess existing KPIs, then determine which to retain, replace, or supplement, with clear justification for each decision.

4. **Identify North Star Metric**: Select a single, leading metric that captures customer value and predicts growth, including a precise calculation method or formula.

5. **Break Down into Actionable Levers**: Deconstruct the North Star metric into 3-5 measurable levers that can be directly influenced through specific business actions.

6. **Prioritize and Create Implementation Plan**: Rank levers by potential impact and develop a strategic plan with specific actions, implementation strategies, and testing methodologies.

## Generated Artifact

The template produces a comprehensive strategy document:

### north-star-strategy.md

A complete North Star metric strategy that includes:
- The suggested North Star metric with justification
- Core value proposition analysis
- Aligned KPIs with justifications
- Detailed metric definition and calculation method
- Industry benchmarks
- Implementation requirements
- Ranked actionable levers with impact hypotheses and improvement actions
- Strategic implementation plan with timeline
- Measurement framework for tracking progress
- Additional recommendations and future considerations

## Using the Template

To use the North Star Metric Strategy Template:

1. Start a session with the template:
   ```typescript
   const result = await templateThinkingTool.processThought({
     templateId: 'north-star-metric-template'
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
       templateId: 'north-star-metric-template',
       sessionId: 'north-star-strategy.md'
     }
   }, context);
   ```

## Best Practices

- Gather comprehensive business context before attempting to identify the North Star metric
- Focus on leading indicators that predict future success, not just lagging measures of past performance
- Ensure the North Star directly relates to customer value and long-term growth
- Make all levers directly measurable and actionable by the business
- Provide specific, concrete actions rather than vague suggestions
- Include both immediate steps and long-term measurement frameworks
- Consider how the North Star strategy may need to evolve as the business grows