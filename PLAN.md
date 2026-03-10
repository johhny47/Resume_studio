# Plan: Convert CSS to TailwindCSS and Build Components

## Information Gathered:
- Current project uses Tailwind CSS v4 with `@import "tailwindcss"` and `@theme` directives
- CSS file has extensive custom component classes in `@layer components`
- App.jsx contains all functionality in a single file with ~500+ lines
- Main functions: add text, upload image, templates, font controls, color pickers, z-index, export, canvas editing

## Plan:
### Step 1: Clean up index.css
- Remove all `@layer components` custom classes
- Keep only Tailwind v4 theme configuration (@theme)

### Step 2: Create Component Files
1. **Button.jsx** - Reusable button with variants (primary, secondary, success, warning, danger)
2. **Select.jsx** - Reusable select dropdown
3. **ColorPicker.jsx** - Color picker component
4. **SizeControl.jsx** - Font size +/- control
5. **MenuBar.jsx** - Main menu bar with all controls
6. **HeightControlBar.jsx** - Canvas height adjustment bar
7. **Canvas.jsx** - Canvas area with elements
8. **CanvasElement.jsx** - Individual draggable/resizable elements
9. **TemplateDropdown.jsx** - Template selection dropdown
10. **ExportDropdown.jsx** - Export options dropdown
11. **Modal.jsx** - Reusable modal component

### Step 3: Refactor App.jsx
- Import and use all new components
- Pass props to components
- Remove inline styles where possible

### Step 4: Test and Verify
- Run the development server
- Verify all functionality works

## Dependent Files to Edit:
- `src/index.css` - Clean up
- `src/App.jsx` - Refactor to use components
- Create new files in `src/components/`

## Followup Steps:
- Run `npm run dev` to test
- Verify all buttons, dropdowns, canvas work properly

