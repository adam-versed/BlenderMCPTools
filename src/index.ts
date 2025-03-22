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
      // This is where we define the tool schemas for the MCP
      // For now, we're using a simplified schema that allows any JSON
      return {
        name: tool.name,
        description: tool.description,
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: true
        }
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