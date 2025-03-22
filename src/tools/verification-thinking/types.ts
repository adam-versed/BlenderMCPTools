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