import chalk from 'chalk';
import { 
  TemplateCategory,
  ThinkingStep,
  ThinkingTemplate,
  TemplateSession
} from './types.js';
import { ThinkingContext } from '../../common/types.js';
import { PersistenceManager, TemplateData } from '../../common/persistence/index.js';
import { builtInTemplates } from './templates/index.js';

export class TemplateManager {
  private templates: Map<string, ThinkingTemplate> = new Map();
  private sessions: Map<string, TemplateSession> = new Map();
  private currentSessionId: string | null = null;
  private persistence: PersistenceManager<TemplateData>;
  private stepCounter = 0;
  private sessionCounter = 0;
  private templateCounter = 0;

  // Built-in templates - only include templates from the templates directory
  private readonly builtInTemplates: ThinkingTemplate[] = [
    // Include imported templates from the templates directory
    ...builtInTemplates
  ];

  constructor() {
    // Initialize persistence manager with default data
    this.persistence = new PersistenceManager<TemplateData>('templates', {
      templates: {},
      sessionCounter: 0,
      templateCounter: 0,
      stepCounter: 0
    });
    
    // Initialize asynchronously - we'll load data when needed
    this.initializeAsync();
  }
  
  /**
   * Initializes persistence and data async
   */
  private async initializeAsync(): Promise<void> {
    try {
      await this.persistence.initialize();
      await this.loadData();
    } catch (error) {
      console.error(`Error initializing template manager: ${error}`);
      
      // If persistence fails, initialize with built-in templates
      this.builtInTemplates.forEach(template => {
        this.templates.set(template.id, template);
      });
    }
  }
  
  /**
   * Load data from persistence
   */
  private async loadData(): Promise<void> {
    const data = await this.persistence.getData();
    
    // Initialize counters
    this.sessionCounter = data.sessionCounter;
    this.templateCounter = data.templateCounter;
    this.stepCounter = data.stepCounter;
    
    // Load templates
    this.templates.clear();
    
    // First add built-in templates
    this.builtInTemplates.forEach(template => {
      this.templates.set(template.id, {
        ...template,
        usageCount: 0,
        lastUsed: undefined
      });
    });
    
    // Then load custom templates (which might override built-ins)
    for (const [id, template] of Object.entries(data.templates)) {
      // Convert ISO date strings back to Date objects
      const createdAt = new Date(template.createdAt);
      const lastUsed = template.lastUsed ? new Date(template.lastUsed) : undefined;
      
      this.templates.set(id, {
        ...template,
        createdAt,
        lastUsed
      });
    }
    
    console.error(`Loaded ${this.templates.size} templates`);
  }
  
  /**
   * Save data to persistence
   */
  private async saveData(): Promise<void> {
    // Extract custom templates to save
    const customTemplates: Record<string, any> = {};
    for (const [id, template] of this.templates.entries()) {
      // Only save non-built-in templates, plus usage data for built-ins
      if (!template.isBuiltIn || template.usageCount > 0) {
        customTemplates[id] = template;
      }
    }
    
    const data: TemplateData = {
      templates: customTemplates,
      sessionCounter: this.sessionCounter,
      templateCounter: this.templateCounter,
      stepCounter: this.stepCounter
    };
    
    await this.persistence.save(data);
  }

  generateId(prefix: string): string {
    let counter = 0;
    
    switch (prefix) {
      case 'step':
        counter = ++this.stepCounter;
        break;
      case 'session':
        counter = ++this.sessionCounter;
        break;
      case 'template':
        counter = ++this.templateCounter;
        break;
      default:
        counter = Date.now();
    }
    
    return `${prefix}-${counter}`;
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

  async createTemplate(name: string, category: TemplateCategory, description: string, steps: {content: string, order: number}[]): Promise<ThinkingTemplate> {
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
    
    // Save the updated data
    await this.saveData();
    
    return template;
  }

  async createSession(templateId: string): Promise<TemplateSession> {
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
    
    // Save the updated data
    await this.saveData();
    
    return session;
  }

  getSession(sessionId: string): TemplateSession | undefined {
    return this.sessions.get(sessionId);
  }

  getCurrentSession(): TemplateSession | undefined {
    return this.currentSessionId ? this.sessions.get(this.currentSessionId) : undefined;
  }

  async updateStep(sessionId: string, stepId: string, content: string): Promise<ThinkingStep> {
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
    
    // Save the updated data
    await this.saveData();
    
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