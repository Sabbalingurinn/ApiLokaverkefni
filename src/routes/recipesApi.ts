import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { PrismaClient } from '@prisma/client';

import { RecipesDbClient } from '../lib/recipes.db.js';
import { ConsoleLogger } from '../lib/logger.js';
import { RecipeCreateSchema } from '../schema.zod.js';

export const recipesApi = new Hono();

const logger = new ConsoleLogger();
const recipesClient = new RecipesDbClient(new PrismaClient(), logger);

recipesApi.get('/', async (c) => {
  const ingredients = c.req.query('ingredients');

  if (ingredients) {
    const list = ingredients.split(',').map((i) => i.trim().toLowerCase());
    const result = await recipesClient.getRecipesByIngredients(list);
    if (!result.ok) return c.json({ error: result.error.message }, 500);
    return c.json(result.value);
  }

  const result = await recipesClient.getAllRecipes();
  if (!result.ok) return c.json({ error: result.error.message }, 500);
  return c.json(result.value);
});

recipesApi.get('/', async (c) => {
  const ingredientsQuery = c.req.query('ingredients');
  const ingredients = ingredientsQuery
    ? ingredientsQuery.split(',').map((i) => i.trim().toLowerCase())
    : [];

  const parseNum = (val: string | null | undefined, fallback: number) =>
    val ? parseInt(val) : fallback;

  const filters = {
    ingredients,
    minCalories: parseNum(c.req.query('minCalories'), 0),
    maxCalories: parseNum(c.req.query('maxCalories'), Number.MAX_SAFE_INTEGER),
    minProtein: parseNum(c.req.query('minProtein'), 0),
    maxProtein: parseNum(c.req.query('maxProtein'), Number.MAX_SAFE_INTEGER),
    minFat: parseNum(c.req.query('minFat'), 0),
    maxFat: parseNum(c.req.query('maxFat'), Number.MAX_SAFE_INTEGER),
  };

  const result = await recipesClient.searchRecipes(filters);
  if (!result.ok) return c.json({ error: result.error.message }, 500);
  return c.json(result.value);
});


recipesApi.post('/', zValidator('json', RecipeCreateSchema), async (c) => {
  const input = c.req.valid('json');
  const result = await recipesClient.createRecipe(input);
  if (!result.ok) return c.json({ error: result.error.message }, 500);
  return c.json(result.value, 201);
});

recipesApi.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const result = await recipesClient.deleteRecipe(id);
  if (!result.ok) return c.json({ error: result.error.message }, 500);
  if (!result.value) return c.json({ error: 'Not found' }, 404);
  return c.body(null, 204);
});
