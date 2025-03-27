# Image2Blender Template

## Overview

The Image2Blender Template provides a systematic process for recreating a 2D reference image in Blender using MCP Blender tools. Instead of just producing documentation, this template actively guides the user through analyzing the reference image, implementing the 3D scene, and refining it until it matches the reference.

## Template Steps

1. **Reference Object Selection**: 
   - Analyze the reference image to identify objects with known dimensions (people, doors, vehicles, etc.)
   - Ask for human input on object selection and dimensions
   - Use the `create_object` tool to create a reference placeholder in Blender
   - Position the object to establish scale for the entire scene

2. **Camera Setup & Calibration**: 
   - Analyze the perspective, angle, and lens characteristics in the reference image
   - Ask for human input on camera positioning
   - Use the `create_object` tool to create a camera
   - Use `execute_blender_code` to configure lens settings
   - Make iterative adjustments based on test renders

3. **Lighting Analysis & Setup**: 
   - Identify primary light sources, direction, intensity, and color
   - Create lights in Blender using the `create_object` tool
   - Configure light properties with `execute_blender_code`
   - Adjust lighting to match the reference image mood and shadows

4. **Primary Element Blocking**: 
   - Identify major structural elements in the reference image
   - Create basic primitive shapes using the `create_object` tool
   - Position and scale elements according to the reference
   - Establish the fundamental composition of the scene

5. **Atmospheric & Environmental Effects**: 
   - Analyze fog, haze, or other atmospheric conditions
   - Implement volumetric effects using `execute_blender_code`
   - Create environmental elements that affect lighting and mood
   - Configure world settings to match the reference atmosphere

6. **Geometric Detailing**: 
   - Refine primitive shapes with additional detail
   - Use `execute_blender_code` for mesh operations
   - Consider `generate_hyper3d_model_via_text` for complex elements
   - Add structural components to enhance realism

7. **Surface Definition & Texturing**: 
   - Analyze material properties from the reference image
   - Create and apply materials using `set_material`
   - Use Polyhaven assets through `search_polyhaven_assets` and `download_polyhaven_asset`
   - Apply textures with `set_texture`

8. **Secondary & Tertiary Elements**: 
   - Identify and add smaller detail objects
   - Create connecting elements between primary structures
   - Add environmental objects for context and scale
   - Enhance scene complexity to match reference detail level

9. **Render Settings & Post-Processing**: 
   - Configure render engine settings
   - Implement post-processing effects to match reference style
   - Set up compositing nodes with `execute_blender_code`
   - Adjust color grading to match reference mood

10. **Validation & Iteration**: 
    - Generate comparative render with current settings
    - Analyze differences between render and reference
    - Make targeted adjustments using appropriate MCP tools
    - Iteratively refine until satisfactory match is achieved

11. **Optimization & Finalization**: 
    - Optimize geometry and materials for performance
    - Configure final render settings
    - Generate the completed 3D scene
    - Save and document the final Blender file

## Usage Example

The Image2Blender template is used to actively implement a 3D scene in Blender:

1. Present the template to guide the process:
   ```typescript
   const result = await templateThinkingTool.processThought({
     templateId: 'image2blender-template'
   }, context);
   ```

2. At each step, the MCP client:
   - Analyzes aspects of the reference image
   - Asks for necessary human input
   - Uses appropriate Blender MCP tools directly
   - Reviews progress and iterates as needed

3. The end result is an actual Blender scene that matches the reference image, not just documentation.

## Key Blender MCP Tools Used

Throughout the process, the following MCP tools are utilized directly:

- `create_object`: Create primitive shapes, cameras, and lights
- `modify_object`: Adjust position, rotation, and scale of objects
- `set_material`: Create and apply materials to objects
- `execute_blender_code`: Run custom Blender Python code for complex operations
- `get_object_info`: Retrieve detailed information about scene objects
- `get_scene_info`: Get overall scene information
- `search_polyhaven_assets`: Find appropriate assets for the scene
- `download_polyhaven_asset`: Import assets from Polyhaven
- `set_texture`: Apply downloaded textures to objects
- `generate_hyper3d_model_via_text`: Create complex geometry using AI
- `generate_hyper3d_model_via_images`: Create elements based on reference images

## Best Practices

- Begin with accurate scale establishment to ensure proportions match the reference
- Work progressively from large structures to small details
- Generate test renders after each significant change
- Regularly compare with the reference image and adjust accordingly
- Use Hyper3D for complex geometry that would be time-consuming to model manually
- Leverage Polyhaven assets for common elements to save time
- Maintain consistent scale relationships between elements
- Balance complexity with performance considerations
- Document important aspects of the implementation process