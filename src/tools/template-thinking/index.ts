import { TemplateThinkingTool } from './templateThinkingTool.js';
import { TemplateManager } from './templateManager.js';
import * as types from './types.js';
import { builtInTemplates } from './templates/index.js';

export const templateThinkingTool = new TemplateThinkingTool();

export {
  TemplateThinkingTool,
  TemplateManager,
  types,
  builtInTemplates
};

export * from './types.js';