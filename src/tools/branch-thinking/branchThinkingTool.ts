import { BranchManager } from './branchManager.js';
import { BranchingThoughtInput } from './types.js';
import { ThinkingContext, ThinkingResponse, ThinkingTool } from '../../common/types.js';
import chalk from 'chalk';

export class BranchThinkingTool implements ThinkingTool {
  public readonly name = 'branch-thinking';
  public readonly description = `A tool for managing multiple branches of thought with insights and cross-references.
  
Each thought can:
- Belong to a specific branch
- Generate insights
- Create cross-references to other branches
- Include confidence scores and key points

The system tracks:
- Branch priorities and states
- Relationships between thoughts
- Accumulated insights
- Cross-branch connections`;

  private branchManager = new BranchManager();

  processThought(input: unknown, context: ThinkingContext): ThinkingResponse {
    try {
      const inputData = input as any;
      
      // Handle commands if present
      if (inputData.command) {
        return this.handleCommand(inputData.command, context);
      }

      // Handle regular thought input
      const thoughtInput = input as BranchingThoughtInput;
      
      // Add project structure from context if not already in the input
      if (context.projectStructure && !thoughtInput.projectStructure) {
        thoughtInput.projectStructure = context.projectStructure;
      }
      
      const thought = this.branchManager.addThought(thoughtInput);
      const branch = this.branchManager.getBranch(thought.branchId)!;
      
      // Format for IDE chat client
      const formattedForIDEChat = this.formatForIDEChat(branch, context);
      console.error(formattedForIDEChat); // Send to IDE chat client
      
      // Return the response
      return {
        content: [
          // First item is the human-friendly IDE chat output
          { 
            type: "text", 
            text: formattedForIDEChat 
          },
          // Second item is the JSON data (but not shown prominently)
          {
            type: "text",
            text: JSON.stringify({
              thoughtId: thought.id,
              branchId: thought.branchId,
              branchState: branch.state,
              branchPriority: branch.priority,
              numInsights: branch.insights.length,
              numCrossRefs: branch.crossRefs.length,
              activeBranch: this.branchManager.getActiveBranch()?.id,
              projectStructureAvailable: !!context.projectStructure
            }, null, 2)
          }
        ]
      };
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
    const branch = input as any;
    return this.branchManager.formatForIDEChat(branch, context);
  }

  handleCommand(command: { type: string; branchId?: string }, context: ThinkingContext): ThinkingResponse {
    try {
      switch (command.type) {
        case 'list': {
          const branches = this.branchManager.getAllBranches();
          const activeBranchId = this.branchManager.getActiveBranch()?.id;
          const output = branches.map(b => {
            const isActive = b.id === activeBranchId;
            const prefix = isActive ? chalk.green('→') : ' ';
            return `${prefix} ${b.id} [${b.state}] - ${b.thoughts[b.thoughts.length - 1]?.content.slice(0, 50)}...`;
          }).join('\n');
          
          // Format for IDE chat client
          const formattedOutput = `Branch listing:\n\n${output}`;
          console.error(formattedOutput);
          
          return {
            content: [{
              type: "text",
              text: formattedOutput
            }]
          };
        }

        case 'focus': {
          if (!command.branchId) {
            throw new Error('branchId required for focus command');
          }
          this.branchManager.setActiveBranch(command.branchId);
          const branch = this.branchManager.getBranch(command.branchId)!;
          const formattedOutput = this.branchManager.formatForIDEChat(branch, context);
          console.error(formattedOutput);
          
          return {
            content: [{
              type: "text",
              text: `Now focused on branch: ${command.branchId}\n\n${formattedOutput}`
            }]
          };
        }

        case 'history': {
          const branchId = command.branchId || this.branchManager.getActiveBranch()?.id;
          if (!branchId) {
            throw new Error('No active branch and no branchId provided');
          }
          const branch = this.branchManager.getBranch(branchId)!;
          const history = this.branchManager.getBranchHistory(branchId);
          console.error(history);
          
          return {
            content: [{
              type: "text",
              text: history
            }]
          };
        }

        case 'minimize': {
          context.outputFormat.isMinimized = true;
          return {
            content: [{
              type: "text",
              text: "Thoughts will now be minimized in the IDE chat"
            }]
          };
        }

        case 'expand': {
          context.outputFormat.isMinimized = false;
          return {
            content: [{
              type: "text",
              text: "Thoughts will now be expanded in the IDE chat"
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