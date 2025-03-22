/**
 * Schema validation utilities for the structured thinking tools
 */

import { TemplateThinkingInput } from '../tools/template-thinking/types.js';
import { VerificationThinkingInput } from '../tools/verification-thinking/types.js';

/**
 * Validate template thinking input
 */
export function validateTemplateThinkingInput(input: unknown): TemplateThinkingInput {
  const data = input as any;
  
  // For commands, we only need to validate the command type
  if (data.command) {
    if (!data.command.type || typeof data.command.type !== 'string') {
      throw new Error('Command type is required and must be a string');
    }
    
    const validCommands = ['list-templates', 'show-template', 'continue-session'];
    if (!validCommands.includes(data.command.type)) {
      throw new Error(`Invalid command type: ${data.command.type}. Valid types are: ${validCommands.join(', ')}`);
    }
    
    // For 'show-template', we need a templateId
    if (data.command.type === 'show-template' && !data.command.templateId) {
      throw new Error('Command show-template requires a templateId');
    }
    
    // For 'continue-session', we need a sessionId
    if (data.command.type === 'continue-session' && !data.command.sessionId) {
      throw new Error('Command continue-session requires a sessionId');
    }
    
    return data as TemplateThinkingInput;
  }
  
  // For creating a new template
  if (data.createTemplate) {
    if (!data.createTemplate.name || typeof data.createTemplate.name !== 'string') {
      throw new Error('Template name is required and must be a string');
    }
    
    if (!data.createTemplate.category || typeof data.createTemplate.category !== 'string') {
      throw new Error('Template category is required and must be a string');
    }
    
    if (!data.createTemplate.description || typeof data.createTemplate.description !== 'string') {
      throw new Error('Template description is required and must be a string');
    }
    
    if (!Array.isArray(data.createTemplate.steps) || data.createTemplate.steps.length === 0) {
      throw new Error('Template steps are required and must be a non-empty array');
    }
    
    for (const step of data.createTemplate.steps) {
      if (!step.content || typeof step.content !== 'string') {
        throw new Error('Each step must have a content property that is a string');
      }
      
      if (typeof step.order !== 'number' || step.order < 1) {
        throw new Error('Each step must have an order property that is a number greater than 0');
      }
    }
    
    return data as TemplateThinkingInput;
  }
  
  // For starting a new session
  if (data.templateId && !data.sessionId) {
    if (typeof data.templateId !== 'string') {
      throw new Error('templateId must be a string');
    }
    
    return data as TemplateThinkingInput;
  }
  
  // For updating a step
  if (data.sessionId && data.stepId && data.content) {
    if (typeof data.sessionId !== 'string') {
      throw new Error('sessionId must be a string');
    }
    
    if (typeof data.stepId !== 'string') {
      throw new Error('stepId must be a string');
    }
    
    if (typeof data.content !== 'string') {
      throw new Error('content must be a string');
    }
    
    return data as TemplateThinkingInput;
  }
  
  throw new Error('Invalid template thinking input: missing required parameters');
}

/**
 * Validate verification thinking input
 */
export function validateVerificationThinkingInput(input: unknown): VerificationThinkingInput {
  const data = input as any;
  
  // For commands, we only need to validate the command type
  if (data.command) {
    if (!data.command.type || typeof data.command.type !== 'string') {
      throw new Error('Command type is required and must be a string');
    }
    
    const validCommands = ['list-chains', 'show-chain'];
    if (!validCommands.includes(data.command.type)) {
      throw new Error(`Invalid command type: ${data.command.type}. Valid types are: ${validCommands.join(', ')}`);
    }
    
    // For 'show-chain', we need a chainId
    if (data.command.type === 'show-chain' && !data.command.chainId) {
      throw new Error('Command show-chain requires a chainId');
    }
    
    return data as VerificationThinkingInput;
  }
  
  // For starting a new chain
  if (data.subject && !data.chainId) {
    if (typeof data.subject !== 'string') {
      throw new Error('subject must be a string');
    }
    
    return data as VerificationThinkingInput;
  }
  
  // For adding a verification step
  if (data.chainId && data.claim && data.type) {
    if (typeof data.chainId !== 'string') {
      throw new Error('chainId must be a string');
    }
    
    if (typeof data.claim !== 'string') {
      throw new Error('claim must be a string');
    }
    
    if (typeof data.type !== 'string') {
      throw new Error('type must be a string');
    }
    
    return data as VerificationThinkingInput;
  }
  
  // For updating a verification step
  if (data.chainId && data.stepId && data.verification) {
    if (typeof data.chainId !== 'string') {
      throw new Error('chainId must be a string');
    }
    
    if (typeof data.stepId !== 'string') {
      throw new Error('stepId must be a string');
    }
    
    if (typeof data.verification !== 'string') {
      throw new Error('verification must be a string');
    }
    
    return data as VerificationThinkingInput;
  }
  
  throw new Error('Invalid verification thinking input: missing required parameters');
}

/**
 * Get the appropriate validator based on the input and tool name
 */
export function validateInput(input: unknown, toolName?: string): unknown {
  // If tool name is specified, use that
  if (toolName) {
    switch (toolName) {
      case 'template-thinking':
        return validateTemplateThinkingInput(input);
      case 'verification-thinking':
        return validateVerificationThinkingInput(input);
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }
  
  // Otherwise, try to infer from the input structure
  const data = input as any;
  
  // Check for template thinking patterns
  if (
    data.templateId || 
    data.createTemplate || 
    (data.command && ['list-templates', 'show-template', 'continue-session'].includes(data.command.type))
  ) {
    return validateTemplateThinkingInput(input);
  }
  
  // Check for verification thinking patterns
  if (
    data.subject || 
    (data.chainId && (data.claim || data.stepId)) ||
    (data.command && ['list-chains', 'show-chain'].includes(data.command.type))
  ) {
    return validateVerificationThinkingInput(input);
  }
  
  throw new Error('Could not determine input type');
}