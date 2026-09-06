# Broadway

A sophisticated React-based generator for creating and exporting polished visuals and documents from reusable templates. Built with React Router 7, TypeScript, and a custom design system inspired by natural earth tones.

**🌐 Live Demo:** [https://broadway.gaulatti.com](https://broadway.gaulatti.com)

## 🎯 Overview

Broadway is a complete solution for generating customizable templates across multiple formats, with:

- **Template System** - Extensible React component architecture with typed props
- **Dynamic Forms** - Auto-generated forms based on template field definitions
- **Live Preview** - Real-time preview of template customizations
- **Multi-format Export** - High-quality PNG export and PDF export for resume templates
- **Gallery View** - Browse all available templates
- **Responsive Design** - Beautiful UI with automatic dark mode support

## ✨ Features

- 🎨 **Template Editor** - Select templates, customize fields, and preview changes live
- 🖼️ **PNG Export** - Export high-quality images with one click
- 📄 **PDF Export** - Export resume templates as vector PDFs with selectable text
- 📱 **Gallery Browser** - View all templates in responsive grid
- 🌓 **Dark Mode** - Automatic system preference detection
- 🚀 **Server-Side Rendering** - Built with React Router 7
- ⚡️ **Hot Module Replacement** - Fast development experience
- 🔒 **TypeScript** - Full type safety
- 🎨 **Custom Design System** - Earth-tone color palette
- 📐 **Tailwind CSS 4** - Modern utility-first styling

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, pnpm, or bun

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd broadway
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
- `npm test` - Run template/export contract tests
- `npm run typecheck` - Run TypeScript type checking
- `npm run video:compositions` - Enumerate isolated programmatic-video compositions
- `npm run video:render` - Render the committed 15-second Modo Italiano fixture
- `npm run video:verify` - Inspect the rendered media contract with `ffprobe`
- `npm run video:draft:create` - Validate a finalized Alana fixture and create an unpublished excerpt draft
- `npm run video:draft:render -- <draft-directory>` - Render a queued excerpt draft without publishing it
- `npm run video:draft:verify -- <draft-directory>` - Verify the rendered draft and selected duration

### Admin UI ownership

Broadway's application and administration UI uses
[`@gaulatti/bleecker`](https://github.com/gaulatti/bleecker) as its component
and layout source of truth. Import admin controls from Bleecker's public
`components/*` and `layout/*` entry points; do not create a parallel local
dashboard or shadcn-style component library in Broadway. Broadway-local
components are reserved for product-specific template authoring, preview, and
export behavior.

## 📁 Project Structure

Development Commands

```bash
npm run dev        # Start development server
npm run build      # Create production build
npm run start      # Start production server
npm run typecheck  # Run TypeScript type checking
```

## 📚 Documentation

**Comprehensive documentation is available in the [Wiki](https://github.com/gaulatti/broadway/wiki/Home):**

### Getting Started

- **[Installation Guide](https://github.com/gaulatti/broadway/wiki/Installation-Guide)** - Complete setup instructions
- **[Quick Start](https://github.com/gaulatti/broadway/wiki/Quick-Start)** - Get running in 5 minutes
- **[User Guide](https://github.com/gaulatti/broadway/wiki/User-Guide)** - How to use the application

### Development

- **[Project Structure](https://github.com/gaulatti/broadway/wiki/Project-Structure)** - Understanding the codebase
- **[Creating Templates](https://github.com/gaulatti/broadway/wiki/Creating-Templates)** - Build custom templates
- **[Design System](https://github.com/gaulatti/broadway/wiki/Design-System)** - Colors, typography, and styling
- **[API Reference](https://github.com/gaulatti/broadway/wiki/API-Reference)** - Complete API documentation

### Deployment

- **[Building for Production](https://github.com/gaulatti/broadway/wiki/Building-Production)** - Production builds
- **[Docker Deployment](https://github.com/gaulatti/broadway/wiki/Docker-Deployment)** - Containerization guide
- **[AWS Deployment](https://github.com/gaulatti/broadway/wiki/AWS-Deployment)** - AWS S3 + CloudFront setup
- **[Alternative Platforms](https://github.com/gaulatti/broadway/wiki/Alternative-Platforms)** - Vercel, Netlify, Railway, etc.

## 🎯 Quick Example

Create a simple template in minutes:

```tsx
// app/templates/TemplateHello.tsx
export interface HelloProps {
  name: string;
}

export const defaultProps: HelloProps = { name: 'World' };

export const fields: Array<FieldDef<HelloProps>> = [{ key: 'name', label: 'Name', type: 'text' }];

const TemplateHello: React.FC<HelloProps> = ({ name }) => (
  <div className='w-[1080px] h-[1920px] bg-sea flex items-center justify-center'>
    <h1 className='font-display text-9xl text-white'>Hello, {name}!</h1>
  </div>
);

export default TemplateHello;
```

Register it in `app/templates/index.ts` and you're done! See the [Creating Templates](https://github.com/gaulatti/broadway/wiki/Creating-Templates) guide for details.\*React 19\*\* - UI framework
Register it in `app/templates/index.ts` and you're done! See the [Creating Templates](https://github.com/gaulatti/broadway/wiki/Creating-Templates) guide for details.

### Packaged font contract

Every template registered for PNG export must declare its exact `fonts` in its `TemplateDefinition`. Each face records its family, style, weight, owning package, and locally bundled WOFF2 asset. Registration fails closed when the declaration is missing, duplicated, malformed, or points at a remote runtime URL.

Broadway renders previews through `TemplateFontBoundary` and builds PNG font embedding from the same declaration. Handlebars/iframe templates receive the same generated faces inside their document. Do not add Google Fonts links, remote font stylesheets, or undeclared system-font fallbacks. Add a Fontsource package (or a future versioned template-package asset export), define the face in `fontAssets.ts`, and include only the faces the template uses.

The future component-library path uses the same `TemplateFontAsset` shape: the component package can own and export its asset URLs and metadata without Broadway assuming every file lives in its repository. All resolved URLs must still be packaged with the application or supplied as font data URLs.

PNG export preflights every declared font and image. Missing fonts, non-embeddable external images, and other capture failures are reported separately through Bleecker's error UI instead of browser alerts or console-only failures.

### Programmatic-video contract

Deterministic motion compositions live in the isolated [`video/`](video/) package so Remotion and renderer dependencies cannot affect Broadway's existing React application or its PNG/PDF export path. The package owns a versioned, typed `VideoTemplateDefinition`, JSON fixture validation, local font and logo assets, composition enumeration, H.264 rendering, `ffprobe` verification, deterministic representative-frame checks, and render-cost reporting. It also turns an explicitly human-selected window from a finalized, checksummed Alana recording into a deterministic, approval-required recording excerpt draft. Draft lifecycle state covers queued, rendering, rendered, failed, and canceled outcomes; no automatic publication path exists. See [`video/README.md`](video/README.md) for commands, landed contract pins, ownership boundaries, asset provenance, offline-render verification, and licensing constraints.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this software as long as you include the license notice.

---

Built with precision using React Router and modern web technologies.

## 🛠️ Tech Stack

- **React 19** - UI framework
- **React Router 7** - Routing and SSR
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **html-to-image** - PNG export
- **@react-pdf/renderer** - Vector PDF export for resumes
- **Node.js 20** - Runtime

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

For more details, see the [Wiki](https://github.com/gaulatti/broadway/wiki/Home) for comprehensive documentation on:

- Project architecture
- Template system
- Design guidelines
- Development workflows

---

**Built with precision** using React Router and modern web technologies.

For detailed documentation, visit the **[Wiki](https://github.com/gaulatti/broadway/wiki/Home)** | Live demo at **[broadway.gaulatti.com](https://broadway.gaulatti.com)**
