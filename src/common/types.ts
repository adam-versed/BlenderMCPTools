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

// Re-export types from specific thinking tools
export * from '../tools/branch-thinking/types.js';
export * from '../tools/template-thinking/types.js';
export * from '../tools/verification-thinking/types.js';