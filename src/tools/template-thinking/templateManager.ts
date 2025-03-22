import chalk from 'chalk';
import { 
  TemplateCategory,
  ThinkingStep,
  ThinkingTemplate,
  TemplateSession
} from './types.js';
import { ThinkingContext } from '../../common/types.js';

export class TemplateManager {
  private templates: Map<string, ThinkingTemplate> = new Map();
  private sessions: Map<string, TemplateSession> = new Map();
  private currentSessionId: string | null = null;

  // Built-in templates
  private readonly builtInTemplates: ThinkingTemplate[] = [
    {
      id: 'analysis-template',
      name: 'Standard Analysis',
      category: 'analysis',
      description: 'A template for breaking down complex problems into analyzable components',
      steps: [
        {
          id: 'step-1',
          content: 'Define the problem statement clearly',
          order: 1,
          isComplete: false
        },
        {
          id: 'step-2',
          content: 'Identify key components and variables',
          order: 2,
          isComplete: false
        },
        {
          id: 'step-3',
          content: 'Analyze relationships between components',
          order: 3,
          isComplete: false
        },
        {
          id: 'step-4',
          content: 'Evaluate potential approaches',
          order: 4,
          isComplete: false
        },
        {
          id: 'step-5',
          content: 'Summarize findings and recommend solutions',
          order: 5,
          isComplete: false
        }
      ],
      createdAt: new Date(),
      usageCount: 0,
      isBuiltIn: true
    },
    {
      id: 'decision-template',
      name: 'Decision Making Framework',
      category: 'decision',
      description: 'Structured approach for making decisions with multiple criteria',
      steps: [
        {
          id: 'step-1',
          content: 'Define the decision to be made',
          order: 1,
          isComplete: false
        },
        {
          id: 'step-2',
          content: 'List all available options',
          order: 2,
          isComplete: false
        },
        {
          id: 'step-3',
          content: 'Establish decision criteria and priorities',
          order: 3,
          isComplete: false
        },
        {
          id: 'step-4',
          content: 'Evaluate each option against the criteria',
          order: 4,
          isComplete: false
        },
        {
          id: 'step-5',
          content: 'Identify potential risks of each option',
          order: 5,
          isComplete: false
        },
        {
          id: 'step-6',
          content: 'Make a decision and document rationale',
          order: 6,
          isComplete: false
        }
      ],
      createdAt: new Date(),
      usageCount: 0,
      isBuiltIn: true
    },
    {
      id: 'debugging-template',
      name: 'Systematic Debugging',
      category: 'debugging',
      description: 'Step-by-step approach to identify and fix issues in code',
      steps: [
        {
          id: 'step-1',
          content: 'Reproduce the issue with a minimal example',
          order: 1,
          isComplete: false
        },
        {
          id: 'step-2',
          content: 'Examine error messages and logs',
          order: 2,
          isComplete: false
        },
        {
          id: 'step-3',
          content: 'Formulate hypothesis about the cause',
          order: 3,
          isComplete: false
        },
        {
          id: 'step-4',
          content: 'Test hypothesis with experiments',
          order: 4,
          isComplete: false
        },
        {
          id: 'step-5',
          content: 'Implement a fix',
          order: 5,
          isComplete: false
        },
        {
          id: 'step-6',
          content: 'Verify the fix resolves the issue',
          order: 6,
          isComplete: false
        },
        {
          id: 'step-7',
          content: 'Document the issue and solution',
          order: 7,
          isComplete: false
        }
      ],
      createdAt: new Date(),
      usageCount: 0,
      isBuiltIn: true
    },
    {
      id: 'planning-template',
      name: 'Implementation Planning',
      category: 'planning',
      description: 'Systematic approach to plan the implementation of a feature or project',
      steps: [
        {
          id: 'step-1',
          content: 'Define objectives and success criteria',
          order: 1,
          isComplete: false
        },
        {
          id: 'step-2',
          content: 'Identify required resources and dependencies',
          order: 2,
          isComplete: false
        },
        {
          id: 'step-3',
          content: 'Break down into actionable tasks',
          order: 3,
          isComplete: false
        },
        {
          id: 'step-4',
          content: 'Estimate effort and timeline for each task',
          order: 4,
          isComplete: false
        },
        {
          id: 'step-5',
          content: 'Identify potential risks and mitigation strategies',
          order: 5,
          isComplete: false
        },
        {
          id: 'step-6',
          content: 'Define testing and validation approach',
          order: 6,
          isComplete: false
        },
        {
          id: 'step-7',
          content: 'Create implementation roadmap with milestones',
          order: 7,
          isComplete: false
        }
      ],
      createdAt: new Date(),
      usageCount: 0,
      isBuiltIn: true
    },
    {
      id: 'research-template',
      name: 'Research Methodology',
      category: 'research',
      description: 'Structured approach for conducting research on a topic',
      steps: [
        {
          id: 'step-1',
          content: 'Define research question or objective',
          order: 1,
          isComplete: false
        },
        {
          id: 'step-2',
          content: 'Collect preliminary information and background',
          order: 2,
          isComplete: false
        },
        {
          id: 'step-3',
          content: 'Identify key sources and resources',
          order: 3,
          isComplete: false
        },
        {
          id: 'step-4',
          content: 'Analyze and synthesize findings',
          order: 4,
          isComplete: false
        },
        {
          id: 'step-5',
          content: 'Identify gaps or areas requiring deeper investigation',
          order: 5,
          isComplete: false
        },
        {
          id: 'step-6',
          content: 'Draw conclusions based on evidence',
          order: 6,
          isComplete: false
        },
        {
          id: 'step-7',
          content: 'Summarize findings and suggest next steps',
          order: 7,
          isComplete: false
        }
      ],
      createdAt: new Date(),
      usageCount: 0,
      isBuiltIn: true
    },
    {
      id: 'verification-template',
      name: 'Systematic Verification',
      category: 'verification',
      description: 'Template for methodically verifying a claim or hypothesis',
      steps: [
        {
          id: 'step-1',
          content: 'State the claim or hypothesis precisely',
          order: 1,
          isComplete: false
        },
        {
          id: 'step-2',
          content: 'Break down the claim into testable components',
          order: 2,
          isComplete: false
        },
        {
          id: 'step-3',
          content: 'Identify necessary evidence to confirm or refute',
          order: 3,
          isComplete: false
        },
        {
          id: 'step-4',
          content: 'Test each component systematically',
          order: 4,
          isComplete: false
        },
        {
          id: 'step-5',
          content: 'Look for counter-examples or edge cases',
          order: 5,
          isComplete: false
        },
        {
          id: 'step-6',
          content: 'Assess overall validity with confidence level',
          order: 6,
          isComplete: false
        },
        {
          id: 'step-7',
          content: 'Document verification process and results',
          order: 7,
          isComplete: false
        }
      ],
      createdAt: new Date(),
      usageCount: 0,
      isBuiltIn: true
    }
  ];

  constructor() {
    // Initialize with built-in templates
    this.builtInTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  generateId(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
  }

  getTemplateById(templateId: string): ThinkingTemplate | undefined {
    return this.templates.get(templateId);
  }

  getAllTemplates(): ThinkingTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category: TemplateCategory): ThinkingTemplate[] {
    return this.getAllTemplates().filter(t => t.category === category);
  }

  createTemplate(name: string, category: TemplateCategory, description: string, steps: {content: string, order: number}[]): ThinkingTemplate {
    const templateId = this.generateId('template');
    
    const template: ThinkingTemplate = {
      id: templateId,
      name,
      category,
      description,
      steps: steps.map(step => ({
        id: this.generateId('step'),
        content: step.content,
        order: step.order,
        isComplete: false
      })),
      createdAt: new Date(),
      usageCount: 0,
      isBuiltIn: false
    };
    
    this.templates.set(templateId, template);
    return template;
  }

  createSession(templateId: string): TemplateSession {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    // Increment the usage count of the template
    template.usageCount++;
    template.lastUsed = new Date();
    
    const sessionId = this.generateId('session');
    const session: TemplateSession = {
      id: sessionId,
      templateId,
      currentStepIndex: 0,
      steps: JSON.parse(JSON.stringify(template.steps)), // Deep copy the steps
      startTime: new Date()
    };
    
    this.sessions.set(sessionId, session);
    this.currentSessionId = sessionId;
    
    return session;
  }

  getSession(sessionId: string): TemplateSession | undefined {
    return this.sessions.get(sessionId);
  }

  getCurrentSession(): TemplateSession | undefined {
    return this.currentSessionId ? this.sessions.get(this.currentSessionId) : undefined;
  }

  updateStep(sessionId: string, stepId: string, content: string): ThinkingStep {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    
    const step = session.steps.find(s => s.id === stepId);
    if (!step) {
      throw new Error(`Step ${stepId} not found in session ${sessionId}`);
    }
    
    step.content = content;
    step.isComplete = true;
    
    // Automatically move to the next step if there is one
    const currentIndex = session.steps.findIndex(s => s.id === stepId);
    if (currentIndex < session.steps.length - 1) {
      session.currentStepIndex = currentIndex + 1;
    } else {
      // If we completed the last step, mark the session as complete
      session.endTime = new Date();
    }
    
    return step;
  }

  formatForIDEChat(session: TemplateSession, context: ThinkingContext): string {
    const template = this.getTemplateById(session.templateId);
    if (!template) {
      return 'Error: Template not found';
    }
    
    let output = `Template: ${template.name} (${template.category})\n\n`;
    output += `${template.description}\n\n`;
    
    // Display progress
    const completedSteps = session.steps.filter(s => s.isComplete).length;
    const totalSteps = session.steps.length;
    output += `Progress: ${completedSteps}/${totalSteps} steps completed\n\n`;
    
    // Display steps
    session.steps.forEach((step, index) => {
      const isCurrent = index === session.currentStepIndex;
      const status = step.isComplete ? '✓' : isCurrent ? '→' : '○';
      output += `${status} Step ${index + 1}: ${step.content}\n`;
      
      if (step.isComplete && step.notes) {
        output += `   Notes: ${step.notes}\n`;
      }
      
      if (isCurrent) {
        output += `   (Current step)\n`;
      }
      
      output += '\n';
    });
    
    return output;
  }
}