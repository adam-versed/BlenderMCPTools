import { ThinkingTemplate } from '../types.js';

export const image2BlenderTemplate: ThinkingTemplate = {
  id: 'image2blender-template',
  name: 'Image2Blender',
  category: 'planning',
  description: 'Systematically recreate a 2D reference image in Blender using MCP Blender tools, guiding through scale establishment, environment creation, detailing, and validation.',
  steps: [
    {
      id: 'step-1',
      content: 'Reference Object Selection - Identify known-size object in the reference image and create a placeholder in Blender',
      order: 1,
      isComplete: false
    },
    {
      id: 'step-2',
      content: 'Camera Setup & Calibration - Create and position a camera in Blender to match the reference image perspective',
      order: 2,
      isComplete: false
    },
    {
      id: 'step-3',
      content: 'Lighting Analysis & Setup - Identify light sources in the reference image and create corresponding lights in Blender',
      order: 3,
      isComplete: false
    },
    {
      id: 'step-4',
      content: 'Primary Element Blocking - Create simple primitive shapes for the main structural elements in the reference image',
      order: 4,
      isComplete: false
    },
    {
      id: 'step-5',
      content: 'Atmospheric & Environmental Effects - Set up volumetric scattering and environmental containers to match the reference image',
      order: 5,
      isComplete: false
    },
    {
      id: 'step-6',
      content: 'Geometric Detailing - Refine blocked elements with increased detail and structural components',
      order: 6,
      isComplete: false
    },
    {
      id: 'step-7',
      content: 'Surface Definition & Texturing - Create materials and apply textures to match the reference image',
      order: 7,
      isComplete: false
    },
    {
      id: 'step-8',
      content: 'Secondary & Tertiary Elements - Add smaller detail objects, transition elements, and environmental objects',
      order: 8,
      isComplete: false
    },
    {
      id: 'step-9',
      content: 'Render Settings & Post-Processing - Configure render engine settings and apply post-processing effects',
      order: 9,
      isComplete: false
    },
    {
      id: 'step-10',
      content: 'Validation & Iteration - Compare the render with the reference image and make adjustments as needed',
      order: 10,
      isComplete: false
    },
    {
      id: 'step-11',
      content: 'Optimization & Finalization - Optimize the scene and generate the final render',
      order: 11,
      isComplete: false
    }
  ],
  createdAt: new Date(),
  usageCount: 0,
  isBuiltIn: true
};
