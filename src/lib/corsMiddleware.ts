import type { MiddlewareHandler } from 'hono';

export const corsMiddleware: MiddlewareHandler = async (c, next) => {
  console.log('🔥 CORS middleware virkt!');

  // Fyrst: setja hausana
  c.res.headers.set('Access-Control-Allow-Origin', '*'); // ← eða stillanlegur origin fyrir prod
  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // OPTIONS = preflight
  if (c.req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: c.res.headers,
    });
  }

  await next();
};
