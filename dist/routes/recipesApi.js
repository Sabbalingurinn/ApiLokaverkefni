"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipesApi = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const client_1 = require("@prisma/client");
const recipes_db_js_1 = require("../lib/recipes.db.js");
const logger_js_1 = require("../lib/logger.js");
const schema_zod_js_1 = require("../schema.zod.js");
exports.recipesApi = new hono_1.Hono();
const logger = new logger_js_1.ConsoleLogger();
const recipesClient = new recipes_db_js_1.RecipesDbClient(new client_1.PrismaClient(), logger);
exports.recipesApi.get('/', (c) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredients = c.req.query('ingredients');
    if (ingredients) {
        const list = ingredients.split(',').map((i) => i.trim().toLowerCase());
        const result = yield recipesClient.getRecipesByIngredients(list);
        if (!result.ok)
            return c.json({ error: result.error.message }, 500);
        return c.json(result.value);
    }
    const result = yield recipesClient.getAllRecipes();
    if (!result.ok)
        return c.json({ error: result.error.message }, 500);
    return c.json(result.value);
}));
exports.recipesApi.get('/:id', (c) => __awaiter(void 0, void 0, void 0, function* () {
    const id = c.req.param('id');
    const result = yield recipesClient.getRecipeById(id);
    if (!result.ok)
        return c.json({ error: result.error.message }, 500);
    if (!result.value)
        return c.json({ error: 'Not found' }, 404);
    return c.json(result.value);
}));
exports.recipesApi.post('/', (0, zod_validator_1.zValidator)('json', schema_zod_js_1.RecipeCreateSchema), (c) => __awaiter(void 0, void 0, void 0, function* () {
    const input = c.req.valid('json');
    const result = yield recipesClient.createRecipe(input);
    if (!result.ok)
        return c.json({ error: result.error.message }, 500);
    return c.json(result.value, 201);
}));
exports.recipesApi.delete('/:id', (c) => __awaiter(void 0, void 0, void 0, function* () {
    const id = c.req.param('id');
    const result = yield recipesClient.deleteRecipe(id);
    if (!result.ok)
        return c.json({ error: result.error.message }, 500);
    if (!result.value)
        return c.json({ error: 'Not found' }, 404);
    return c.body(null, 204);
}));
