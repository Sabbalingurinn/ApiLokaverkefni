import type { MiddlewareHandler } from 'hono';

export const corsMiddleware: MiddlewareHandler = async (c, next) => {
  console.log('🔥 CORS middleware virkt!');
  c.res.headers.set('Access-Control-Allow-Origin', '*'); // ← Prófaðu '*' til að tryggja virkni
  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (c.req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  await next();
};
