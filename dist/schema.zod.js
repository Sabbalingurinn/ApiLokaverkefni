"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeCreateSchema = exports.UserCreateSchema = void 0;
const zod_1 = require("zod");
exports.UserCreateSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    username: zod_1.z.string().min(3),
    password: zod_1.z.string().min(6),
});
exports.RecipeCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    ingredients: zod_1.z.array(zod_1.z.string().min(1)),
    instructions: zod_1.z.string().min(1),
    calories: zod_1.z.number().nonnegative(),
    protein: zod_1.z.number().nonnegative(),
    fat: zod_1.z.number().nonnegative(),
    userId: zod_1.z.string().min(1),
});
