#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { ToolRegistry } from './common/toolRegistry.js';
import { ThinkingContext } from './common/types.js';
import { validateInput } from './common/schemaValidator.js';

/**
 * Main server class for structured thinking tools
 */
class StructuredThinkingServer {
  private toolRegistry = new ToolRegistry();
  private context: ThinkingContext = {
    outputFormat: {
      isMinimized: false,
      indentLevel: 0
    },
    projectStructure: undefined
  };

  /**
   * Process a tool request
   */
  processToolRequest(toolName: string, input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      // Validate the input
      try {
        input = validateInput(input, toolName);
      } catch (validationError) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: `Validation error: ${validationError instanceof Error ? validationError.message : String(validationError)}`,
              status: 'failed'
            }, null, 2)
          }],
          isError: true
        };
      }
      
      // For shared context tools, check if projectStructure is in the input
      if ((input as any).projectStructure && !this.context.projectStructure) {
        this.context.projectStructure = (input as any).projectStructure;
      }
      
      // Get the appropriate tool
      let tool = this.toolRegistry.getTool(toolName);
      
      // If tool is not found by name, try to infer from input
      if (!tool) {
        tool = this.toolRegistry.getToolForInput(input);
      }
      
      if (!tool) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: `Unknown tool: ${toolName}`,
              status: 'failed'
            }, null, 2)
          }],
          isError: true
        };
      }
      
      // Process the thought with the selected tool
      return tool.processThought(input, this.context);
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

  /**
   * Get all available tools as MCP tool definitions
   */
  getAvailableTools(): Tool[] {
    const tools = this.toolRegistry.getAllTools();
    
    return tools.map(tool => {
      // Define detailed schemas for each tool
      let inputSchema: any = {
        type: "object",
        properties: {},
        additionalProperties: true
      };
      
      // Add tool-specific schemas
      switch (tool.name) {
        case 'branch-thinking':
          inputSchema = {
            type: "object",
            properties: {
              content: { type: "string", description: "The thought content" },
              type: { type: "string", description: "Type of thought (e.g., 'analysis', 'hypothesis', 'observation')" },
              branchId: { type: "string", description: "Optional: ID of the branch" },
              parentBranchId: { type: "string", description: "Optional: ID of the parent branch" },
              confidence: { type: "number", description: "Optional: Confidence score (0-1)" },
              keyPoints: { 
                type: "array", 
                items: { type: "string" },
                description: "Optional: Key points identified in the thought"
              },
              crossRefs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    toBranch: { type: "string" },
                    type: { type: "string" },
                    reason: { type: "string" },
                    strength: { type: "number" }
                  }
                },
                description: "Optional: Cross-references to other branches"
              },
              projectStructure: { type: "string", description: "Optional: Project structure in markdown format" },
              command: {
                type: "object",
                properties: {
                  type: { 
                    type: "string",
                    enum: ["list", "focus", "history", "minimize", "expand"],
                    description: "Command type"
                  },
                  branchId: { type: "string", description: "Branch ID for commands that require it" }
                },
                required: ["type"]
              }
            },
            anyOf: [
              { required: ["content", "type"] },
              { required: ["command"] }
            ]
          };
          break;
          
        case 'template-thinking':
          inputSchema = {
            type: "object",
            properties: {
              templateId: { type: "string", description: "ID of the template to use" },
              sessionId: { type: "string", description: "ID of an existing session" },
              stepId: { type: "string", description: "ID of the step to update" },
              content: { type: "string", description: "Content for the step" },
              projectStructure: { type: "string", description: "Optional: Project structure in markdown format" },
              createTemplate: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  category: { type: "string" },
                  description: { type: "string" },
                  steps: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        content: { type: "string" },
                        order: { type: "number" }
                      },
                      required: ["content", "order"]
                    }
                  }
                },
                required: ["name", "category", "description", "steps"]
              },
              command: {
                type: "object",
                properties: {
                  type: { 
                    type: "string",
                    enum: ["list-templates", "show-template", "continue-session"],
                    description: "Command type"
                  },
                  templateId: { type: "string", description: "Template ID for commands that require it" },
                  sessionId: { type: "string", description: "Session ID for commands that require it" }
                },
                required: ["type"]
              }
            }
          };
          break;
          
        case 'verification-thinking':
          inputSchema = {
            type: "object",
            properties: {
              subject: { type: "string", description: "Subject of the verification chain" },
              chainId: { type: "string", description: "ID of an existing chain" },
              stepId: { type: "string", description: "ID of the step to update" },
              claim: { type: "string", description: "Claim to verify" },
              type: { type: "string", description: "Type of verification" },
              verification: { type: "string", description: "Verification text" },
              evidence: { type: "string", description: "Optional: Evidence supporting the verification" },
              counterExample: { type: "string", description: "Optional: Counter-example to the claim" },
              projectStructure: { type: "string", description: "Optional: Project structure in markdown format" },
              command: {
                type: "object",
                properties: {
                  type: { 
                    type: "string",
                    enum: ["list-chains", "show-chain"],
                    description: "Command type"
                  },
                  chainId: { type: "string", description: "Chain ID for commands that require it" }
                },
                required: ["type"]
              }
            }
          };
          break;
      }
      
      return {
        name: tool.name,
        description: tool.description,
        inputSchema
      };
    });
  }
}

// Define our MCP server
const server = new Server(
  {
    name: "structured-thinking-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Create our structured thinking server
const thinkingServer = new StructuredThinkingServer();

// Handle MCP tool listing requests
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: thinkingServer.getAvailableTools(),
}));

// Handle MCP tool call requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  return thinkingServer.processToolRequest(request.params.name, request.params.arguments);
});

// Start the server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Structured Thinking MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});