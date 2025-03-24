import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Class to handle persistence of data to local disk storage
 */
export class PersistenceManager<T> {
  private dataDir: string;
  private fileName: string;
  private data: T | null = null;
  private initialized: boolean = false;
  
  /**
   * Create a persistence manager for a specific data type
   * @param dataType Name of the data type (used for filename)
   * @param defaultData Default data to use if no file exists
   */
  constructor(dataType: string, private defaultData: T) {
    // Create data directory in user's home directory
    this.dataDir = path.join(os.homedir(), '.structured-thinking');
    this.fileName = path.join(this.dataDir, `${dataType}.json`);
  }
  
  /**
   * Initialize the persistence manager
   * Creates data directory if it doesn't exist
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Ensure data directory exists
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
        console.error(`Created data directory: ${this.dataDir}`);
      }
      
      // Load data if it exists
      if (fs.existsSync(this.fileName)) {
        const fileContent = await fs.promises.readFile(this.fileName, 'utf8');
        this.data = JSON.parse(fileContent);
        console.error(`Loaded data from ${this.fileName}`);
      } else {
        // Use default data if no file exists
        this.data = this.defaultData;
        // Save default data to disk
        await this.save();
        console.error(`Initialized new data file: ${this.fileName}`);
      }
      
      this.initialized = true;
    } catch (error) {
      console.error(`Error initializing persistence: ${error}`);
      // Fall back to in-memory operation
      this.data = this.defaultData;
      this.initialized = true;
    }
  }
  
  /**
   * Get the current data
   */
  async getData(): Promise<T> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.data as T;
  }
  
  /**
   * Save data to disk
   */
  async save(newData?: T): Promise<void> {
    if (newData !== undefined) {
      this.data = newData;
    }
    
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      await fs.promises.writeFile(this.fileName, JSON.stringify(this.data, null, 2));
      console.error(`Saved data to ${this.fileName}`);
    } catch (error) {
      console.error(`Error saving data: ${error}`);
    }
  }
}
