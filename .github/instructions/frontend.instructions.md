---
applyTo: "**/app/**, **/components/**, **/layouts/**, **/pages/**"
---

# Frontend aesthetics instructions

This instruction set enforces a distinct, creative frontend aesthetic for UI work in the repository. Interpret these guidelines creatively and make unexpected choices that feel genuinely designed for the context.

## Repository structure

This is a React application using React Router with the following structure:
- `app/` - Main source directory
- `app/components/` - React components (including `ui/` subdirectory for primitives)
- `app/layouts/` - Layout components
- `app/pages/` - Page components
- `app/hooks/` - Custom React hooks
- `app/contexts/` - React context providers
- `app/utils/` - Utility functions

## Typography

The application uses distinctive typography:
- **Primary font**: `Libre Franklin` (Google Fonts, variable weight 100-900)
- **Display font**: `Comodo` (custom font loaded from `/fonts/`)
- **Monospace**: System monospace stack for code/timestamps

When adding new text elements, use the established font-family patterns and avoid introducing generic fonts.

## Color & Theme

The application uses CSS custom properties for theming. Key variables include:
- `--accent` and `--accent-rgb` for category/column accent colors
- Predefined accent colors: red, yellow, cyan, green, blue, gray, purple
- Dark theme with `rgba()` transparency patterns

All theme colors should be defined in `app/app.css` and referenced via CSS variables.

## Motion

The application uses Framer Motion for animations. Motion patterns include:
- Pulse animations for live indicators
- Slide-in animations for notifications
- Hover transforms with subtle lift effects (`translateY(-1px)`)

Prefer bold, singular motion moments (staggered entrance on page load) rather than many tiny animations.

## Implementation hints
- Use CSS variables defined in `app/app.css` and reference them everywhere.
- Follow the existing glassmorphism aesthetic: `backdrop-filter: blur()`, semi-transparent backgrounds.
- Use the established spacing and border-radius patterns (8px, 12px for cards/modals).
- Provide a short rationale for any creative, unexpected choice so reviewers understand intent.

## Examples of applyTo paths
- app/components/**
- app/layouts/**
- app/pages/**

## What to avoid in generated code
- Hardcoded font stacks that don't match the Libre Franklin / Comodo pattern.
- Generic purple-on-white gradients without contextual rationale.
- Copying widely used UI kits without customization.
- Introducing new CSS frameworks or overriding Tailwind CSS v4 configuration.

## Review checklist for frontend changes
- [ ] Typography choice is distinctive and documented.
- [ ] Theme variables used and documented.
- [ ] Motion is purposeful and performant.
- [ ] Backgrounds add atmosphere and are accessible (contrast checks).
- [ ] PR includes screenshots or short animated GIFs demonstrating visual changes.
