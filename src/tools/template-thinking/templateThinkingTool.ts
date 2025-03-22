import { TemplateManager } from './templateManager.js';
import { TemplateThinkingInput } from './types.js';
import { ThinkingContext, ThinkingResponse, ThinkingTool } from '../../common/types.js';
import chalk from 'chalk';

export class TemplateThinkingTool implements ThinkingTool {
  public readonly name = 'template-thinking';
  public readonly description = `A tool for structured thinking using templates.
  
Each template:
- Contains a sequence of thinking steps
- Guides through a specific cognitive process
- Can be customized for different domains
- Helps ensure thorough consideration

The system includes templates for:
- Analysis of complex problems
- Decision making with multiple criteria
- Debugging and problem-solving
- Planning and implementation`;

  private templateManager = new TemplateManager();

  processThought(input: unknown, context: ThinkingContext): ThinkingResponse {
    try {
      const inputData = input as any;
      
      // Handle commands if present
      if (inputData.command) {
        return this.handleCommand(inputData.command, context);
      }
      
      const templateInput = input as TemplateThinkingInput;
      
      // Add project structure from context if not already in the input
      if (context.projectStructure && !templateInput.projectStructure) {
        templateInput.projectStructure = context.projectStructure;
      }
      
      // Handle creating a new template
      if (templateInput.createTemplate) {
        const { name, category, description, steps } = templateInput.createTemplate;
        const template = this.templateManager.createTemplate(name, category, description, steps);
        
        return {
          content: [{
            type: "text",
            text: `Created new template "${template.name}" (${template.id}) with ${template.steps.length} steps.`
          }]
        };
      }
      
      // Start a new session if requested
      if (templateInput.templateId && !templateInput.sessionId) {
        const session = this.templateManager.createSession(
          templateInput.templateId, 
          templateInput.projectStructure
        );
        
        const formattedOutput = this.templateManager.formatForIDEChat(session, context);
        console.error(formattedOutput);
        
        return {
          content: [{
            type: "text",
            text: formattedOutput
          }]
        };
      }
      
      // Update a step if content and stepId are provided
      if (templateInput.sessionId && templateInput.stepId && templateInput.content) {
        const step = this.templateManager.updateStep(
          templateInput.sessionId,
          templateInput.stepId,
          templateInput.content
        );
        
        const session = this.templateManager.getSession(templateInput.sessionId)!;
        const formattedOutput = this.templateManager.formatForIDEChat(session, context);
        console.error(formattedOutput);
        
        return {
          content: [{
            type: "text",
            text: formattedOutput
          }]
        };
      }
      
      // If we get here, the input didn't match any expected pattern
      throw new Error('Invalid template thinking input: missing required parameters');
      
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: 'failed'
          }, null, 2)
        }],
        isError: true
      };
    }
  }

  formatForIDEChat(input: unknown, context: ThinkingContext): string {
    if (typeof input === 'string') {
      const sessionId = input;
      const session = this.templateManager.getSession(sessionId);
      if (!session) {
        return `Error: Session ${sessionId} not found`;
      }
      return this.templateManager.formatForIDEChat(session, context);
    }
    
    return 'Error: Invalid input for formatForIDEChat';
  }

  handleCommand(command: { type: string; templateId?: string; sessionId?: string }, context: ThinkingContext): ThinkingResponse {
    try {
      switch (command.type) {
        case 'list-templates': {
          const templates = this.templateManager.getAllTemplates();
          const output = templates.map(t => 
            `• ${t.name} (${t.category}) - ${t.description.slice(0, 50)}... [${t.id}]`
          ).join('\n');
          
          const formattedOutput = `Available Templates:\n\n${output}`;
          console.error(formattedOutput);
          
          return {
            content: [{
              type: "text",
              text: formattedOutput
            }]
          };
        }
        
        case 'show-template': {
          if (!command.templateId) {
            throw new Error('templateId required for show-template command');
          }
          
          const template = this.templateManager.getTemplateById(command.templateId);
          if (!template) {
            throw new Error(`Template ${command.templateId} not found`);
          }
          
          const stepsOutput = template.steps.map(s => 
            `${s.order}. ${s.content}`
          ).join('\n');
          
          const formattedOutput = `Template: ${template.name} (${template.category})\n\n` +
            `${template.description}\n\n` +
            `Steps:\n${stepsOutput}`;
          
          console.error(formattedOutput);
          
          return {
            content: [{
              type: "text",
              text: formattedOutput
            }]
          };
        }
        
        case 'continue-session': {
          if (!command.sessionId) {
            throw new Error('sessionId required for continue-session command');
          }
          
          const session = this.templateManager.getSession(command.sessionId);
          if (!session) {
            throw new Error(`Session ${command.sessionId} not found`);
          }
          
          const formattedOutput = this.templateManager.formatForIDEChat(session, context);
          console.error(formattedOutput);
          
          return {
            content: [{
              type: "text",
              text: formattedOutput
            }]
          };
        }
        
        default:
          throw new Error(`Unknown command: ${command.type}`);
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: 'failed'
          }, null, 2)
        }]
      };
    }
  }
}