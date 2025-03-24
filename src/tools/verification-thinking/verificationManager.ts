import chalk from 'chalk';
import {
  VerificationStatus,
  VerificationType,
  VerificationStep,
  VerificationChain
} from './types.js';
import { ThinkingContext } from '../../common/types.js';
import { PersistenceManager, VerificationData } from '../../common/persistence/index.js';

export class VerificationManager {
  private chains: Map<string, VerificationChain> = new Map();
  private currentChainId: string | null = null;
  private persistence: PersistenceManager<VerificationData>;
  private stepCounter = 0;
  private chainCounter = 0;

  constructor() {
    // Initialize persistence manager with default data
    this.persistence = new PersistenceManager<VerificationData>('verification', {
      chains: {},
      chainCounter: 0,
      stepCounter: 0
    });
    
    // Initialize asynchronously - we'll load data when needed
    this.initializeAsync();
  }
  
  /**
   * Initializes persistence and data async
   */
  private async initializeAsync(): Promise<void> {
    try {
      await this.persistence.initialize();
      await this.loadData();
    } catch (error) {
      console.error(`Error initializing verification manager: ${error}`);
    }
  }
  
  /**
   * Load data from persistence
   */
  private async loadData(): Promise<void> {
    const data = await this.persistence.getData();
    
    // Initialize counters
    this.chainCounter = data.chainCounter;
    this.stepCounter = data.stepCounter;
    
    // Load chains
    this.chains.clear();
    
    for (const [id, chain] of Object.entries(data.chains)) {
      // Convert ISO date strings back to Date objects
      const startTime = new Date(chain.startTime);
      const endTime = chain.endTime ? new Date(chain.endTime) : undefined;
      
      this.chains.set(id, {
        ...chain,
        startTime,
        endTime
      });
    }
    
    console.error(`Loaded ${this.chains.size} verification chains`);
  }
  
  /**
   * Save data to persistence
   */
  private async saveData(): Promise<void> {
    const chainData: Record<string, any> = {};
    for (const [id, chain] of this.chains.entries()) {
      chainData[id] = chain;
    }
    
    const data: VerificationData = {
      chains: chainData,
      chainCounter: this.chainCounter,
      stepCounter: this.stepCounter
    };
    
    await this.persistence.save(data);
  }

  generateId(prefix: string): string {
    let counter = 0;
    
    switch (prefix) {
      case 'step':
        counter = ++this.stepCounter;
        break;
      case 'chain':
        counter = ++this.chainCounter;
        break;
      default:
        counter = Date.now();
    }
    
    return `${prefix}-${counter}`;
  }

  async createChain(subject: string): Promise<VerificationChain> {
    const chainId = this.generateId('chain');
    
    const chain: VerificationChain = {
      id: chainId,
      subject,
      steps: [],
      overallStatus: 'pending',
      startTime: new Date()
    };
    
    this.chains.set(chainId, chain);
    this.currentChainId = chainId;
    
    // Save the updated data
    await this.saveData();
    
    return chain;
  }

  getChain(chainId: string): VerificationChain | undefined {
    return this.chains.get(chainId);
  }

  getCurrentChain(): VerificationChain | undefined {
    return this.currentChainId ? this.chains.get(this.currentChainId) : undefined;
  }

  getAllChains(): VerificationChain[] {
    return Array.from(this.chains.values());
  }

  async addVerificationStep(
    chainId: string, 
    type: VerificationType, 
    claim: string, 
    verification: string, 
    status: VerificationStatus = 'pending',
    confidence: number = 0.5,
    evidence?: string,
    counterExample?: string
  ): Promise<VerificationStep> {
    const chain = this.getChain(chainId);
    if (!chain) {
      throw new Error(`Chain ${chainId} not found`);
    }
    
    const step: VerificationStep = {
      id: this.generateId('step'),
      type,
      claim,
      verification,
      status,
      confidence,
      evidence,
      counterExample
    };
    
    chain.steps.push(step);
    this.updateChainStatus(chainId);
    
    // Save the updated data
    await this.saveData();
    
    return step;
  }

  async updateVerificationStep(
    chainId: string,
    stepId: string,
    verification: string,
    status: VerificationStatus,
    confidence: number,
    evidence?: string,
    counterExample?: string
  ): Promise<VerificationStep> {
    const chain = this.getChain(chainId);
    if (!chain) {
      throw new Error(`Chain ${chainId} not found`);
    }
    
    const step = chain.steps.find(s => s.id === stepId);
    if (!step) {
      throw new Error(`Step ${stepId} not found in chain ${chainId}`);
    }
    
    step.verification = verification;
    step.status = status;
    step.confidence = confidence;
    
    if (evidence !== undefined) {
      step.evidence = evidence;
    }
    
    if (counterExample !== undefined) {
      step.counterExample = counterExample;
    }
    
    this.updateChainStatus(chainId);
    
    // Save the updated data
    await this.saveData();
    
    return step;
  }

  private updateChainStatus(chainId: string): void {
    const chain = this.getChain(chainId);
    if (!chain) {
      throw new Error(`Chain ${chainId} not found`);
    }
    
    // If there are no steps, the chain is still pending
    if (chain.steps.length === 0) {
      chain.overallStatus = 'pending';
      return;
    }
    
    // If any step is still pending, the chain is in progress
    if (chain.steps.some(s => s.status === 'pending')) {
      chain.overallStatus = 'in_progress';
      return;
    }
    
    // If any step failed, the chain failed
    if (chain.steps.some(s => s.status === 'failed')) {
      chain.overallStatus = 'failed';
      return;
    }
    
    // If all steps are verified, the chain is verified
    if (chain.steps.every(s => s.status === 'verified')) {
      chain.overallStatus = 'verified';
      
      // Set the end time if all steps are complete
      if (!chain.endTime) {
        chain.endTime = new Date();
      }
      
      return;
    }
    
    // Otherwise, it's still in progress
    chain.overallStatus = 'in_progress';
  }

  formatForIDEChat(chain: VerificationChain, context: ThinkingContext): string {
    let output = `Verification Chain: ${chain.subject}\n\n`;
    
    // Display overall status
    const statusColor = this.getStatusColor(chain.overallStatus);
    output += `Overall Status: ${statusColor(chain.overallStatus.toUpperCase())}\n\n`;
    
    // Display steps
    if (chain.steps.length === 0) {
      output += 'No verification steps yet.\n';
    } else {
      chain.steps.forEach((step, index) => {
        const statusColor = this.getStatusColor(step.status);
        
        output += `Step ${index + 1}: ${statusColor(step.status.toUpperCase())}\n`;
        output += `Type: ${step.type}\n`;
        output += `Claim: ${step.claim}\n`;
        output += `Verification: ${step.verification}\n`;
        output += `Confidence: ${this.getConfidenceBar(step.confidence)}\n`;
        
        if (step.evidence) {
          output += `Evidence: ${step.evidence}\n`;
        }
        
        if (step.counterExample) {
          output += `Counter-example: ${step.counterExample}\n`;
        }
        
        output += '\n';
      });
    }
    
    return output;
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

  private getConfidenceBar(confidence: number): string {
    const barLength = 10;
    const filledLength = Math.round(confidence * barLength);
    const emptyLength = barLength - filledLength;
    
    const filled = '█'.repeat(filledLength);
    const empty = '░'.repeat(emptyLength);
    
    return `${(confidence * 100).toFixed(0)}% [${filled}${empty}]`;
  }
}