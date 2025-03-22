import { VerificationManager } from './verificationManager.js';
import { VerificationThinkingInput, VerificationType, VerificationStatus } from './types.js';
import { ThinkingContext, ThinkingResponse, ThinkingTool } from '../../common/types.js';
import chalk from 'chalk';

export class VerificationThinkingTool implements ThinkingTool {
  public readonly name = 'verification-thinking';
  public readonly description = `A tool for structured verification of claims and assertions.
  
Each verification chain:
- Contains a sequence of verification steps
- Provides evidence or counter-examples
- Tracks confidence and status
- Ensures thorough fact-checking

The system supports verification of:
- Logical reasoning steps
- Factual claims
- Code correctness
- Mathematical proofs
- Consistency checks
- Completeness assessments`;

  private verificationManager = new VerificationManager();

  processThought(input: unknown, context: ThinkingContext): ThinkingResponse {
    try {
      const inputData = input as any;
      
      // Handle commands if present
      if (inputData.command) {
        return this.handleCommand(inputData.command, context);
      }
      
      const verificationInput = input as VerificationThinkingInput;
      
      // Add project structure from context if not already in the input
      if (context.projectStructure && !verificationInput.projectStructure) {
        verificationInput.projectStructure = context.projectStructure;
      }
      
      // Start a new chain if subject is provided and no chainId
      if (verificationInput.subject && !verificationInput.chainId) {
        const chain = this.verificationManager.createChain(
          verificationInput.subject,
          verificationInput.projectStructure
        );
        
        const formattedOutput = this.verificationManager.formatForIDEChat(chain, context);
        console.error(formattedOutput);
        
        return {
          content: [{
            type: "text",
            text: formattedOutput
          }]
        };
      }
      
      // Add a verification step
      if (verificationInput.chainId && verificationInput.claim && verificationInput.type) {
        const verification = verificationInput.verification || 'Pending verification...';
        
        const step = this.verificationManager.addVerificationStep(
          verificationInput.chainId,
          verificationInput.type as VerificationType,
          verificationInput.claim,
          verification,
          'pending',
          0.5,
          verificationInput.evidence,
          verificationInput.counterExample
        );
        
        const chain = this.verificationManager.getChain(verificationInput.chainId)!;
        const formattedOutput = this.verificationManager.formatForIDEChat(chain, context);
        console.error(formattedOutput);
        
        return {
          content: [{
            type: "text",
            text: formattedOutput
          }]
        };
      }
      
      // Update a verification step
      if (verificationInput.chainId && verificationInput.stepId && verificationInput.verification) {
        const step = this.verificationManager.updateVerificationStep(
          verificationInput.chainId,
          verificationInput.stepId,
          verificationInput.verification,
          (verificationInput.status as VerificationStatus) || 'in_progress',
          Number(verificationInput.evidence ? 0.8 : 0.5), // Higher confidence if evidence is provided
          verificationInput.evidence,
          verificationInput.counterExample
        );
        
        const chain = this.verificationManager.getChain(verificationInput.chainId)!;
        const formattedOutput = this.verificationManager.formatForIDEChat(chain, context);
        console.error(formattedOutput);
        
        return {
          content: [{
            type: "text",
            text: formattedOutput
          }]
        };
      }
      
      // If we get here, the input didn't match any expected pattern
      throw new Error('Invalid verification thinking input: missing required parameters');
      
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
      const chainId = input;
      const chain = this.verificationManager.getChain(chainId);
      if (!chain) {
        return `Error: Chain ${chainId} not found`;
      }
      return this.verificationManager.formatForIDEChat(chain, context);
    }
    
    return 'Error: Invalid input for formatForIDEChat';
  }

  handleCommand(command: { type: string; chainId?: string; stepId?: string }, context: ThinkingContext): ThinkingResponse {
    try {
      switch (command.type) {
        case 'list-chains': {
          const chains = this.verificationManager.getAllChains();
          const output = chains.map(c => {
            const statusColor = this.getStatusColor(c.overallStatus);
            return `• ${c.subject} - ${statusColor(c.overallStatus.toUpperCase())} - ${c.steps.length} steps [${c.id}]`;
          }).join('\n');
          
          const formattedOutput = `Verification Chains:\n\n${output || 'No verification chains yet.'}`;
          console.error(formattedOutput);
          
          return {
            content: [{
              type: "text",
              text: formattedOutput
            }]
          };
        }
        
        case 'show-chain': {
          if (!command.chainId) {
            throw new Error('chainId required for show-chain command');
          }
          
          const chain = this.verificationManager.getChain(command.chainId);
          if (!chain) {
            throw new Error(`Chain ${command.chainId} not found`);
          }
          
          const formattedOutput = this.verificationManager.formatForIDEChat(chain, context);
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

  private getStatusColor(status: VerificationStatus): (text: string) => string {
    switch (status) {
      case 'verified':
        return chalk.green;
      case 'failed':
        return chalk.red;
      case 'in_progress':
        return chalk.blue;
      case 'pending':
        return chalk.yellow;
      case 'skipped':
        return chalk.gray;
      default:
        return (text) => text;
    }
  }
}