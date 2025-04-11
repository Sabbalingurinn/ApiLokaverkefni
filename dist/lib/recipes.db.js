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
exports.RecipesDbClient = void 0;
class RecipesDbClient {
    constructor(prisma, logger) {
        this.prisma = prisma;
        this.logger = logger;
    }
    createRecipe(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipe = yield this.prisma.recipe.create({ data });
                return { ok: true, value: recipe };
            }
            catch (error) {
                this.logger.error('createRecipe error', data, error);
                return { ok: false, error: error };
            }
        });
    }
    getAllRecipes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipes = yield this.prisma.recipe.findMany();
                return { ok: true, value: recipes };
            }
            catch (error) {
                this.logger.error('getAllRecipes error', error);
                return { ok: false, error: error };
            }
        });
    }
    getRecipeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipe = yield this.prisma.recipe.findUnique({ where: { id } });
                return { ok: true, value: recipe };
            }
            catch (error) {
                this.logger.error('getRecipeById error', id, error);
                return { ok: false, error: error };
            }
        });
    }
    deleteRecipe(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipe = yield this.prisma.recipe.findUnique({ where: { id } });
                if (!recipe)
                    return { ok: true, value: false };
                yield this.prisma.recipe.delete({ where: { id } });
                return { ok: true, value: true };
            }
            catch (error) {
                this.logger.error('deleteRecipe error', id, error);
                return { ok: false, error: error };
            }
        });
    }
    getRecipesByIngredients(ingredients) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipes = yield this.prisma.recipe.findMany({
                    where: {
                        ingredients: {
                            hasSome: ingredients,
                        },
                    },
                });
                return { ok: true, value: recipes };
            }
            catch (error) {
                this.logger.error('getRecipesByIngredients error', ingredients, error);
                return { ok: false, error: error };
            }
        });
    }
}
exports.RecipesDbClient = RecipesDbClient;
