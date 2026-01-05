# Template Studio

A React-based system for creating and exporting 1080×1920 story templates. Select templates, customize fields, preview changes live, and export perfect PNG images.

## Features

- **Template System**: React components with typed props and metadata
- **Dynamic Forms**: Auto-generated forms based on template field definitions
- **Live Preview**: Real-time preview of template changes
- **PNG Export**: Perfect 1080×1920 PNG exports using html2canvas
- **Gallery View**: Browse all available templates with thumbnails
- **Individual Preview**: View and export individual templates

## Project Structure

```
app/
├── templates/              # Template components and registry
│   ├── types.ts           # TypeScript types for template system
│   ├── index.ts           # Template registry and helpers
│   └── TemplateSanremoStory.tsx  # Example template
├── routes/                # Page components
│   ├── home.tsx          # Landing page
│   ├── generate.tsx      # Main generator page
│   ├── preview-gallery.tsx      # Template gallery
│   └── preview.$templateId.tsx  # Single template preview
├── utils/
│   └── exportImage.ts    # html2canvas export utility
└── root.tsx              # Root layout with navigation
```

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. **Navigate to:**
   - Home: `http://localhost:5173/`
   - Generate: `http://localhost:5173/generate`
   - Gallery: `http://localhost:5173/preview`

## Usage

### Generating Templates

1. Navigate to `/generate`
2. Select a template from the dropdown
3. Edit fields in the form (text, textarea, images, numbers)
4. Watch the preview update in real-time
5. Click "Export PNG" to download a 1080×1920 image

### Browsing Templates

1. Navigate to `/preview` to see all templates
2. Click any template to view it full-size
3. Export directly from the preview page

## Creating New Templates

### 1. Create the Template Component

Create a new file in `app/templates/` (e.g., `TemplateMyStory.tsx`):

```tsx
import React from 'react';
import type { FieldDef } from './types';

export interface MyStoryProps {
  title: string;
  subtitle: string;
  imageUrl: string;
}

export const defaultProps: MyStoryProps = {
  title: 'My Title',
  subtitle: 'My Subtitle',
  imageUrl: 'https://example.com/image.jpg'
};

export const fields: Array<FieldDef<MyStoryProps>> = [
  {
    key: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Enter title...'
  },
  {
    key: 'subtitle',
    label: 'Subtitle',
    type: 'text',
    placeholder: 'Enter subtitle...'
  },
  {
    key: 'imageUrl',
    label: 'Image URL',
    type: 'image',
    placeholder: 'https://...'
  }
];

const TemplateMyStory: React.FC<MyStoryProps> = ({ title, subtitle, imageUrl }) => {
  return (
    <div style={{ width: '1080px', height: '1920px' }}>
      {/* Your template design here */}
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <img src={imageUrl} alt={title} />
    </div>
  );
};

export default TemplateMyStory;
```

### 2. Register the Template

Add your template to `app/templates/index.ts`:

```tsx
import TemplateMyStory, { defaultProps as myStoryDefaultProps, fields as myStoryFields, type MyStoryProps } from './TemplateMyStory';

export const templates: TemplateDefinition[] = [
  // ... existing templates
  {
    id: 'my_story',
    name: 'My Story',
    Component: TemplateMyStory,
    defaultProps: myStoryDefaultProps,
    fields: myStoryFields
  } as TemplateDefinition<MyStoryProps>
];
```

### 3. Template Guidelines

- **Dimensions**: The outermost container must be exactly 1080×1920 pixels
- **Images**: Use `crossOrigin="anonymous"` on img tags for CORS support
- **Fonts**: Add custom fonts in `root.tsx` links function
- **Props**: All props should be serializable (strings, numbers, booleans)
- **Field Types**:
  - `text`: Single-line text input
  - `textarea`: Multi-line text input (use `rows` property)
  - `number`: Numeric input (use `min`, `max`, `step` properties)
  - `image`: URL input for images

## Field Type Reference

### Text Field

```tsx
{
  key: 'name',
  label: 'Name',
  type: 'text',
  placeholder: 'Enter name...',
}
```

### Textarea Field

```tsx
{
  key: 'description',
  label: 'Description',
  type: 'textarea',
  placeholder: 'Enter description...',
  rows: 5,
}
```

### Number Field

```tsx
{
  key: 'age',
  label: 'Age',
  type: 'number',
  min: 0,
  max: 120,
  step: 1,
}
```

### Image Field

```tsx
{
  key: 'imageUrl',
  label: 'Image URL',
  type: 'image',
  placeholder: 'https://...',
}
```

## Export Functionality

The export utility (`app/utils/exportImage.ts`) handles:

1. **Font Loading**: Waits for `document.fonts.ready`
2. **Image Loading**: Ensures all images are loaded before capture
3. **High-Quality Capture**: Uses 2× scale for crisp output
4. **Exact Dimensions**: Guarantees 1080×1920 output regardless of device pixel ratio
5. **CORS Handling**: Uses `useCORS: true` for external images
6. **Download**: Automatically triggers PNG download

### Export Best Practices

- Use images with CORS enabled (add `crossOrigin="anonymous"`)
- Wait for fonts to load (handled automatically)
- Keep templates at exactly 1080×1920 pixels
- Test exports on different devices/browsers

## Styling

This project uses:

- **Tailwind CSS**: For utility-first styling
- **Custom CSS**: For template-specific styles
- **Inline Styles**: For precise dimensions and transforms

### Preview Scaling

Templates are displayed at 30% scale (0.3) in the UI:

- Full size: 1080×1920
- Display size: 324×576
- Export size: 1080×1920 (always)

## Troubleshooting

### Images not exporting correctly

- Ensure images have CORS headers enabled
- Add `crossOrigin="anonymous"` to img tags
- Use https:// URLs for external images

### Fonts not rendering in export

- Add font links in `root.tsx` links function
- Wait for fonts to load (handled automatically)
- Use web-safe fallback fonts

### Export size incorrect

- Verify template container is exactly 1080×1920px
- Check for CSS that might override dimensions
- Ensure no transforms on the export container

### Template not appearing in gallery

- Check template is imported in `app/templates/index.ts`
- Verify template ID is unique
- Ensure defaultProps and fields are exported

## Technologies

- **React 19**: UI framework
- **React Router 7**: Routing
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **html2canvas**: PNG export

## License

This project is private and proprietary.
