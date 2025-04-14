import { z } from "zod";

export const UserCreateSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
});

export const UserLoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(1),
});

export const RecipeCreateSchema = z.object({
  title: z.string().min(1),
  ingredients: z.array(z.string().min(1)),
  instructions: z.string().min(1),
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  userId: z.string().min(1),
});
