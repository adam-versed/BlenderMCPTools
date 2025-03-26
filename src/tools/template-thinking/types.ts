export type TemplateCategory = 
  'analysis' | 
  'planning' | 
  'debugging' | 
  'decision' | 
  'research' | 
  'verification' | 
  'custom';

export interface ThinkingStep {
  id: string;
  content: string;
  order: number;
  isComplete: boolean;
  notes?: string;
}

export interface ThinkingTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  steps: ThinkingStep[];
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
  isBuiltIn: boolean;
}

export interface TemplateSession {
  id: string;
  templateId: string;
  currentStepIndex: number;
  steps: ThinkingStep[];
  startTime: Date;
  endTime?: Date;
  context?: string;
}

export interface TemplateThinkingInput {
  templateId?: string;
  category?: TemplateCategory;
  sessionId?: string;
  content?: string;
  stepId?: string;
  createTemplate?: {
    name: string;
    category: TemplateCategory;
    description: string;
    steps: {
      content: string;
      order: number;
    }[];
  };
  command?: {
    type: string;
    templateId?: string;
    sessionId?: string;
    problemDescription?: string;
    wasAccepted?: boolean;
    limit?: number;
  };
}