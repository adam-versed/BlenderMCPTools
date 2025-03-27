import { TemplateManager } from './templateManager.js';
import { TemplateThinkingInput, ThinkingTemplate, TemplateSession } from './types.js';
import { ThinkingContext, ThinkingResponse, ThinkingTool } from '../../common/types.js';
import { TemplateRecommenderService } from './recommender/templateRecommenderService.js';
import chalk from 'chalk';

export class TemplateThinkingTool implements ThinkingTool {
  public readonly name = 'template-thinking';
  public readonly description = `A tool for structured thinking using templates for Blender workflows.
  
Each template:
- Contains a sequence of thinking steps
- Guides through a specific cognitive process
- Can be customized for different Blender tasks
- Helps ensure thorough consideration

The system includes templates for:
- Image2Blender: Converting reference images to 3D scenes

Advanced features:
- Auto-selection of templates based on context
- Recommendations for optimal thinking approaches
- Learning from usage patterns
- Generation of standardized documentation artifacts`;

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
        
        const formattedOutput = this.formatSessionOutput(session, context);
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
        const formattedOutput = this.formatSessionOutput(session, context);
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
      return this.formatSessionOutput(session, context);
    }
    
    return 'Error: Invalid input for formatForIDEChat';
  }

  private formatSessionOutput(session: TemplateSession, context: ThinkingContext): string {
    const template = this.templateManager.getTemplateById(session.templateId);
    if (!template) {
      return 'Error: Template not found';
    }
    
    // Create a header with formatting for the template
    let output = `📋 ${template.name.toUpperCase()} `;
    
    // Calculate progress
    const completedSteps = session.steps.filter(s => s.isComplete).length;
    const totalSteps = session.steps.length;
    
    // If all steps are complete
    if (completedSteps === totalSteps) {
      output += `(Completed)\n`;
      
      // List all completed steps
      session.steps.forEach((step, index) => {
        output += `✓ Step ${index + 1}: ${step.content}\n`;
      });
      
      // Add artifact templates if available and this is the final step
      if (template.artifacts && Object.keys(template.artifacts).length > 0) {
        output += `\n📄 Generated Artifacts:\n`;
        
        for (const [filename, artifact] of Object.entries(template.artifacts)) {
          output += `\n### ${filename}\n`;
          output += `${artifact.description}\n\n`;
          // We don't include the full template here as it would be too verbose
          output += `Template available for implementation.\n`;
        }
      }
      
      output += `\n`;
    } else {
      // Show progress
      output += `(Step ${completedSteps + 1} of ${totalSteps})\n`;
      
      // List completed steps
      session.steps
        .filter(s => s.isComplete)
        .forEach((step, index) => {
          output += `✓ Step ${session.steps.findIndex(s => s.id === step.id) + 1}: ${step.content}\n`;
        });
      
      // Show current step
      const currentStep = session.steps[session.currentStepIndex];
      output += `→ Current step: ${currentStep.content}\n`;
      
      // If we're at the document creation steps (4 or 5), show artifact templates
      if (template.artifacts && 
          Object.keys(template.artifacts).length > 0 && 
          (session.currentStepIndex === 3 || session.currentStepIndex === 4)) {
        
        // Filter artifacts based on which step we're on
        const relevantArtifacts = Object.entries(template.artifacts).filter(([filename]) => {
          if (session.currentStepIndex === 3) {
            return filename === 'technical-approach.md';
          } else if (session.currentStepIndex === 4) {
            return filename === 'tasks.md';
          }
          return false;
        });
        
        if (relevantArtifacts.length > 0) {
          output += `\n📄 Document Template Available: ${relevantArtifacts[0][0]}\n`;
        }
      }
      
      output += `\n`;
    }
    
    return output;
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
          
          const formattedOutput = this.formatSessionOutput(session, context);
          console.error(formattedOutput);
          
          return {
            content: [{
              type: "text",
              text: formattedOutput
            }]
          };
        }
        
        case 'get-artifact-template': {
          if (!command.templateId) {
            throw new Error('templateId required for get-artifact-template command');
          }
          
          const template = this.templateManager.getTemplateById(command.templateId);
          if (!template) {
            throw new Error(`Template ${command.templateId} not found`);
          }
          
          if (!template.artifacts || Object.keys(template.artifacts).length === 0) {
            return {
              content: [{
                type: "text",
                text: "No artifact templates available for this template."
              }]
            };
          }
          
          // If no specific artifact is requested, list all available artifacts
          if (!command.sessionId) {
            const artifactList = Object.entries(template.artifacts).map(
              ([filename, artifact]) => `• ${filename}: ${artifact.description}`
            ).join('\n');
            
            return {
              content: [{
                type: "text",
                text: `Available artifacts for ${template.name}:\n\n${artifactList}`
              }]
            };
          }
          
          // Treat sessionId as artifact name in this case
          const artifactName = command.sessionId;
          const artifact = template.artifacts[artifactName];
          
          if (!artifact) {
            return {
              content: [{
                type: "text",
                text: `Artifact "${artifactName}" not found for template ${template.name}.`
              }]
            };
          }
          
          return {
            content: [{
              type: "text",
              text: `# ${artifactName}\n\n${artifact.description}\n\n\`\`\`markdown\n${artifact.template}\n\`\`\``
            }]
          };
        },
        
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
          
          const formattedOutput = this.formatSessionOutput(session, context);
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