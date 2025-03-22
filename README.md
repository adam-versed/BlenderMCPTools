# Structured Thinking

A unified MCP server for multiple structured thinking tools that help Claude organize its thoughts in complex problem-solving scenarios. This server provides:

- **Branch Thinking**: Navigate multiple branches of thought with cross-references and insights
- **Template Thinking**: Use structured templates for different thinking styles
- **Verification Thinking**: Systematically verify claims and assumptions

## Overview

Structured Thinking provides a collection of complementary thinking tools that help Claude break down complex problems, explore multiple solution paths, and verify its reasoning. Each tool serves a different purpose but shares a common interface and can be used together.

## Tools Included

### Branch Thinking

Evolved from the original branch-thinking tool, this enables:

- Multiple branches of thought
- Branch navigation (list, focus, history)
- Cross-references between related thoughts
- Insight generation from key points
- Branch priority tracking
- IDE Chat output format
- Project structure context

### Template Thinking

Uses predefined or custom templates to guide structured thinking:

- Analysis frameworks for breaking down complex problems
- Decision making with criteria evaluation
- Debugging approaches for systematic troubleshooting
- Planning templates for implementation steps
- Custom templates for domain-specific thinking

### Verification Thinking

Provides systematic verification of claims and assertions:

- Logical verification of reasoning steps
- Factual verification of claims
- Code correctness verification
- Mathematical proof verification
- Consistency checking across statements
- Counter-example generation

## Installation

Place this project in your custom MCP tool directory:

```bash
cd /your-custom-mcp-dir
git clone https://github.com/adam-versed/structured-thinking.git
cd structured-thinking
npm install
npm run build 
```

Add to your `claude_desktop_config.json`:

```json
"branch-thinking": {
  "command": "node",
  "args": [
    "/your-custom-mcp-dir-here/structured-thinking/dist/index.js"
  ]
},
"template-thinking": {
  "command": "node",
  "args": [
    "/your-custom-mcp-dir-here/structured-thinking/dist/index.js"
  ]
},
"verification-thinking": {
  "command": "node",
  "args": [
    "/your-custom-mcp-dir-here/structured-thinking/dist/index.js"
  ]
}
```

## Using Project Structure

All tools support project structure context. You can provide project structure information in markdown format:

```javascript
// Example using project structure with branch thinking
claude.branchThinking({
  content: "Let's analyze how to implement the requested feature", 
  type: "analysis",
  projectStructure: `
# Project Structure
- src/
  - components/
    - Button.tsx
    - Form.tsx
  - utils/
    - api.ts
    - helpers.ts
- tests/
  - unit/
  - integration/
`
});
```

## Usage Tips

To encourage Claude to use these tools, add to your Claude Profile Settings (or system prompt):

_When I ask you to "think step by step," use branch-thinking. When I ask you to "analyze methodically," use template-thinking. When I ask you to "verify your reasoning," use verification-thinking._

## Example Usage

### Branch Thinking

```javascript
// Create a new thought
claude.branchThinking({
  content: "Let's explore different approaches to implement the authentication system",
  type: "exploration",
  keyPoints: ["Must support OAuth", "Need session management", "Consider JWT tokens"]
});

// Add a thought to a specific branch with cross-reference
claude.branchThinking({
  branchId: "branch-1234567890",
  content: "The JWT approach seems most promising for our stateless architecture",
  type: "analysis",
  crossRefs: [{
    toBranch: "branch-0987654321",
    type: "builds_upon",
    reason: "Incorporates the security considerations from security analysis",
    strength: 0.8
  }]
});

// List all branches
claude.branchThinking({
  command: { type: "list" }
});

// Focus on a specific branch
claude.branchThinking({
  command: { type: "focus", branchId: "branch-1234567890" }
});
```

### Template Thinking

```javascript
// Start a new session with the analysis template
claude.templateThinking({
  templateId: "analysis-template"
});

// Update a step in the session
claude.templateThinking({
  sessionId: "session-1234567890",
  stepId: "step-1",
  content: "We need to implement a user authentication system that supports both password and OAuth login methods."
});

// List available templates
claude.templateThinking({
  command: { type: "list-templates" }
});

// Create a custom template
claude.templateThinking({
  createTemplate: {
    name: "API Design Review",
    category: "analysis",
    description: "Template for reviewing API designs",
    steps: [
      { content: "Review API endpoints for RESTfulness", order: 1 },
      { content: "Validate request/response schemas", order: 2 },
      { content: "Check error handling", order: 3 },
      { content: "Assess security considerations", order: 4 },
      { content: "Evaluate performance implications", order: 5 }
    ]
  }
});
```

### Verification Thinking

```javascript
// Start a new verification chain
claude.verificationThinking({
  subject: "Authentication system security analysis"
});

// Add a verification step
claude.verificationThinking({
  chainId: "chain-1234567890",
  type: "logical",
  claim: "JWT tokens with proper expiration times will prevent session hijacking",
  verification: "This is partially true. While proper expiration helps mitigate some risks, it doesn't fully prevent token theft via XSS attacks."
});

// Update a verification step with evidence
claude.verificationThinking({
  chainId: "chain-1234567890",
  stepId: "step-1234567890",
  verification: "Research confirms that while JWT expiration is important, it must be combined with secure transmission (HTTPS) and proper storage (HttpOnly cookies).",
  status: "verified",
  evidence: "OWASP best practices document recommends multiple layers of protection beyond just token expiration."
});

// List all chains
claude.verificationThinking({
  command: { type: "list-chains" }
});
```

## Credits

Based on the branch-thinking tool by m-siles, which was based on the sequential-thinking tool by the Model Context Protocol. Enhanced with additional thinking tools, IDE chat output formatting, and project structure support.