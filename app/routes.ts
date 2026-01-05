import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('generate', 'routes/generate.tsx'),
  route('preview', 'routes/preview-gallery.tsx'),
  route('preview/:templateId', 'routes/preview.$templateId.tsx')
] satisfies RouteConfig;
