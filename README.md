# Structured Thinking

A framework for enhancing reasoning capabilities through structured thinking paradigms.

## Project Overview

Structured Thinking is a modular system that provides MCP clients with specialized tools for approaching complex problems using predefined cognitive frameworks. It acts as a "thinking scratchpad" that guides problem-solving through explicit, step-by-step reasoning processes optimized for different types of challenges.

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
- **Chat Formatting**: Integration with MCP client's chat interface

## System Flow

1. **Problem Description**: User presents a problem to the MCP client
2. **Context Analysis**: System analyzes the problem description
3. **Template Recommendation**: Appropriate thinking templates are recommended
4. **Template Selection**: User or system selects the most suitable template
5. **Session Creation**: A structured thinking session is created
6. **Guided Steps**: MCP client works through the structured thinking steps
7. **Results & Learning**: Outcomes are stored for improving future recommendations

## User Experience Workflow

Template Thinking provides MCP clients with a structured approach to tackle complex problems using predefined or custom templates. Here's how it works from the user's perspective:

### 1. Initialization

When a user asks the MCP client to analyze something methodically, the client can invoke the Template Thinking tool to guide its analysis process:

- The MCP client determines an appropriate template for the task (e.g., "analysis-template" for problem analysis)
- The system creates a new session with that template
- The MCP client presents the template structure to the user, highlighting the current step

**What the user sees**: The MCP client introduces the template approach and focuses on the first step, asking targeted questions to complete that step.

### 2. Guided Step-by-Step Process

As the conversation progresses:

- The MCP client completes each step based on user input and its own analysis
- After completing a step, the MCP client uses the tool to mark that step complete and advance to the next one
- The session's state is maintained across the conversation

**What the user sees**: The MCP client clearly indicates which step is currently active and shows progress through the template. Each response from the MCP client is structured around completing the current step and transitioning to the next.

### 3. Benefits for the User

The Template Thinking approach offers several advantages:

- **Thoroughness**: Ensures all important aspects are considered systematically
- **Transparency**: Users can see the thinking process and contribute at each step
- **Consistency**: Provides a repeatable approach to similar problems
- **Customization**: Templates can be tailored to specific domains or tasks

### 4. Custom Templates

Users can have the MCP client create custom templates for specialized tasks:

- The MCP client can define a new template with appropriate steps
- The template is stored for future use
- The MCP client can immediately start using the new template

This allows the approach to be tailored to specific domains (security audits, code reviews, decision-making processes, etc.) rather than using generic templates.

## Example Interactions

### Example 1: Technical Knowledge Base Generator

```
User: "Can you create a technical knowledge base article about GraphQL for our development team?"

MCP client: "I'll help you create a comprehensive technical knowledge base on GraphQL.

📋 TECHNICAL KNOWLEDGE BASE GENERATOR (Step 1 of 10)
→ Current step: Define and scope the technical topic, breaking it down into key components and necessary research areas

Let's start by defining the scope of our GraphQL knowledge base. Which specific aspects of GraphQL should we focus on for your development team? For example:
- API query language fundamentals
- Server implementation and setup
- Client integration
- Schema design
- Performance optimization
- Security best practices
- Specific frameworks or libraries
- Migrations from REST

This will help me create a properly focused technical document."

User: "We need to cover the fundamentals, schema design, and how to implement it with Node.js and React. Security and performance considerations would be helpful too."

MCP client: "📋 TECHNICAL KNOWLEDGE BASE GENERATOR (Step 2 of 10)
✓ Step 1: Define and scope the technical topic
→ Current step: Research using authoritative sources (official docs, GitHub repositories, expert blogs, etc.)

I'll now research GraphQL with a focus on fundamentals, schema design, Node.js implementation, React client integration, and security/performance considerations.

I'll be gathering information from:
- The official GraphQL documentation
- Apollo GraphQL documentation (popular implementation)
- GitHub repositories with high stars for Node.js and React implementations
- Technical blogs from recognized experts
- Security best practices from trusted sources

Is there any specific GraphQL implementation (Apollo, Relay, etc.) that your team uses or plans to use? This will help me target the research more effectively."

[Conversation continues through remaining steps]

MCP client: "📋 TECHNICAL KNOWLEDGE BASE GENERATOR (Completed)
✓ Step 1: Define and scope the technical topic
✓ Step 2: Research using authoritative sources
✓ Step 3: Create introduction
✓ Step 4: Define core concepts
✓ Step 5: Create getting started guide
✓ Step 6: Document best practices
✓ Step 7: Provide common patterns and examples
✓ Step 8: Add troubleshooting section
✓ Step 9: Cover advanced topics
✓ Step 10: Compile resources and references

📄 Generated Artifact:

### technical-knowledge-base.md
Comprehensive technical documentation with theoretical and practical guidance

I've created a complete GraphQL knowledge base document that covers fundamentals, schema design, Node.js server implementation, React client integration, and performance/security considerations. The document includes code examples, best practices, troubleshooting guides, and curated resources to help your development team."
```

### Example 2: User Persona Generator

```
User: "I need to create a user persona for a mobile app that helps people track and reduce their carbon footprint."

MCP client: "I'll help you create a detailed user persona using a structured approach.

📋 USER PERSONA GENERATOR (Step 1 of 8)
→ Current step: Analyze business concept (problem being solved, solution overview, key features)

To create an effective user persona, I first need to understand your business concept better. Could you provide more details about:

1. The specific problem your carbon footprint app is solving
2. Your overall approach/solution 
3. The key features or capabilities of the app
4. Any specific target audience you already have in mind"

User: "The problem is people want to reduce their carbon footprint but don't know where to start. Our app lets users track daily activities and their impact, suggests personalized changes, and connects them with sustainable alternatives. Target audience is environmentally-conscious millennials and Gen Z."

MCP client: "📋 USER PERSONA GENERATOR (Step 2 of 8)
✓ Step 1: Analyze business concept
→ Current step: Identify 2-4 distinct user segments with brief descriptions of each

Based on your business concept, I've identified these distinct user segments:

1. Eco-Curious Beginners: Young adults (18-25) just starting their sustainability journey, motivated but overwhelmed with options
2. Committed Climate Advocates: Millennials (26-35) already practicing sustainability who want to optimize and quantify their impact
3. Pragmatic Reducers: Busy professionals (30-45) primarily motivated by cost savings and efficiency, with sustainability as a secondary benefit
4. Socially-Driven Sharers: Social media active users (20-30) who want to showcase their environmental efforts and influence others

Which segment would you like me to develop into a full persona first? Or is there another segment you think is more relevant?"

[Conversation continues through remaining steps]

MCP client: "📋 USER PERSONA GENERATOR (Completed)
✓ Step 1: Analyze business concept
✓ Step 2: Identify user segments
✓ Step 3: Develop detailed persona profile
✓ Step 4: Define challenges, pain points, and goals
✓ Step 5: Describe motivations, decision factors, and hesitations
✓ Step 6: Create usage context and technology comfort profile
✓ Step 7: Generate a first-person narrative
✓ Step 8: Formulate strategic questions

📄 Generated Artifact:

### user-persona.md
Comprehensive user persona with actionable insights for business planning

I've created a detailed persona for Mia, a 28-year-old urban professional who represents your 'Committed Climate Advocate' segment. The persona includes her full profile, challenges, motivations, usage patterns, and strategic questions to help guide your app development and marketing strategies."
```

### Example 2: North Star Metric Strategy

```
User: "Can you help our SaaS company identify the right North Star metric? We offer project management software for construction teams."

MCP client: "I'll help you identify your ideal North Star metric using a structured approach.

📋 NORTH STAR METRIC STRATEGY (Step 1 of 6)
→ Current step: Gather essential business context (industry, target audience, value proposition, current metrics, goals, data capabilities)

To provide you with the most effective North Star metric, please share:
a. More details about your target audience within construction
b. Your core value proposition to these customers
c. Current metrics you're tracking
d. Your strategic business goals
e. Data tracking capabilities your platform has"

User: "Our target audience is mid-sized construction firms. Our value proposition is increasing on-site efficiency by 40% through real-time collaboration. We currently track monthly active users, feature adoption, and churn rate. Our goal is to increase annual recurring revenue by 200% next year. We have comprehensive user activity tracking."

MCP client: "📋 NORTH STAR METRIC STRATEGY (Step 2 of 6)
✓ Step 1: Gather essential business context
→ Current step: Analyze business model and value proposition to understand what drives sustainable success

Based on your context, I'll analyze what truly drives sustainable success for your construction project management SaaS:

Your core value proposition centers on increasing on-site efficiency through real-time collaboration. This suggests that successful customers are those who:
1. Actively use the platform across multiple team members
2. Utilize the real-time collaboration features
3. Experience measurable efficiency improvements

What matters most is not just usage, but collaborative usage that leads to efficiency gains. This is what drives renewals and expansion.

Would you agree with this assessment of your value drivers? Is there anything else critical to your business model I should consider?"

[Conversation continues through remaining steps]

MCP client: "📋 NORTH STAR METRIC STRATEGY (Completed)
✓ Step 1: Gather essential business context
✓ Step 2: Analyze business model and value proposition
✓ Step 3: Evaluate current KPIs and metrics
✓ Step 4: Identify ONE North Star metric
✓ Step 5: Break down the North Star metric into actionable levers
✓ Step 6: Prioritize levers and create implementation plan

📄 Generated Artifact:

### north-star-strategy.md
Comprehensive North Star metric strategy with actionable implementation plan

Based on our analysis, I recommend 'Weekly Active Projects with 5+ Daily Active Users' as your North Star metric, with a complete implementation strategy and actionable levers to drive growth."
```

### Example 2: Solution Architecture Planning

```
User: "I need to plan the architecture for our new e-commerce platform that needs to handle high traffic and integrate with multiple payment providers."

MCP client: "I'll help you plan this architecture using a structured approach.

📋 SOLUTION ARCHITECTURE PLANNING (Step 1 of 5)
→ Current step: Set Initial Context - Break down the project description into core components (aim, problem, users, technical constraints)

Let's start by clearly defining the project context. Could you provide more details about:
1. The specific aims of the e-commerce platform
2. The key problems it's trying to solve
3. The primary user types who will interact with it
4. Any specific technical constraints we should consider?"

User: "The platform aims to sell fashion products globally with personalized recommendations. Problems include handling seasonal traffic spikes and supporting multiple currencies and payment methods. Users include shoppers, merchants, and administrators. Must be mobile-responsive and GDPR compliant."

MCP client: "📋 SOLUTION ARCHITECTURE PLANNING (Step 2 of 5)
✓ Step 1: Set Initial Context - Break down the project description into core components
→ Current step: Feature Definition - Form a prioritized feature list using the MoSCoW framework (Must, Should, Could, Won't)

Based on the context provided, let's define and prioritize features using the MoSCoW framework:

Must-Have Features (MVP requirements):
- User authentication and account management
- Product catalog with search and filtering
- Shopping cart and checkout process
- Payment processing with at least 2 major providers
- Order management for customers and administrators
- Mobile-responsive design
- GDPR compliance mechanisms

What other features would you categorize as Must-Have, Should-Have, Could-Have, or Won't-Have for the initial release?"

[Conversation continues through remaining steps]

MCP client: "📋 SOLUTION ARCHITECTURE PLANNING (Completed)
✓ Step 1: Set Initial Context - Break down the project description
✓ Step 2: Feature Definition - Form a prioritized feature list using MoSCoW framework
✓ Step 3: Initial Technical Analysis - Research and validate technical approach
✓ Step 4: Create Technical Approach Document - Document architecture decisions
✓ Step 5: Create Task Breakdown - Develop structured task list

📄 Generated Artifacts:

### technical-approach.md
Comprehensive technical approach documentation

### tasks.md
Prioritized task breakdown with dependencies and acceptance criteria

Based on our structured analysis, I've prepared complete documentation for your e-commerce platform architecture and implementation plan."
```

### Example 2: API Design Analysis

```
User: "Let's analyze this API design systematically"

MCP client: "I'll analyze the API design using a structured approach.

📋 ANALYSIS TEMPLATE (Step 1 of 5)
→ Current step: Define the problem statement clearly

Let's start by clearly defining what we're analyzing. Could you provide details about the API's purpose and requirements?"

User: "I need to design a RESTful API for user management with authentication."

MCP client: "📋 ANALYSIS TEMPLATE (Step 2 of 5)
✓ Step 1: Define the problem statement - Design a RESTful API for user management with authentication
→ Current step: Identify key components and variables

For this user management API, let's identify the key components:

1. User resources (create, read, update, delete)
2. Authentication endpoints (login, logout, refresh)
3. Authorization mechanisms
4. Data models and relationships

Are there any specific requirements for these components or additional ones we should consider?"

[Conversation continues through remaining steps]

MCP client: "📋 ANALYSIS TEMPLATE (Completed)
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

MCP client: "I'll help you analyze this test failure using a systematic approach.

📋 SYSTEMATIC DEBUGGING (Step 1 of 7)
→ Current step: Reproduce the issue with a minimal example

Could you share the specific test that's failing, including the error message and any relevant code? This will help us establish a clear reproduction case."

User: "The test is failing with: 'AssertionError: expected 42 but got undefined'. Here's the test and implementation..."

MCP client: "📋 SYSTEMATIC DEBUGGING (Step 2 of 7)
✓ Step 1: Reproduced the issue with test case X
→ Current step: Examine error messages and logs

Based on the error message 'AssertionError: expected 42 but got undefined', it appears the function isn't returning a value. Let's look at what might be causing this. Are there any additional logs or stack traces available?"

[Debugging process continues through all steps]

MCP client: "📋 SYSTEMATIC DEBUGGING (Completed)
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

MCP client: "I'll create a custom template for API security audits.

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

MCP client: "📋 API SECURITY AUDIT (Step 1 of 8)
→ Current step: Identify authentication methods

Let's start by identifying all authentication methods used in your payment API. What authentication mechanisms are currently implemented?"

[Process continues through the custom template]
```

### Example 4: Verification Thinking for Technical Claims

```
User: "Can you verify if Python is really faster than JavaScript for data processing?"

MCP client: "I'll help verify that claim systematically using verification thinking.

🔍 VERIFICATION (Initial Assessment)
Claim: Python is faster than JavaScript for data processing
Initial confidence: Medium (0.6)

Let's start by identifying the specific evidence for this claim. What aspects of data processing are you particularly interested in?"

User: "I've heard that Python with NumPy is much faster for numerical operations than JavaScript."

MCP client: "🔍 VERIFICATION (Evidence Collection)
Claim: Python is faster than JavaScript for data processing
Current confidence: 0.65

Evidence collected:
✓ Python has specialized libraries like NumPy, which uses optimized C code for numerical operations
✓ NumPy's vectorized operations avoid loops, providing significant performance benefits
✓ Python's scientific ecosystem (SciPy, Pandas) is built on these optimized foundations

Are there any specific data processing tasks you're comparing, or specific JavaScript implementations/libraries I should consider in this verification?"

User: "What about JavaScript's V8 engine and libraries like TensorFlow.js?"

MCP client: "🔍 VERIFICATION (Counter Evidence Analysis)
Claim: Python is faster than JavaScript for data processing
Current confidence: 0.5 (adjusted)

Counter-evidence to consider:
✓ JavaScript's V8 engine has significant optimizations for array operations
✓ TensorFlow.js leverages WebGL for GPU acceleration, potentially outperforming CPU-bound Python
✓ JavaScript's async nature can provide better throughput for I/O-bound data processing
✓ Browser-based JavaScript can avoid data transfer costs for web applications

This reveals that the original claim is too broad. Let me refine the assessment..."

User: "That makes sense. What's your final verdict?"

MCP client: "🔍 VERIFICATION (Conclusion)
Claim: Python is faster than JavaScript for data processing
Final confidence: Context-dependent (0.6)

Verified assessment:
✓ Python with NumPy/SciPy is generally faster for numerical computing and scientific workloads
✓ JavaScript can be faster for web-based data processing, especially when using GPU acceleration
✓ The performance difference depends on:
  - Specific type of data processing task
  - Implementation details and libraries used
  - Deployment environment constraints
  - Data size and memory requirements

Recommendation: For purely numerical computing tasks, Python with NumPy likely offers better performance. For web-based applications or real-time data processing, JavaScript may be advantageous.

Would you like to explore any specific data processing scenario for a more precise assessment?"
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
console.log(result.formattedOutput);  // Formatted text for MCP client to present to user
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

// Adding context-specific factors
const refinedResult = await verificationThinkingTool.processThought({
  command: {
    type: 'add-context-factors',
    verificationId: result.verificationId,
    contextFactors: [
      'Type of data processing (numerical vs. text)',
      'Environment constraints (web vs. server)',
      'Data volume and memory requirements'
    ]
  }
}, context);

// Finalizing the verification with a conclusion
const finalResult = await verificationThinkingTool.processThought({
  command: {
    type: 'finalize-verification',
    verificationId: result.verificationId,
    finalConfidence: 0.6,
    conclusion: 'Performance depends on specific use case and environment'
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

## Integration With MCP Clients

Structured Thinking integrates with MCP clients through:

1. **Tool Interface**: Client invokes the tool with problem descriptions
2. **Formatted Output**: Results are formatted for the client's chat interface
3. **Context Preservation**: Thinking state is maintained across interactions

## Getting Started

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Future Directions

1. **Enhanced Pattern Recognition**: More sophisticated context understanding
2. **Domain-Specific Templates**: Pre-built templates for specialized domains
3. **Multi-Tool Thinking**: Combining multiple thinking approaches for complex problems
4. **Visual Thinking Maps**: Graphical representation of thinking processes
5. **Artifact Generation**: Standardized document generation capabilities for various domains
