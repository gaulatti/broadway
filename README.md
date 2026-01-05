# Stronzi

A sophisticated React-based application for creating and exporting professional 1080×1920 story templates. Built with React Router 7, TypeScript, and a custom design system inspired by natural earth tones.

**🌐 Live Demo:** [https://stronzi.gaulatti.com](https://stronzi.gaulatti.com)

## 🎯 Overview

Stronzi is a complete solution for generating social media story templates with:

- **Template System** - Extensible React component architecture with typed props
- **Dynamic Forms** - Auto-generated forms based on template field definitions
- **Live Preview** - Real-time preview of template customizations
- **PNG Export** - Perfect 1080×1920 PNG exports
- **Gallery View** - Browse all available templates
- **Responsive Design** - Beautiful UI with automatic dark mode support

## ✨ Features

- 🎨 **Template Editor** - Select templates, customize fields, preview changes live
- 🖼️ **PNG Export** - Export perfect 1080×1920 images with one click
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

Development Commands

```bash
npm run dev        # Start development server
npm run build      # Create production build
npm run start      # Start production server
npm run typecheck  # Run TypeScript type checking
```

## 📚 Documentation

**Comprehensive documentation is available in the [Wiki](https://github.com/gaulatti/stronzi/wiki/Home):**

### Getting Started

- **[Installation Guide](https://github.com/gaulatti/stronzi/wiki/Installation-Guide)** - Complete setup instructions
- **[Quick Start](https://github.com/gaulatti/stronzi/wiki/Quick-Start)** - Get running in 5 minutes
- **[User Guide](https://github.com/gaulatti/stronzi/wiki/User-Guide)** - How to use the application

### Development

- **[Project Structure](https://github.com/gaulatti/stronzi/wiki/Project-Structure)** - Understanding the codebase
- **[Creating Templates](https://github.com/gaulatti/stronzi/wiki/Creating-Templates)** - Build custom templates
- **[Design System](https://github.com/gaulatti/stronzi/wiki/Design-System)** - Colors, typography, and styling
- **[API Reference](https://github.com/gaulatti/stronzi/wiki/API-Reference)** - Complete API documentation

### Deployment

- **[Building for Production](https://github.com/gaulatti/stronzi/wiki/Building-Production)** - Production builds
- **[Docker Deployment](https://github.com/gaulatti/stronzi/wiki/Docker-Deployment)** - Containerization guide
- **[AWS Deployment](https://github.com/gaulatti/stronzi/wiki/AWS-Deployment)** - AWS S3 + CloudFront setup
- **[Alternative Platforms](https://github.com/gaulatti/stronzi/wiki/Alternative-Platforms)** - Vercel, Netlify, Railway, etc.

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

Register it in `app/templates/index.ts` and you're done! See the [Creating Templates](https://github.com/gaulatti/stronzi/wiki/Creating-Templates) guide for details.\*React 19\*\* - UI framework

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
�️ Tech Stack

- **React 19** - UI framework
- **React Router 7** - Routing and SSR
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **html-to-image** - PNG export
- **Node.js 20** - Runtime

## 🤝 Contributing

See the [Wiki](https://github.com/gaulatti/stronzi/wiki/Home) for comprehensive documentation on:

- Project architecture
- Template system
- Design guidelines
- Development workflows

## 📄 License

This project is private and not licensed for public use.

---

**Built with precision** using React Router and modern web technologies.

For detailed documentation, visit the **[Wiki](https://github.com/gaulatti/stronzi/wiki/Home)** | Live demo at **[stronzi.gaulatti.com](https://stronzi.gaulatti.com)**
