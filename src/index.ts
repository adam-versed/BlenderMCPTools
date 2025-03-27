#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { ToolRegistry } from './common/toolRegistry.js';
import { ThinkingContext, ThinkingResponse } from './common/types.js';
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
    }
  };

  /**
   * Process a tool request
   */
  async processToolRequest(toolName: string, input: unknown): Promise<ThinkingResponse> {
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
      return await tool.processThought(input, this.context);
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
        case 'template-thinking':
          inputSchema = {
            type: "object",
            properties: {
              templateId: { type: "string", description: "ID of the template to use" },
              sessionId: { type: "string", description: "ID of an existing session" },
              stepId: { type: "string", description: "ID of the step to update" },
              content: { type: "string", description: "Content for the step" },
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
          
        // Only template-thinking is supported
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
  return await thinkingServer.processToolRequest(request.params.name, request.params.arguments);
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