import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Manages persistence for structured thinking tools
 */
export class PersistenceManager {
  private baseDir: string;
  private templatesDir: string;
  private templateSessionsDir: string;
  private verificationChainsDir: string;

  /**
   * Create a persistence manager with the specified base directory
   */
  constructor(baseDir?: string) {
    // Default to a 'data' directory at the project root
    this.baseDir = baseDir || path.join(__dirname, '..', '..', 'data');
    this.templatesDir = path.join(this.baseDir, 'templates');
    this.templateSessionsDir = path.join(this.baseDir, 'sessions', 'template-sessions');
    this.verificationChainsDir = path.join(this.baseDir, 'sessions', 'verification-chains');

    this.ensureDirectories();
  }

  /**
   * Ensure that all required directories exist
   */
  private ensureDirectories(): void {
    fs.mkdirSync(this.baseDir, { recursive: true });
    fs.mkdirSync(this.templatesDir, { recursive: true });
    fs.mkdirSync(this.templateSessionsDir, { recursive: true });
    fs.mkdirSync(this.verificationChainsDir, { recursive: true });
  }

  /**
   * Save an object to a JSON file
   */
  async saveObject(directory: string, id: string, data: any): Promise<void> {
    const filePath = path.join(directory, `${id}.json`);
    const jsonData = JSON.stringify(data, null, 2);

    try {
      await fs.promises.writeFile(filePath, jsonData, 'utf8');
      console.error(`Saved ${id} to ${filePath}`);
    } catch (error) {
      console.error(`Error saving ${id}:`, error);
      throw error;
    }
  }

  /**
   * Load an object from a JSON file
   */
  async loadObject<T>(directory: string, id: string): Promise<T | null> {
    const filePath = path.join(directory, `${id}.json`);

    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      return JSON.parse(data) as T;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // File doesn't exist, return null
        return null;
      }
      console.error(`Error loading ${id}:`, error);
      throw error;
    }
  }

  /**
   * List all files in a directory
   */
  async listFiles(directory: string): Promise<string[]> {
    try {
      const files = await fs.promises.readdir(directory);
      return files.filter(file => file.endsWith('.json'));
    } catch (error) {
      console.error(`Error listing files in ${directory}:`, error);
      return [];
    }
  }

  /**
   * Save a template
   */
  async saveTemplate(id: string, data: any): Promise<void> {
    await this.saveObject(this.templatesDir, id, data);
  }

  /**
   * Load a template
   */
  async loadTemplate<T>(id: string): Promise<T | null> {
    return await this.loadObject<T>(this.templatesDir, id);
  }

  /**
   * List all templates
   */
  async listTemplates(): Promise<string[]> {
    const files = await this.listFiles(this.templatesDir);
    return files.map(file => file.replace('.json', ''));
  }

  /**
   * Save a template session
   */
  async saveTemplateSession(id: string, data: any): Promise<void> {
    await this.saveObject(this.templateSessionsDir, id, data);
  }

  /**
   * Load a template session
   */
  async loadTemplateSession<T>(id: string): Promise<T | null> {
    return await this.loadObject<T>(this.templateSessionsDir, id);
  }

  /**
   * List all template sessions
   */
  async listTemplateSessions(): Promise<string[]> {
    const files = await this.listFiles(this.templateSessionsDir);
    return files.map(file => file.replace('.json', ''));
  }

  /**
   * Save a verification chain
   */
  async saveVerificationChain(id: string, data: any): Promise<void> {
    await this.saveObject(this.verificationChainsDir, id, data);
  }

  /**
   * Load a verification chain
   */
  async loadVerificationChain<T>(id: string): Promise<T | null> {
    return await this.loadObject<T>(this.verificationChainsDir, id);
  }

  /**
   * List all verification chains
   */
  async listVerificationChains(): Promise<string[]> {
    const files = await this.listFiles(this.verificationChainsDir);
    return files.map(file => file.replace('.json', ''));
  }

  /**
   * Load all templates
   */
  async loadAllTemplates<T>(): Promise<Map<string, T>> {
    const templateIds = await this.listTemplates();
    const templates = new Map<string, T>();

    for (const id of templateIds) {
      const template = await this.loadTemplate<T>(id);
      if (template) {
        templates.set(id, template);
      }
    }

    return templates;
  }

  /**
   * Load all template sessions
   */
  async loadAllTemplateSessions<T>(): Promise<Map<string, T>> {
    const sessionIds = await this.listTemplateSessions();
    const sessions = new Map<string, T>();

    for (const id of sessionIds) {
      const session = await this.loadTemplateSession<T>(id);
      if (session) {
        sessions.set(id, session);
      }
    }

    return sessions;
  }

  /**
   * Load all verification chains
   */
  async loadAllVerificationChains<T>(): Promise<Map<string, T>> {
    const chainIds = await this.listVerificationChains();
    const chains = new Map<string, T>();

    for (const id of chainIds) {
      const chain = await this.loadVerificationChain<T>(id);
      if (chain) {
        chains.set(id, chain);
      }
    }

    return chains;
  }

  /**
   * Delete a template
   */
  async deleteTemplate(id: string): Promise<void> {
    const filePath = path.join(this.templatesDir, `${id}.json`);
    await fs.promises.unlink(filePath);
  }

  /**
   * Delete a template session
   */
  async deleteTemplateSession(id: string): Promise<void> {
    const filePath = path.join(this.templateSessionsDir, `${id}.json`);
    await fs.promises.unlink(filePath);
  }

  /**
   * Delete a verification chain
   */
  async deleteVerificationChain(id: string): Promise<void> {
    const filePath = path.join(this.verificationChainsDir, `${id}.json`);
    await fs.promises.unlink(filePath);
  }
}