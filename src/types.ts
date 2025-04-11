import { User } from "@prisma/client";

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: Error };

  export type UserToCreate = {
    email: string;
    username: string;
    password: string;
  };
  
  export type UserCreateResult = {
    created: boolean;
    user?: User;
    reason?: 'exists';
  };

export type RecipeToCreate = {
  title: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  protein: number;
  fat: number;
  userId: string;
};
