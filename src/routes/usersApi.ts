import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { PrismaClient } from '@prisma/client';
import { UsersDbClient } from '../lib/users.db.js';
import { ConsoleLogger } from '../lib/logger.js';
import { UserCreateSchema } from '../schema.zod.js';

export const usersApi = new Hono();

const logger = new ConsoleLogger();
const usersClient = new UsersDbClient(new PrismaClient(), logger);

usersApi.get('/', async (c) => {
  const result = await usersClient.getAllUsers();
  if (!result.ok) return c.json({ error: result.error.message }, 500);
  return c.json(result.value);
});

usersApi.get('/:username', async (c) => {
  const username = c.req.param('username');
  const result = await usersClient.getUserByUsername(username);
  if (!result.ok) return c.json({ error: result.error.message }, 500);
  if (!result.value) return c.json({ error: 'User not found' }, 404);
  return c.json(result.value);
});

usersApi.post('/', zValidator('json', UserCreateSchema), async (c) => {
  const input = c.req.valid('json');
  const result = await usersClient.createUser(input);
  if (!result.ok) return c.json({ error: result.error.message }, 500);

  if (!result.value.created) {
    return c.json({ error: 'User already exists', user: result.value.user }, 409);
  }

  return c.json(result.value.user, 201);
});

usersApi.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const result = await usersClient.deleteUser(id);
  if (!result.ok) return c.json({ error: result.error.message }, 500);
  if (!result.value) return c.json({ error: 'User not found' }, 404);
  return c.body(null, 204);
});
