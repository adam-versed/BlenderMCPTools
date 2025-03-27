# BlenderMCPTools

A framework for enhancing Blender workflows through structured thinking paradigms.

## Project Overview

BlenderMCPTools is a modular system that provides MCP clients with specialized tools for approaching 3D modeling and rendering in Blender using predefined cognitive frameworks. It acts as a "thinking scratchpad" that guides problem-solving through explicit, step-by-step reasoning processes optimized for Blender workflows.

## Key Features

- **Template-based Thinking**: Structured frameworks for Blender-related tasks
- **Context-aware Template Selection**: Auto-selection of appropriate thinking templates
- **Flexible Integration**: Common interface for all thinking tools

## Architecture

The project follows a modular architecture centered around specialized thinking tools:

```
BlenderMCPTools/
├── src/
│   ├── common/              # Shared types and utilities
│   ├── persistence/         # Data persistence layer
│   ├── tools/               # Thinking tools implementations
│   │   ├── template-thinking/   # Template-based thinking
│   │   │   ├── intelligence/    # ML/pattern matching
│   │   │   ├── recommender/     # Template recommendations
│   └── index.ts             # Main entry point
```

## Functional Components

### Template Thinking

Template Thinking provides structured frameworks for approaching different Blender-related tasks:

- **Template Manager**: Core component that manages templates and thinking sessions
- **Template Recommender**: Analyzes problem context and selects appropriate templates
- **Intelligence Layer**: Pattern recognition and context understanding
- **Learning System**: Tracks template effectiveness and adapts recommendations

### Common Infrastructure

- **Type Definitions**: Shared interfaces across thinking tools
- **Persistence Manager**: Storage and retrieval of thinking artifacts
- **Chat Formatting**: Integration with MCP client's chat interface

## System Flow

1. **Problem Description**: User presents a problem to the MCP client
2. **Context Analysis**: System analyzes the problem description
3. **Template Recommendation**: Appropriate thinking templates are recommended
4. **Template Selection**: User or system selects the most suitable template
5. **Session Creation**: A structured thinking session is created
6. **Guided Steps**: MCP client works through the structured thinking steps
7. **Results & Learning**: Outcomes are stored for improving future recommendations

## User Experience Workflow

Template Thinking provides MCP clients with a structured approach to tackle complex Blender problems using predefined or custom templates. Here's how it works from the user's perspective:

### 1. Initialization

When a user asks the MCP client to analyze something methodically, the client can invoke the Template Thinking tool to guide its analysis process:

- The MCP client determines an appropriate template for the task
- The system creates a new session with that template
- The MCP client presents the template structure to the user, highlighting the current step

**What the user sees**: The MCP client introduces the template approach and focuses on the first step, asking targeted questions to complete that step.

### 2. Guided Step-by-Step Process

As the conversation progresses:

- The MCP client completes each step based on user input and its own analysis
- After completing a step, the MCP client uses the tool to mark that step complete and advance to the next one
- The session's state is maintained across the conversation

**What the user sees**: The MCP client clearly indicates which step is currently active and shows progress through the template. Each response from the MCP client is structured around completing the current step and transitioning to the next.

### 3. Benefits for the User

The Template Thinking approach offers several advantages:

- **Thoroughness**: Ensures all important aspects are considered systematically
- **Transparency**: Users can see the thinking process and contribute at each step
- **Consistency**: Provides a repeatable approach to similar problems
- **Customization**: Templates can be tailored to specific domains or tasks

### 4. Custom Templates

Users can have the MCP client create custom templates for specialized tasks:

- The MCP client can define a new template with appropriate steps
- The template is stored for future use
- The MCP client can immediately start using the new template

This allows the approach to be tailored to specific Blender workflows (material creation, lighting setup, modeling, etc.) rather than using generic templates.

## Example Interaction: Image2Blender

```
User: "I have a noir-style reference image of a futuristic cityscape that I'd like to recreate in Blender."

MCP client: "I'll help you recreate that noir cityscape in Blender using a structured approach.

📋 IMAGE2BLENDER (Step 1 of 11)
→ Current step: Reference Object Selection - Identify known-size object in the reference image and create a placeholder in Blender

To establish the correct scale in our 3D recreation, we need to identify something in your reference image with a known size. This could be:
- A person (typically ~6ft/1.83m tall)
- A door (standard height ~7ft/2.1m)
- A vehicle (car length ~4.5m)
- Street furniture (lamp post, fire hydrant, etc.)

Can you identify any objects with known dimensions in your noir cityscape image? Once identified, I'll help you create a placeholder in Blender to establish scale."

User: "There's a person standing on a walkway in the foreground, about 6ft tall."

MCP client: "📋 IMAGE2BLENDER (Step 2 of 11)
✓ Step 1: Reference Object Selection - Identified a person (~6ft/1.83m tall) as our scale reference
→ Current step: Camera Setup & Calibration - Create and position a camera in Blender to match the reference image perspective

I'll create a placeholder for our 6ft human reference:

```python
# Create a simple placeholder for the 6ft (1.83m) tall person
create_object(
    type="CUBE", 
    name="human_reference",
    scale=[0.4, 0.2, 1.83],  # Width, depth, height in meters
    location=[0, 0, 0.915]   # Position so bottom is at ground level (half height)
)
```

Now, let's analyze the camera perspective in your noir cityscape. From the image:
1. Is it shot from a low, eye-level, or high angle?
2. Does it use a wide, normal, or telephoto perspective?
3. Are there any noticeable distortions (lens distortion, fisheye effect, etc.)?

This information will help me configure the camera in Blender to match your reference image."

[Conversation continues through remaining steps]

MCP client: "📋 IMAGE2BLENDER (Completed)
✓ Step 1: Reference Object Selection
✓ Step 2: Camera Setup & Calibration
✓ Step 3: Lighting Analysis & Setup
✓ Step 4: Primary Element Blocking
✓ Step 5: Atmospheric & Environmental Effects
✓ Step 6: Geometric Detailing
✓ Step 7: Surface Definition & Texturing
✓ Step 8: Secondary & Tertiary Elements
✓ Step 9: Render Settings & Post-Processing
✓ Step 10: Validation & Iteration
✓ Step 11: Optimization & Finalization

The 3D scene has been successfully created in Blender based on your noir cityscape reference image. We've implemented:

1. The distinctive futuristic towers with appropriate scale
2. Noir-style lighting with dramatic backlighting
3. Volumetric fog for atmosphere
4. Materials with the metallic, industrial look
5. Black and white post-processing with film grain

The final scene has been saved to /tmp/noir_scene_final.blend and is ready for rendering."
```

## Usage Example (Code)

### Template Thinking with Auto-Selection

```typescript
// Example of using template thinking with auto-selection
const result = await templateThinkingTool.processThought({
  command: {
    type: 'auto-select-template',
    problemDescription: 'I need to recreate this reference image in Blender'
  }
}, context);

// Response includes selected template, active step, and formatted output
console.log(result.selectedTemplate); // "image2blender-template"
console.log(result.activeStep);       // "reference-object-selection"
console.log(result.formattedOutput);  // Formatted text for MCP client to present to user
```

### Template Thinking with Manual Template Selection

```typescript
// Example of manually selecting a template
const result = await templateThinkingTool.processThought({
  command: {
    type: 'select-template',
    templateId: 'image2blender-template',
    sessionName: 'Noir Cityscape Recreation'
  }
}, context);

// Completing a step in the template
const updateResult = await templateThinkingTool.processThought({
  command: {
    type: 'complete-step',
    sessionId: result.sessionId,
    stepId: result.activeStep.id,
    content: 'Identified a person (~6ft/1.83m tall) as our scale reference'
  }
}, context);
```

### Custom Template Creation

```typescript
// Example of creating a custom template
const result = await templateThinkingTool.processThought({
  command: {
    type: 'create-template',
    template: {
      name: 'Blender Material Creation',
      description: 'Template for creating realistic PBR materials in Blender',
      category: 'materials',
      steps: [
        { content: 'Analyze reference material properties', order: 1 },
        { content: 'Set up base material node structure', order: 2 },
        { content: 'Configure color and albedo', order: 3 },
        { content: 'Set up roughness/metallic properties', order: 4 },
        { content: 'Add texture maps and UV configuration', order: 5 },
        { content: 'Configure displacement/normal mapping', order: 6 },
        { content: 'Add procedural detail variations', order: 7 },
        { content: 'Test render and iterate', order: 8 }
      ]
    }
  }
}, context);
```

## Getting Started

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Future Directions

1. **Enhanced Blender Integration**: Direct API hooks into Blender's Python API
2. **Domain-Specific Templates**: Pre-built templates for specialized Blender workflows
3. **Visual Thinking Maps**: Graphical representation of thinking processes for Blender tasks
4. **Asset Generation**: Integration with Blender's asset browser system
5. **Learning from Demos**: Pattern recognition from recorded Blender actions
