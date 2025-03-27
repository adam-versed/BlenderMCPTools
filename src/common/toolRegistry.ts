import { ThinkingTool, ThinkingStyle } from './types.js';
import { TemplateThinkingTool } from '../tools/template-thinking/templateThinkingTool.js';

/**
 * Registry for all thinking tools
 */
export class ToolRegistry {
  private tools: Map<string, ThinkingTool> = new Map();
  
  constructor() {
    // Register all tools
    this.registerTool(new TemplateThinkingTool());
  }
  
  registerTool(tool: ThinkingTool): void {
    this.tools.set(tool.name, tool);
  }
  
  getTool(name: string): ThinkingTool | undefined {
    return this.tools.get(name);
  }
  
  getAllTools(): ThinkingTool[] {
    return Array.from(this.tools.values());
  }
  
  /**
   * Gets the appropriate tool based on the input
   * This uses simple heuristics to determine which tool to use
   */
  getToolForInput(input: unknown): ThinkingTool | undefined {
    const inputData = input as any;
    
    // If the tool name is explicitly specified, use that
    if (inputData.tool) {
      return this.getTool(inputData.tool);
    }
    
    // Check for template thinking input patterns
    if (
      inputData.templateId || 
      inputData.createTemplate || 
      (inputData.command && ['list-templates', 'show-template', 'continue-session'].includes(inputData.command.type))
    ) {
      return this.getTool('template-thinking');
    }
    
    // Default to template thinking
    return this.getTool('template-thinking');
  }
}