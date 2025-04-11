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
exports.usersApi = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const client_1 = require("@prisma/client");
const users_db_js_1 = require("../lib/users.db.js");
const logger_js_1 = require("../lib/logger.js");
const schema_zod_js_1 = require("../schema.zod.js");
exports.usersApi = new hono_1.Hono();
const logger = new logger_js_1.ConsoleLogger();
const usersClient = new users_db_js_1.UsersDbClient(new client_1.PrismaClient(), logger);
exports.usersApi.get('/', (c) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield usersClient.getAllUsers();
    if (!result.ok)
        return c.json({ error: result.error.message }, 500);
    return c.json(result.value);
}));
exports.usersApi.get('/:username', (c) => __awaiter(void 0, void 0, void 0, function* () {
    const username = c.req.param('username');
    const result = yield usersClient.getUserByUsername(username);
    if (!result.ok)
        return c.json({ error: result.error.message }, 500);
    if (!result.value)
        return c.json({ error: 'User not found' }, 404);
    return c.json(result.value);
}));
exports.usersApi.post('/', (0, zod_validator_1.zValidator)('json', schema_zod_js_1.UserCreateSchema), (c) => __awaiter(void 0, void 0, void 0, function* () {
    const input = c.req.valid('json');
    const result = yield usersClient.createUser(input);
    if (!result.ok)
        return c.json({ error: result.error.message }, 500);
    if (!result.value.created) {
        return c.json({ error: 'User already exists', user: result.value.user }, 409);
    }
    return c.json(result.value.user, 201);
}));
exports.usersApi.delete('/:id', (c) => __awaiter(void 0, void 0, void 0, function* () {
    const id = c.req.param('id');
    const result = yield usersClient.deleteUser(id);
    if (!result.ok)
        return c.json({ error: result.error.message }, 500);
    if (!result.value)
        return c.json({ error: 'User not found' }, 404);
    return c.body(null, 204);
}));
