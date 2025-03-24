/**
 * Persistence data models
 */

// Template persistence
export interface TemplateData {
  templates: Record<string, any>;
  sessionCounter: number;
  templateCounter: number;
  stepCounter: number;
}

// Verification persistence
export interface VerificationData {
  chains: Record<string, any>;
  stepCounter: number;
  chainCounter: number;
}
