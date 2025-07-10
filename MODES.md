# TerraDraw Drawing Modes User Manual

This manual describes all the drawing modes available in TerraDraw for MapGL. Each mode provides different functionality for creating and editing geometric shapes on the map.

## Overview

TerraDraw provides a comprehensive set of drawing tools for creating various geometric shapes and features on maps. The library supports both drawing new features and editing existing ones with advanced selection capabilities.

## Drawing Modes

### 1. Select Mode (`select`)

The select mode allows you to interact with existing features on the map.

**Features:**
- **Selection**: Click on any feature to select it
- **Dragging**: Move selected features by dragging them
- **Rotation**: Rotate polygons and linestrings using rotation handles
- **Scaling**: Resize features using scale handles
- **Coordinate Editing**: 
  - Drag individual coordinates to reshape features
  - Add new coordinates at midpoints (for polygons and linestrings)
  - Delete coordinates by selecting and pressing delete
- **Snapping**: Snap coordinates to nearby features while editing

**Usage:**
1. Click the select tool to activate selection mode
2. Click on any feature to select it
3. Use the handles that appear to manipulate the feature
4. Click elsewhere to deselect

### 2. Point Mode (`point`)

Create individual point markers on the map.

**Features:**
- Single-click to place points
- Editable after creation when selected
- Draggable points
- Customizable point appearance (round, square, or minimal)

**Usage:**
1. Select the point tool
2. Click anywhere on the map to place a point
3. Switch to select mode to edit or move points

### 3. LineString Mode (`linestring`)

Draw connected line segments to create paths, routes, or boundaries.

**Features:**
- Click to add points along the line
- Click on the last point (highlighted with a cap) to finish the line
- Coordinate snapping for precise alignment
- Editable coordinates with midpoint insertion
- Draggable and rotatable when selected

**Usage:**
1. Select the linestring tool
2. Click to place the first point
3. Continue clicking to add more points
4. Click on the last point (highlighted with a cap) to complete the line

### 4. Polygon Mode (`polygon`)

Create closed shapes with multiple sides.

**Features:**
- Click to add vertices around the perimeter
- Click on one of the boundary points (highlighted with a cap) to close the polygon
- Self-intersection validation to prevent invalid shapes
- Pointer distance threshold for easier drawing (20px default)
- Advanced editing capabilities when selected
- Coordinate snapping support

**Usage:**
1. Select the polygon tool
2. Click to place the first vertex
3. Continue clicking to add more vertices
4. Click on one of the boundary points (highlighted with a cap) to close the polygon

### 5. Rectangle Mode (`rectangle`)

Draw rectangular shapes quickly and precisely.

**Features:**
- Click and drag to define the rectangle
- Perfect for creating building footprints or area selections
- Resizable from center or corners when selected
- Maintains aspect ratio during creation

**Usage:**
1. Select the rectangle tool
2. Click and drag from one corner to the opposite corner
3. Release to complete the rectangle

### 6. Circle Mode (`circle`)

Create perfect circular shapes.

**Features:**
- Click and drag to define radius
- Center-fixed resizing when selected
- Useful for buffer zones or circular areas of interest

**Usage:**
1. Select the circle tool
2. Click to set the center point
3. Drag outward to define the radius
4. Release to complete the circle

### 7. Freehand Mode (`freehand`)

Draw organic, hand-drawn style shapes.

**Features:**
- Natural drawing experience with mouse/touch
- Automatic shape closure for enclosed areas
- Minimum distance filtering (10px) for smoother curves
- Pointer distance threshold for better performance
- Ideal for sketching irregular boundaries

**Usage:**
1. Select the freehand tool
2. Click and drag to draw continuously
3. Release to complete the shape (automatically closes if drawing forms an enclosed area)

### 8. Angled Rectangle Mode (`angled-rectangle`)

Create rectangles that can be rotated to any angle.

**Features:**
- More flexible than standard rectangles
- Can be oriented to match features like buildings or property lines
- Rotatable and scalable when selected

**Usage:**
1. Select the angled rectangle tool
2. Click and drag to define one side of the rectangle
3. Move to define the width
4. Click to complete

### 9. Sector Mode (`sector`)

Draw pie-slice or sector shapes.

**Features:**
- Useful for representing directional areas or zones
- Adjustable radius and angle
- Perfect for radar coverage, lighting cones, or vision fields

**Usage:**
1. Select the sector tool
2. Click to set the center point
3. Define the direction and angle of the sector
4. Set the radius

### 10. Sensor Mode (`sensor`)

Create specialized sensor or detection area shapes.

**Features:**
- Designed for representing sensor coverage areas
- Complex geometric shapes for technical applications
- Customizable parameters for different sensor types

**Usage:**
1. Select the sensor tool
2. Follow the prompts to define sensor parameters
3. Adjust coverage area as needed

### 11. Render Mode (`arbitrary`)

Display and interact with pre-existing GeoJSON features.

**Features:**
- Load external GeoJSON data
- Custom styling for imported features
- Read-only display mode for reference data
- Styled with blue fill (#4357AD) and teal outline (#48A9A6)

## Style Controls

### Color Picker
- Click the color indicator to open a color picker
- Choose any color for outlines and fills
- Applies to new features and can update selected features

### Stroke Width
- Adjust line thickness from 1-10 pixels
- Use the slider control for quick adjustments
- Affects all linear elements (outlines, lines)

### Point Cap Style
- **Round**: Circular points (default)
- **Square**: Square-shaped points
- **None**: Minimal dot points

## Utility Functions

### Download
- Export all drawn features as GeoJSON
- Downloads as `features.json` file
- Compatible with GIS software and web mapping libraries

### Clear
- Remove all features from the map
- Includes confirmation prompt to prevent accidental clearing
- Cannot be undone, so use with caution

## User Interface Interactions

### Completing Features
- **LineString**: Click on the last point (highlighted with a visual cap) to finish drawing
- **Polygon**: Click on one of the boundary points (highlighted with caps) to close the shape
- **Other shapes**: Most other modes complete automatically when you finish the drawing gesture

### Visual Indicators
- **Highlighted caps**: Show clickable points for completing features
- **Midpoints**: Appear as white dots on selected features for adding new coordinates
- **Selection handles**: Allow rotation, scaling, and coordinate manipulation

## Best Practices

1. **Use snapping** when precision is important
2. **Start with select mode** to interact with existing features
3. **Use appropriate modes** for your use case (e.g., rectangle for buildings, freehand for organic shapes)
4. **Regularly save/download** your work to prevent data loss
5. **Test different point cap styles** to match your visual requirements

## Validation and Constraints

- Polygons automatically validate against self-intersection
- Minimum distance thresholds prevent overly complex shapes
- Coordinate precision is maintained for accuracy
- Features can be edited extensively after creation

## Integration Notes

This drawing system integrates with MapGL and provides full TerraDraw functionality. All features are stored as valid GeoJSON and can be exported or integrated with other mapping systems.