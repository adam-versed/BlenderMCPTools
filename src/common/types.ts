// Common type definitions for structured thinking tools

// Base types for all thinking tools
export interface ThinkingContext {
  projectStructure?: string;
  outputFormat: ChatOutputFormatting;
}

export interface ChatOutputFormatting {
  isMinimized: boolean;
  indentLevel: number;
}

// Thinking tool base interface
export interface ThinkingTool {
  name: string;
  description: string;
  processThought(input: unknown, context: ThinkingContext): ThinkingResponse;
  formatForIDEChat(input: unknown, context: ThinkingContext): string;
  handleCommand(command: any, context: ThinkingContext): ThinkingResponse;
}

export interface ThinkingResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

// Thinking style definitions
export type ThinkingStyle = 'branch' | 'template' | 'verification';

// Branch thinking types
export type BranchState = 'active' | 'suspended' | 'completed' | 'dead_end';
export type InsightType = 'behavioral_pattern' | 'feature_integration' | 'observation' | 'connection';
export type CrossRefType = 'complementary' | 'contradictory' | 'builds_upon' | 'alternative';

export interface ThoughtData {
  id: string;
  content: string;
  branchId: string;
  timestamp: Date;
  metadata: {
    type: string;
    confidence: number;
    keyPoints: string[];
  };
}

export interface Insight {
  id: string;
  type: InsightType;
  content: string;
  context: string[];
  parentInsights?: string[];
  applicabilityScore: number;
  supportingEvidence: {
    crossRefs?: string[];
    pattern?: string;
    data?: string[];
  };
}

export interface CrossReference {
  id: string;
  fromBranch: string;
  toBranch: string;
  type: CrossRefType;
  reason: string;
  strength: number;
  touchpoints: Array<{
    fromThought: string;
    toThought: string;
    connection: string;
  }>;
  relatedInsights?: string[];
}

export interface ThoughtBranch {
  id: string;
  parentBranchId?: string;
  state: BranchState;
  priority: number;
  confidence: number;
  thoughts: ThoughtData[];
  insights: Insight[];
  crossRefs: CrossReference[];
}

export interface BranchingThoughtInput {
  content: string;
  branchId?: string;
  parentBranchId?: string;
  type: string;
  confidence?: number;
  keyPoints?: string[];
  relatedInsights?: string[];
  crossRefs?: Array<{
    toBranch: string;
    type: CrossRefType;
    reason: string;
    strength: number;
  }>;
  projectStructure?: string;
  command?: {
    type: string;
    branchId?: string;
  };
}

// Template thinking types
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
  projectStructure?: string;
}

export interface TemplateThinkingInput {
  templateId?: string;
  category?: TemplateCategory;
  sessionId?: string;
  content?: string;
  stepId?: string;
  projectStructure?: string;
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
  };
}

// Verification thinking types
export type VerificationStatus = 
  'pending' | 
  'in_progress' | 
  'verified' | 
  'failed' | 
  'skipped';

export type VerificationType = 
  'logical' | 
  'factual' |
  'code' |
  'mathematical' |
  'consistency' |
  'completeness' |
  'custom';

export interface VerificationStep {
  id: string;
  type: VerificationType;
  claim: string;
  verification: string;
  status: VerificationStatus;
  confidence: number;
  evidence?: string;
  counterExample?: string;
}

export interface VerificationChain {
  id: string;
  subject: string;
  steps: VerificationStep[];
  overallStatus: VerificationStatus;
  startTime: Date;
  endTime?: Date;
  projectStructure?: string;
}

export interface VerificationThinkingInput {
  chainId?: string;
  stepId?: string;
  subject?: string;
  claim?: string;
  type?: VerificationType;
  verification?: string;
  evidence?: string;
  counterExample?: string;
  projectStructure?: string;
  command?: {
    type: string;
    chainId?: string;
    stepId?: string;
  };
}