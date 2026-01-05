# Template Studio

A sophisticated React-based application for creating and exporting professional 1080×1920 story templates. Built with React Router 7, TypeScript, and a custom design system inspired by natural earth tones.

## 🎯 Overview

Template Studio is a complete solution for generating social media story templates with:
- **Template System**: Extensible React component architecture with typed props
- **Dynamic Forms**: Auto-generated forms based on template field definitions
- **Live Preview**: Real-time preview of template customizations
- **PNG Export**: Perfect 1080×1920 PNG exports using html-to-image
- **Gallery View**: Browse all available templates with thumbnails
- **Responsive Design**: Beautiful UI with dark mode support

## ✨ Features

### Core Functionality
- 🎨 **Template Editor** - Select templates, customize fields, and preview changes live
- 🖼️ **Image Export** - Export perfect 1080×1920 PNG images with a single click
- 📱 **Gallery Browser** - View all templates in a responsive grid layout
- 🔍 **Individual Preview** - View and export templates individually
- 🌓 **Dark Mode** - Automatic dark mode based on system preferences

### Technical Features
- 🚀 **Server-Side Rendering** - Built with React Router 7
- ⚡️ **Hot Module Replacement** - Fast development with HMR
- 📦 **Optimized Bundling** - Vite-powered build system
- 🔒 **TypeScript** - Full type safety throughout the application
- 🎨 **Custom Design System** - Curated color palette with earth tones
- 🎭 **Premium Fonts** - Cabinet Grotesk & Plus Jakarta Sans
- 📐 **Tailwind CSS 4** - Modern utility-first styling

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd stronzi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking

## 📁 Project Structure

```
stronzi/
├── app/
│   ├── templates/              # Template components and registry
│   │   ├── types.ts           # TypeScript types for template system
│   │   ├── index.ts           # Template registry and helpers
│   │   └── TemplateSanremoStory.tsx  # Example template
│   ├── routes/                # Page components
│   │   ├── home.tsx          # Landing page with hero section
│   │   ├── generate.tsx      # Main template generator
│   │   ├── preview-gallery.tsx      # Template gallery
│   │   └── preview.$templateId.tsx  # Single template preview
│   ├── utils/
│   │   └── exportImage.ts    # html-to-image export utility
│   ├── welcome/
│   │   └── welcome.tsx       # Welcome component
│   ├── app.css               # Global styles and design tokens
│   ├── root.tsx              # Root layout with navigation
│   └── routes.ts             # Route configuration
├── public/                    # Static assets
├── build/                     # Build output (generated)
│   ├── client/               # Client-side bundle
│   └── server/               # Server-side code
├── .github/
│   └── workflows/
│       └── deploy.yml        # AWS S3/CloudFront deployment
├── Dockerfile                # Multi-stage Docker build
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js        # Tailwind CSS configuration
├── react-router.config.ts    # React Router configuration
└── README.md
```

## 🎨 Using the Application

### Generating Templates

1. Navigate to `/generate`
2. Select a template from the dropdown menu
3. Customize the template fields:
   - **Text fields** - Edit titles, subtitles, and content
   - **Textarea fields** - Edit longer text blocks
   - **Image fields** - Paste image URLs
   - **Number fields** - Adjust numeric values
4. Watch the preview update in real-time
5. Click **Export PNG** to download your 1080×1920 image

### Browsing the Gallery

1. Navigate to `/preview` to see all available templates
2. Each template is displayed with sample data
3. Click any template to view it full-size at `/preview/:templateId`
4. Export directly from the preview page

## 🛠️ Creating Custom Templates

### 1. Define Your Template Component

Create a new file in `app/templates/` (e.g., `TemplateMyStory.tsx`):

```tsx
import React from 'react';
import type { FieldDef } from './types';

// Define the props interface
export interface MyStoryProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  description: string;
}

// Default values
export const defaultProps: MyStoryProps = {
  title: 'Your Title Here',
  subtitle: 'Your Subtitle',
  imageUrl: 'https://example.com/image.jpg',
  description: 'Your description text...'
};

// Field definitions for the form
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
    type: 'text',
    placeholder: 'https://...'
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter description...'
  }
];

// The template component (1080×1920)
const TemplateMyStory: React.FC<MyStoryProps> = ({ 
  title, 
  subtitle, 
  imageUrl, 
  description 
}) => {
  return (
    <div className="relative w-[1080px] h-[1920px] overflow-hidden bg-gradient-to-br from-sea to-deep-sea">
      {/* Background Image */}
      <img 
        src={imageUrl} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-16 text-white">
        <h1 className="font-display text-8xl font-bold mb-8 text-center">
          {title}
        </h1>
        <h2 className="font-display text-5xl mb-12 text-center">
          {subtitle}
        </h2>
        <p className="text-3xl text-center max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default TemplateMyStory;
```

### 2. Register Your Template

Add your template to `app/templates/index.ts`:

```tsx
import TemplateMyStory, { 
  defaultProps as myStoryDefaults, 
  fields as myStoryFields,
  type MyStoryProps 
} from './TemplateMyStory';

const templates: TemplateDefinition<any>[] = [
  // ... existing templates
  {
    id: 'my-story',
    name: 'My Story Template',
    component: TemplateMyStory,
    defaultProps: myStoryDefaults,
    fields: myStoryFields
  }
];
```

### 3. Test Your Template

1. Restart the dev server
2. Navigate to `/generate`
3. Select your template from the dropdown
4. Customize and export!

## 🎨 Design System

The application uses a custom design system with a carefully curated color palette:

### Color Palette

**Light Mode:**
- Sand (`#F5E6D3`) - Light backgrounds
- Desert (`#D4A574`) - Warm accents
- Sea (`#5B7C8D`) - Primary actions
- Dusk (`#4A4A4A`) - Primary text

**Dark Mode:**
- Deep Sea (`#1A2930`) - Dark backgrounds
- Sunset (`#F7941D`) - Warm highlights
- Accent Blue (`#5B7C8D`) - Links and actions

**Accent Colors:**
- Gold (`#D4AF37`)
- Oxblood (`#800020`)
- Bronze (`#CD7F32`)

### Typography

- **Display Font**: Cabinet Grotesk - For headings and titles
- **Body Font**: Plus Jakarta Sans - For content and UI

## 🏗️ Building for Production

Create an optimized production build:

```bash
npm run build
```

This generates:
```
build/
├── client/    # Static assets (HTML, CSS, JS, images)
└── server/    # Server-side rendering code
```

Start the production server:

```bash
npm run start
```

## 🐳 Docker Deployment

### Build the Docker Image

```bash
docker build -t template-studio .
```

### Run the Container

```bash
docker run -p 3000:3000 template-studio
```

The application will be available at `http://localhost:3000`.

### Multi-Stage Build

The Dockerfile uses a multi-stage build for optimal image size:
1. **development-dependencies-env** - Install all dependencies
2. **production-dependencies-env** - Install production dependencies only
3. **build-env** - Build the application
4. **final** - Minimal production image

## ☁️ AWS Deployment

The project includes automated deployment to AWS S3 + CloudFront via GitHub Actions.

### Prerequisites

Set up the following in your GitHub repository:

**Secrets:**
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

**Variables:**
- `AWS_REGION` - AWS region (e.g., `us-east-1`)
- `BUCKET_NAME` - S3 bucket name
- `DISTRIBUTION_ID` - CloudFront distribution ID

### Deployment Workflow

On push to `main` branch:
1. Checks out code
2. Sets up Node.js 22
3. Configures AWS credentials
4. Installs dependencies
5. Builds the application
6. Syncs `build/client/` to S3
7. Invalidates CloudFront cache

The static site is deployed from the `build/client/` directory.

## 🚀 Alternative Deployment Options

The application can be deployed to any platform supporting:

**Docker-based platforms:**
- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

**Node.js platforms:**
- Vercel
- Netlify
- Heroku
- Render

**Static hosting (client-side only):**
- AWS S3 + CloudFront (current setup)
- Netlify
- Vercel
- Cloudflare Pages

## 🧪 Type Safety

The application is fully typed with TypeScript:

- Template props are strongly typed
- Field definitions ensure type safety
- Auto-generated forms respect types
- Export utilities are type-safe

Run type checking:

```bash
npm run typecheck
```

## 📚 Additional Documentation

For detailed information about the template system, see [TEMPLATE_STUDIO.md](TEMPLATE_STUDIO.md).

## 🛠️ Tech Stack

- **React 19** - UI framework
- **React Router 7** - Routing and SSR
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **html-to-image** - PNG export
- **fast-average-color** - Color analysis
- **Node.js 20** - Runtime

## 📄 License

This project is private and not licensed for public use.

---

Built with precision and care using React Router and modern web technologies.
