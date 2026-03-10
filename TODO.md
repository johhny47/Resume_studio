# TODO: Menu Bar Enhancement - Fancy Icons & 2-Row Layout

## Task: Make all menu bar button icons fancy and implement 2-row layout

### Steps:
- [x] 1. Install lucide-react for fancy icons
- [x] 2. Update Button.jsx to support icon-only buttons with better styling (ghost, icon variants)
- [x] 3. Restructure MenuBar.jsx into 2 rows:
  - Row 1: Main actions (Text, Shapes, Table, Upload, Save, Templates, Delete, Export)
  - Row 2: Styling controls (Alignment, Font, Size, Bold, Colors, Shape, Z-index, Height)
- [x] 4. Replace all simple text icons with Lucide fancy icons:
  - Type icon for Text
  - Square, Circle, Triangle for Shapes
  - Table for Table
  - Image for Upload
  - Save for Save
  - Trash2 for Delete
  - AlignLeft, AlignCenter, AlignRight for text alignment
  - Bold for bold
  - Underline, Strikethrough for text decoration
  - MoveUp, MoveDown for z-index
  - Plus, Minus for height
  - LayoutTemplate for logo
- [x] 5. Add hover effects, shadows, and grouped button styles
- [x] 6. Test the changes - Development server running at http://localhost:5178/

### Notes:
- Menu bar now has a clean 2-row layout
- All buttons use fancy Lucide icons
- Added dividers between control groups
- Styled button groups with shadows and borders
- Icon-only buttons for delete and toolbar actions
- Ghost variant for inactive state buttons

