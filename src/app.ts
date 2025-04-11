import { Hono } from 'hono';
import { usersApi } from './routes/usersApi.js';
import { recipesApi } from './routes/recipesApi.js';

const app = new Hono();

app.route('/users', usersApi);
app.route('/recipes', recipesApi);


app.get('/', (c) => {
  return c.text('Hono API virkar!');
});

export default app;
