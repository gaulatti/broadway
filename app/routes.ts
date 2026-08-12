import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('generate', 'routes/generate.tsx'),
  route('preview', 'routes/preview-gallery.tsx'),
  route('preview/:templateId', 'routes/preview.$templateId.tsx'),
  layout('routes/admin/layout.tsx', [
    route('admin', 'routes/admin/dashboard.tsx'),
    route('admin/analytics', 'routes/admin/analytics.tsx'),
    route('admin/users', 'routes/admin/users.tsx'),
    route('admin/settings', 'routes/admin/settings.tsx'),
  ]),
] satisfies RouteConfig;
