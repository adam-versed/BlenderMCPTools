import { TemplateManager } from './templateManager.js';
import { TemplateThinkingInput, ThinkingTemplate } from './types.js';
import { ThinkingContext, ThinkingResponse, ThinkingTool } from '../../common/types.js';
import { TemplateRecommenderService } from './recommender/templateRecommenderService.js';
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
- Planning and implementation

Advanced features:
- Auto-selection of templates based on context
- Recommendations for optimal thinking approaches
- Learning from usage patterns`;

  private templateManager = new TemplateManager();
  private recommenderService = new TemplateRecommenderService();

  async processThought(input: unknown, context: ThinkingContext): Promise<ThinkingResponse> {
    try {
      const inputData = input as any;
      
      // Handle commands if present
      if (inputData.command) {
        return this.handleCommand(inputData.command, context);
      }
      
      const templateInput = input as TemplateThinkingInput;
      
      // Handle creating a new template
      if (templateInput.createTemplate) {
        const { name, category, description, steps } = templateInput.createTemplate;
        const template = await this.templateManager.createTemplate(name, category, description, steps);
        
        return {
          content: [{
            type: "text",
            text: `Created new template "${template.name}" (${template.id}) with ${template.steps.length} steps.`
          }]
        };
      }
      
      // Start a new session if requested
      if (templateInput.templateId && !templateInput.sessionId) {
        const session = await this.templateManager.createSession(templateInput.templateId);
        
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
        const step = await this.templateManager.updateStep(
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

  async handleCommand(command: { 
    type: string; 
    templateId?: string; 
    sessionId?: string;
    problemDescription?: string;
    wasAccepted?: boolean;
    limit?: number;
  }, context: ThinkingContext): Promise<ThinkingResponse> {
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
        
        case 'recommend-template': {
          if (!command.problemDescription) {
            throw new Error('problemDescription required for recommend-template command');
          }
          
          const limit = command.limit || 3;
          const templates = this.templateManager.getAllTemplates();
          
          const { recommendations, analysis, alternativeCategories } = 
            this.recommenderService.getTemplateRecommendations(
              command.problemDescription,
              context,
              templates,
              limit
            );
          
          if (recommendations.length === 0) {
            return {
              content: [{
                type: "text",
                text: "No templates matched your request."
              }]
            };
          }
          
          // Format the recommendations
          let output = `# Template Recommendations\n\n`;
          output += `Based on your request: "${command.problemDescription}"\n\n`;
          
          // Include confidence and problem categorization 
          output += `**Context Analysis**:\n`;
          output += `- Problem type: ${analysis.problemType}\n`;
          output += `- Recommended category: ${analysis.category}\n`;
          output += `- Complexity: ${analysis.complexity}\n`;
          output += `- Confidence: ${Math.round(analysis.confidence * 100)}%\n\n`;
          
          // Format recommendations
          output += `## Top ${recommendations.length} Recommendations\n\n`;
          
          recommendations.forEach((recommendation, index) => {
            const template = recommendation.template;
            output += `### ${index + 1}. ${template.name} (${template.category})\n`;
            output += `${template.description}\n\n`;
            output += `**Why this template?** ${recommendation.reason}\n\n`;
            
            // First few steps as preview
            output += `First steps:\n`;
            template.steps.slice(0, 3).forEach(step => {
              output += `- ${step.content}\n`;
            });
            
            if (template.steps.length > 3) {
              output += `- ... plus ${template.steps.length - 3} more steps\n`;
            }
            
            output += `\nUse template ID: \`${template.id}\`\n\n`;
          });
          
          // Alternative categories
          if (alternativeCategories.length > 0) {
            output += `## Alternative Approaches\n\n`;
            output += `You might also consider templates from these categories:\n`;
            alternativeCategories.forEach(category => {
              output += `- ${category} templates\n`;
            });
          }
          
          return {
            content: [{
              type: "text",
              text: output
            }]
          };
        }
        
        case 'auto-select-template': {
          if (!command.problemDescription) {
            throw new Error('problemDescription required for auto-select-template command');
          }
          
          const templates = this.templateManager.getAllTemplates();
          const { recommendation, analysis } = this.recommenderService.autoSelectTemplate(
            command.problemDescription,
            context,
            templates
          );
          
          if (!recommendation) {
            return {
              content: [{
                type: "text",
                text: "Could not automatically select a template for your request."
              }]
            };
          }
          
          // Auto-create a session with the selected template
          const session = await this.templateManager.createSession(recommendation.template.id);
          
          // Format output
          let output = `# Template Auto-Selected\n\n`;
          output += `Based on your request: "${command.problemDescription}"\n\n`;
          output += `Selected: **${recommendation.template.name}** (${recommendation.template.category})\n\n`;
          output += `**Why this template?** ${recommendation.reason}\n\n`;
          output += `Session created with ID: ${session.id}\n\n`;
          output += `---\n\n`;
          
          const formattedOutput = this.templateManager.formatForIDEChat(session, context);
          output += formattedOutput;
          
          // Record this as an accepted recommendation
          this.recommenderService.recordRecommendationOutcome(
            recommendation.template,
            command.problemDescription,
            true
          );
          
          return {
            content: [{
              type: "text",
              text: output
            }]
          };
        }
        
        case 'record-template-selection': {
          if (!command.templateId || !command.problemDescription) {
            throw new Error('templateId and problemDescription required for record-template-selection');
          }
          
          const template = this.templateManager.getTemplateById(command.templateId);
          if (!template) {
            throw new Error(`Template ${command.templateId} not found`);
          }
          
          const wasAccepted = command.wasAccepted !== false; // Default to true
          
          const stats = this.recommenderService.recordRecommendationOutcome(
            template,
            command.problemDescription,
            wasAccepted
          );
          
          return {
            content: [{
              type: "text",
              text: `Template selection recorded. Current acceptance rate: ${Math.round(stats.acceptanceRate * 100)}%`
            }]
          };
        }
        
        case 'template-effectiveness': {
          const metrics = this.recommenderService.getEffectivenessMetrics();
          
          let output = `# Template Effectiveness Metrics\n\n`;
          output += `Overall acceptance rate: ${Math.round(metrics.overallAcceptanceRate * 100)}%\n\n`;
          
          output += `## Category Statistics\n\n`;
          for (const [category, stats] of Object.entries(metrics.categoryStats)) {
            output += `### ${category}\n`;
            output += `- Acceptance rate: ${Math.round(stats.acceptanceRate * 100)}%\n`;
            output += `- Recommendation count: ${stats.recommendationCount}\n`;
            output += `- Average score: ${stats.averageScore.toFixed(2)}\n\n`;
          }
          
          output += `## Recent Trends\n\n`;
          const trend = metrics.recentTrends.improving ? 'Improving' : 'Declining';
          output += `- Trend: ${trend}\n`;
          output += `- Recent acceptance rate: ${Math.round(metrics.recentTrends.recentAcceptanceRate * 100)}%\n`;
          output += `- Historical acceptance rate: ${Math.round(metrics.recentTrends.historicalAcceptanceRate * 100)}%\n`;
          
          return {
            content: [{
              type: "text",
              text: output
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