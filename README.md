# Structured Thinking

A framework for enhancing Claude's reasoning capabilities through structured thinking paradigms.

## Project Overview

Structured Thinking is a modular system that provides Claude AI with specialized tools for approaching complex problems using predefined cognitive frameworks. It acts as a "thinking scratchpad" that guides problem-solving through explicit, step-by-step reasoning processes optimized for different types of challenges.

## Key Features

- **Template-based Thinking**: Structured frameworks for common cognitive tasks
- **Context-aware Template Selection**: Auto-selection of appropriate thinking templates
- **Verification Thinking**: Systematic verification of claims and assumptions
- **Learning & Adaptation**: Continuous improvement through usage pattern analysis
- **Flexible Integration**: Common interface for all thinking tools

## Architecture

The project follows a modular architecture centered around specialized thinking tools:

```
structured-thinking/
├── src/
│   ├── common/              # Shared types and utilities
│   ├── persistence/         # Data persistence layer
│   ├── tools/               # Thinking tools implementations
│   │   ├── template-thinking/   # Template-based thinking
│   │   │   ├── intelligence/    # ML/pattern matching
│   │   │   ├── recommender/     # Template recommendations
│   │   ├── verification-thinking/  # Verification thinking
│   └── index.ts             # Main entry point
```

## Functional Components

### 1. Template Thinking

Template Thinking provides structured frameworks for approaching different problem types:

- **Template Manager**: Core component that manages templates and thinking sessions
- **Template Recommender**: Analyzes problem context and selects appropriate templates
- **Intelligence Layer**: Pattern recognition and context understanding
- **Learning System**: Tracks template effectiveness and adapts recommendations

#### Template Categories

- **Analysis**: Breaking down complex problems into analyzable components
- **Planning**: Structured approach for implementation planning
- **Debugging**: Systematic troubleshooting of issues
- **Decision Making**: Framework for evaluating options with multiple criteria
- **Research**: Methodical approach to information gathering
- **Verification**: Systematically verifying claims or hypotheses

### 2. Verification Thinking

Verification Thinking provides frameworks specifically for validating claims:

- **Claim Verification**: Methodical validation of assertions
- **Evidence Evaluation**: Systematic assessment of supporting evidence
- **Confidence Tracking**: Explicit tracking of confidence levels

### 3. Common Infrastructure

- **Type Definitions**: Shared interfaces across thinking tools
- **Persistence Manager**: Storage and retrieval of thinking artifacts
- **Chat Formatting**: Integration with Claude's chat interface

## System Flow

1. **Problem Description**: User presents a problem to Claude
2. **Context Analysis**: System analyzes the problem description
3. **Template Recommendation**: Appropriate thinking templates are recommended
4. **Template Selection**: User or system selects the most suitable template
5. **Session Creation**: A structured thinking session is created
6. **Guided Steps**: Claude works through the structured thinking steps
7. **Results & Learning**: Outcomes are stored for improving future recommendations

## User Experience Workflow

Template Thinking provides Claude with a structured approach to tackle complex problems using predefined or custom templates. Here's how it works from the user's perspective:

### 1. Initialization

When a user asks Claude to analyze something methodically, Claude can invoke the Template Thinking tool to guide its analysis process:

- Claude determines an appropriate template for the task (e.g., "analysis-template" for problem analysis)
- The system creates a new session with that template
- Claude presents the template structure to the user, highlighting the current step

**What the user sees**: Claude introduces the template approach and focuses on the first step, asking targeted questions to complete that step.

### 2. Guided Step-by-Step Process

As the conversation progresses:

- Claude completes each step based on user input and its own analysis
- After completing a step, Claude uses the tool to mark that step complete and advance to the next one
- The session's state is maintained across the conversation

**What the user sees**: Claude clearly indicates which step is currently active and shows progress through the template. Each response from Claude is structured around completing the current step and transitioning to the next.

### 3. Benefits for the User

The Template Thinking approach offers several advantages:

- **Thoroughness**: Ensures all important aspects are considered systematically
- **Transparency**: Users can see the thinking process and contribute at each step
- **Consistency**: Provides a repeatable approach to similar problems
- **Customization**: Templates can be tailored to specific domains or tasks

### 4. Custom Templates

Users can have Claude create custom templates for specialized tasks:

- Claude can define a new template with appropriate steps
- The template is stored for future use
- Claude can immediately start using the new template

This allows the approach to be tailored to specific domains (security audits, code reviews, decision-making processes, etc.) rather than using generic templates.

## Example Interactions

### Example 1: API Design Analysis

```
User: "Let's analyze this API design systematically"

Claude: "I'll analyze the API design using a structured approach.

📋 ANALYSIS TEMPLATE (Step 1 of 5)
→ Current step: Define the problem statement clearly

Let's start by clearly defining what we're analyzing. Could you provide details about the API's purpose and requirements?"

User: "I need to design a RESTful API for user management with authentication."

Claude: "📋 ANALYSIS TEMPLATE (Step 2 of 5)
✓ Step 1: Define the problem statement - Design a RESTful API for user management with authentication
→ Current step: Identify key components and variables

For this user management API, let's identify the key components:

1. User resources (create, read, update, delete)
2. Authentication endpoints (login, logout, refresh)
3. Authorization mechanisms
4. Data models and relationships

Are there any specific requirements for these components or additional ones we should consider?"

[Conversation continues through remaining steps]

Claude: "📋 ANALYSIS TEMPLATE (Completed)
✓ Step 1: Define the problem statement
✓ Step 2: Identify key components
✓ Step 3: Analyze relationships
✓ Step 4: Evaluate approaches
✓ Step 5: Summarize findings

Based on our structured analysis, here's the complete API design recommendation..."
```

### Example 2: Debugging a Test Failure

```
User: "Can you help me analyze this test failure methodically?"

Claude: "I'll help you analyze this test failure using a systematic approach.

📋 SYSTEMATIC DEBUGGING (Step 1 of 7)
→ Current step: Reproduce the issue with a minimal example

Could you share the specific test that's failing, including the error message and any relevant code? This will help us establish a clear reproduction case."

User: "The test is failing with: 'AssertionError: expected 42 but got undefined'. Here's the test and implementation..."

Claude: "📋 SYSTEMATIC DEBUGGING (Step 2 of 7)
✓ Step 1: Reproduced the issue with test case X
→ Current step: Examine error messages and logs

Based on the error message 'AssertionError: expected 42 but got undefined', it appears the function isn't returning a value. Let's look at what might be causing this. Are there any additional logs or stack traces available?"

[Debugging process continues through all steps]

Claude: "📋 SYSTEMATIC DEBUGGING (Completed)
✓ Step 1: Reproduced with minimal test case
✓ Step 2: Examined error messages
✓ Step 3: Formulated hypotheses
✓ Step 4: Confirmed missing return path in if-block
✓ Step 5: Implemented fix to add return value
✓ Step 6: Verified test now passes
✓ Step 7: Documented fix and root cause

Based on our systematic debugging, we found that the function was missing a return statement in the conditional branch handling negative inputs. The fix was to add a proper return value, and we've confirmed the test now passes."
```

### Example 3: Creating a Custom Template

```
User: "Can you create a template for API security audits?"

Claude: "I'll create a custom template for API security audits.

Creating a new template with the following steps:
1. Identify authentication methods
2. Review authorization model
3. Check data validation
4. Inspect error handling and logging
5. Examine rate limiting and throttling
6. Review sensitive data handling
7. Check for security headers
8. Analyze encryption usage

Would you like to start using this template now?"

User: "Yes, let's use it to audit our payment API."

Claude: "📋 API SECURITY AUDIT (Step 1 of 8)
→ Current step: Identify authentication methods

Let's start by identifying all authentication methods used in your payment API. What authentication mechanisms are currently implemented?"

[Process continues through the custom template]
```

## Usage Example (Code)

### Template Thinking with Auto-Selection

```typescript
// Example of using template thinking with auto-selection
const result = await templateThinkingTool.processThought({
  command: {
    type: 'auto-select-template',
    problemDescription: 'I need to decide between AWS and Azure for our cloud infrastructure'
  }
}, context);

// Response includes selected template, active step, and formatted output
console.log(result.selectedTemplate); // "decision-making-template"
console.log(result.activeStep);       // "define-decision-criteria"
console.log(result.formattedOutput);  // Formatted text for Claude to present to user
```

### Template Thinking with Manual Template Selection

```typescript
// Example of manually selecting a template
const result = await templateThinkingTool.processThought({
  command: {
    type: 'select-template',
    templateId: 'planning-template',
    sessionName: 'Database Migration Plan'
  }
}, context);

// Completing a step in the template
const updateResult = await templateThinkingTool.processThought({
  command: {
    type: 'complete-step',
    sessionId: result.sessionId,
    stepId: result.activeStep.id,
    content: 'The migration will involve moving from MySQL 5.7 to PostgreSQL 13...'
  }
}, context);
```

### Verification Thinking

```typescript
// Example of using verification thinking
const result = await verificationThinkingTool.processThought({
  command: {
    type: 'verify-claim',
    claim: 'Python is faster than JavaScript for data processing',
    confidence: 0.7,
    evidence: ['Python has optimized libraries like NumPy']
  }
}, context);

// Adding counter-evidence to refine the verification
const updatedResult = await verificationThinkingTool.processThought({
  command: {
    type: 'add-counter-evidence',
    verificationId: result.verificationId,
    counterEvidence: ['JavaScript's V8 engine has significant optimizations for array operations']
  }
}, context);
```

### Custom Template Creation

```typescript
// Example of creating a custom template
const result = await templateThinkingTool.processThought({
  command: {
    type: 'create-template',
    template: {
      name: 'API Security Audit',
      description: 'Template for auditing API security',
      category: 'security',
      steps: [
        { content: 'Identify authentication methods', order: 1 },
        { content: 'Review authorization model', order: 2 },
        { content: 'Check data validation', order: 3 },
        { content: 'Inspect error handling and logging', order: 4 },
        { content: 'Examine rate limiting and throttling', order: 5 },
        { content: 'Review sensitive data handling', order: 6 },
        { content: 'Check for security headers', order: 7 },
        { content: 'Analyze encryption usage', order: 8 }
      ]
    }
  }
}, context);
```

## Advanced Features

### Template Selection

The system can automatically select templates based on problem context:

- **Pattern Recognition**: Identifies problem types through linguistic patterns
- **Confidence Scoring**: Assesses confidence in template recommendations
- **Diversified Recommendations**: Suggests templates from different categories
- **Contextual Factors**: Considers time pressure, complexity, and domain specificity

### Template Modification

Templates can be customized for specific domains:

- **Step Modification**: Add, remove, or reorder template steps
- **Template Variation**: Create variations of existing templates
- **Custom Templates**: Create entirely new templates

### Learning & Adaptation

The system continuously improves through usage data:

- **Usage Tracking**: Records which templates are selected and completed
- **Effectiveness Metrics**: Tracks template performance across different contexts
- **Historical Analysis**: Identifies trends in template effectiveness

## Integration With Claude

Structured Thinking integrates with Claude through:

1. **Tool Interface**: Claude invokes the tool with problem descriptions
2. **Formatted Output**: Results are formatted for Claude's chat interface
3. **Context Preservation**: Thinking state is maintained across interactions

## Getting Started

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Future Directions

1. **Enhanced Pattern Recognition**: More sophisticated context understanding
2. **Domain-Specific Templates**: Pre-built templates for specialized domains
3. **Multi-Tool Thinking**: Combining multiple thinking approaches for complex problems
4. **Visual Thinking Maps**: Graphical representation of thinking processes
