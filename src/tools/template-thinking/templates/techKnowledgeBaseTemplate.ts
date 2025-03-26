import { ThinkingTemplate } from '../types.js';

export const techKnowledgeBaseTemplate: ThinkingTemplate = {
  id: 'tech-knowledge-base-template',
  name: 'Technical Knowledge Base Generator',
  category: 'research',
  description: 'Create comprehensive, well-structured technical documentation that combines theoretical understanding with practical implementation guidance.',
  steps: [
    {
      id: 'step-1',
      content: 'Define and scope the technical topic, breaking it down into key components and necessary research areas',
      order: 1,
      isComplete: false
    },
    {
      id: 'step-2',
      content: 'Research using authoritative sources (official docs, GitHub repositories, expert blogs, etc.)',
      order: 2,
      isComplete: false
    },
    {
      id: 'step-3',
      content: 'Create introduction (overview, historical context, relevance, key use cases)',
      order: 3,
      isComplete: false
    },
    {
      id: 'step-4',
      content: 'Define core concepts (fundamental principles, architecture, key terminology)',
      order: 4,
      isComplete: false
    },
    {
      id: 'step-5',
      content: 'Create getting started guide (installation, basic configuration, minimal example)',
      order: 5,
      isComplete: false
    },
    {
      id: 'step-6',
      content: 'Document best practices (industry standards, design patterns, security considerations)',
      order: 6,
      isComplete: false
    },
    {
      id: 'step-7',
      content: 'Provide common patterns and examples with sample code',
      order: 7,
      isComplete: false
    },
    {
      id: 'step-8',
      content: 'Add troubleshooting section (common errors, debugging techniques, performance issues)',
      order: 8,
      isComplete: false
    },
    {
      id: 'step-9',
      content: 'Cover advanced topics (scaling, integration, advanced features)',
      order: 9,
      isComplete: false
    },
    {
      id: 'step-10',
      content: 'Compile resources and references (official docs, learning resources, communities)',
      order: 10,
      isComplete: false
    }
  ],
  createdAt: new Date(),
  usageCount: 0,
  isBuiltIn: true,
  artifacts: {
    'technical-knowledge-base.md': {
      description: 'Comprehensive technical documentation with theoretical and practical guidance',
      template: `# [Topic Name] Knowledge Base

## Table of Contents

- [Introduction](#introduction)
- [Core Concepts](#core-concepts)
- [Getting Started](#getting-started)
- [Best Practices](#best-practices)
- [Common Patterns and Examples](#common-patterns-and-examples)
- [Troubleshooting](#troubleshooting)
- [Advanced Topics](#advanced-topics)
- [Resources](#resources)

## Introduction

### Overview

[Provide a clear, concise overview of the technology or topic]

### Historical Context

[Brief history and evolution of the technology]

### Current Relevance

[Explain why this technology matters in the current technical landscape]

### Key Use Cases

- [Use case 1]
- [Use case 2]
- [Use case 3]

## Core Concepts

### Fundamental Principles

[Explain the key principles that underpin this technology]

### Architecture / Components

[Diagram or explanation of the architecture or major components]

\`\`\`mermaid
graph TD
    A[Component A] --> B[Component B]
    A --> C[Component C]
    B --> D[Component D]
    C --> D
\`\`\`

### Technical Terminology

| Term | Definition |
|------|------------|
| [Term 1] | [Definition] |
| [Term 2] | [Definition] |
| [Term 3] | [Definition] |

## Getting Started

### Installation

\`\`\`bash
# Installation commands
command to install
\`\`\`

### Basic Configuration

\`\`\`
# Configuration example
key = value
\`\`\`

### Hello World Example

\`\`\`[language]
# A minimal working example
code sample here
\`\`\`

## Best Practices

### Industry Standards

- [Standard 1]
- [Standard 2]
- [Standard 3]

### Design Patterns

[Explain relevant design patterns for this technology]

### Performance Optimization

[Key performance optimization techniques]

### Security Considerations

> **Important:** [Critical security warning or best practice]

[Security best practices and considerations]

## Common Patterns and Examples

### Pattern 1: [Name]

[Explanation of the pattern]

\`\`\`[language]
// Code example
code sample here
\`\`\`

### Pattern 2: [Name]

[Explanation of the pattern]

\`\`\`[language]
// Code example
code sample here
\`\`\`

## Troubleshooting

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| [Error message] | [Typical cause] | [How to fix] |
| [Error message] | [Typical cause] | [How to fix] |

### Debugging Techniques

[Effective debugging approaches for this technology]

### Performance Problems

[Common performance issues and how to address them]

## Advanced Topics

### Scaling Considerations

[How to scale applications using this technology]

### Integration with Other Systems

[How to integrate with other common technologies]

### Advanced Features

[Discussion of advanced features and capabilities]

## Resources

### Official Documentation

- [Link to official documentation](url)

### Learning Resources

- [Resource 1](url)
- [Resource 2](url)
- [Resource 3](url)

### Community

- [Community resource 1](url)
- [Community resource 2](url)

### Reference Implementations

- [Reference implementation 1](url)
- [Reference implementation 2](url)

---

*This knowledge base document was generated on [Date] and represents information available at that time.*`
    }
  }
};
