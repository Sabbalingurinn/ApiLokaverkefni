import type { PrismaClient, Recipe } from "@prisma/client";
import type { ILogger } from "./logger.js";
import type { RecipeToCreate, Result } from "../types.js";

export class RecipesDbClient {
  constructor(private prisma: PrismaClient, private logger: ILogger) {}

  async createRecipe(data: RecipeToCreate): Promise<Result<Recipe>> {
    try {
      const recipe = await this.prisma.recipe.create({ data });
      return { ok: true, value: recipe };
    } catch (error) {
      this.logger.error("createRecipe error", data, error);
      return { ok: false, error: error as Error };
    }
  }

  async getAllRecipes(): Promise<Result<Recipe[]>> {
    try {
      const recipes = await this.prisma.recipe.findMany();
      return { ok: true, value: recipes };
    } catch (error) {
      this.logger.error("getAllRecipes error", error);
      return { ok: false, error: error as Error };
    }
  }

  async getRecipeById(id: string): Promise<Result<Recipe | null>> {
    try {
      const recipe = await this.prisma.recipe.findUnique({ where: { id } });
      return { ok: true, value: recipe };
    } catch (error) {
      this.logger.error("getRecipeById error", id, error);
      return { ok: false, error: error as Error };
    }
  }

  async deleteRecipe(id: string): Promise<Result<boolean>> {
    try {
      const recipe = await this.prisma.recipe.findUnique({ where: { id } });
      if (!recipe) return { ok: true, value: false };

      await this.prisma.recipe.delete({ where: { id } });
      return { ok: true, value: true };
    } catch (error) {
      this.logger.error("deleteRecipe error", id, error);
      return { ok: false, error: error as Error };
    }
  }

  async getRecipesByIngredients(
    ingredients: string[]
  ): Promise<Result<Recipe[]>> {
    try {
      const recipes = await this.prisma.recipe.findMany({
        where: {
          ingredients: {
            hasEvery: ingredients,
          },
        },
      });
      return { ok: true, value: recipes };
    } catch (error) {
      this.logger.error("getRecipesByIngredients error", ingredients, error);
      return { ok: false, error: error as Error };
    }
  }

  async searchRecipes(filters: {
    ingredients: string[];
    minCalories: number;
    maxCalories: number;
    minProtein: number;
    maxProtein: number;
    minFat: number;
    maxFat: number;
    userId?: string;
  }): Promise<Result<Recipe[]>> {
    try {
      const result = await this.prisma.recipe.findMany({
        where: {
          calories: {
            gte: filters.minCalories,
            lte: filters.maxCalories,
          },
          protein: {
            gte: filters.minProtein,
            lte: filters.maxProtein,
          },
          fat: {
            gte: filters.minFat,
            lte: filters.maxFat,
          },
          ...(filters.ingredients.length > 0 && {
            ingredients: {
              hasEvery: filters.ingredients,
            },
          }),
          ...(filters.userId && {
            userId: filters.userId,
          }),
        },
        orderBy: { createdAt: "desc" },
      });

      return { ok: true, value: result };
    } catch (error) {
      this.logger.error("searchRecipes error", filters, error);
      return { ok: false, error: error as Error };
    }
  }

  async updateRecipe(id: string, data: Partial<Recipe>): Promise<Result<Recipe | null>> {
    try {
      const recipe = await this.prisma.recipe.update({
        where: { id },
        data,
      });
      return { ok: true, value: recipe };
    } catch (error) {
      this.logger.error('updateRecipe error', { id, data, error });
      return { ok: false, error: error as Error };
    }
  }
}
