import { serve } from '@hono/node-server';
import app from './app.js';

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log('🚀 Server listening on http://localhost:3000');
});
