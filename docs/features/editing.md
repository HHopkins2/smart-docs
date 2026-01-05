---
title: Editing Documentation
description: How to edit markdown files and frontmatter
---

# Editing Documentation

Smart Docs provides a built-in editor for modifying documentation.

## Entering Edit Mode

1. Select a file from the sidebar
2. Click the **Edit** button in the toolbar
3. The view switches to edit mode

## Content Editor

The main textarea lets you write markdown directly:

- Monospace font for code readability
- Full-height editor that expands with content
- No auto-formatting - write raw markdown

### Tips

- Use the preview (exit edit mode) to check rendering
- Keyboard shortcut: Changes are not auto-saved

## Frontmatter Editor

Above the content editor, you can manage YAML frontmatter:

### Viewing Fields

Existing frontmatter fields are displayed as editable inputs:

```
title:       [My Document    ]
description: [A brief desc   ]
```

### Adding Fields

1. Click **+ Add field**
2. Enter the field name (e.g., `author`, `tags`, `date`)
3. Fill in the value

### Removing Fields

Click the **×** button next to any field to remove it.

### Supported Values

Currently, frontmatter values are stored as strings. For complex values like arrays or objects, enter them as comma-separated or JSON strings.

## Saving Changes

Click **Save** to write changes to disk. The file is updated immediately.

## Canceling Changes

Click **Cancel** to discard changes and return to view mode. No changes are saved.

## Real-time Updates

If the file is modified externally (e.g., in your code editor), Smart Docs detects the change and can refresh the view. However, if you're in edit mode, you'll need to reload to see external changes.
