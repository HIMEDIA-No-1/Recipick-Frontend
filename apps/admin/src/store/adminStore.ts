import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User,
  Recipe,
  Ingredient,
  FavoriteRecipe
} from '../__mocks__/data.mock';
import {
  mockUsers,
  mockRecipes,
  mockIngredients,
  mockFavoriteRecipes
} from '../__mocks__/data.mock';

interface AdminStore {
  // Data
  users: User[];
  recipes: Recipe[];
  ingredients: Ingredient[];
  favoriteRecipes: FavoriteRecipe[];

  // Actions
  initializeData: () => void;

  // User management
  toggleUserStatus: (userId: string) => void;

  // Recipe management
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecipe: (recipeId: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (recipeId: string) => void;

  // Analytics helpers
  getUserStats: () => {
    totalUsers: number;
    activeUsers: number;
    deletedUsers: number;
    dailySignups: { [date: string]: number };
    monthlySignups: { [month: string]: number };
  };

  getRecipeStats: () => {
    totalRecipes: number;
    favoriteStats: { recipeId: string; title: string; favoriteCount: number }[];
  };

  getIngredientStats: () => {
    totalIngredients: number;
    disposedCount: number;
    disposalRate: number;
    categoryStats: { [category: string]: number };
  };
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      users: [],
      recipes: [],
      ingredients: [],
      favoriteRecipes: [],

      initializeData: () => {
        const currentData = get();

        // Only initialize if data is empty
        if (currentData.users.length === 0) {
          set({
            users: mockUsers,
            recipes: mockRecipes,
            ingredients: mockIngredients,
            favoriteRecipes: mockFavoriteRecipes
          });
        }
      },

      toggleUserStatus: (userId: string) => {
        set((state) => ({
          users: state.users.map(user =>
            user.id === userId
              ? { ...user, isDeleted: !user.isDeleted }
              : user
          )
        }));
      },

      addRecipe: (recipeData) => {
        const newRecipe: Recipe = {
          ...recipeData,
          id: `recipe-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          recipes: [...state.recipes, newRecipe]
        }));
      },

      updateRecipe: (recipeId: string, updates: Partial<Recipe>) => {
        set((state) => ({
          recipes: state.recipes.map(recipe =>
            recipe.id === recipeId
              ? { ...recipe, ...updates, updatedAt: new Date().toISOString() }
              : recipe
          )
        }));
      },

      deleteRecipe: (recipeId: string) => {
        set((state) => ({
          recipes: state.recipes.filter(recipe => recipe.id !== recipeId),
          favoriteRecipes: state.favoriteRecipes.filter(fav => fav.recipeId !== recipeId)
        }));
      },

      getUserStats: () => {
        const { users } = get();
        const activeUsers = users.filter(user => !user.isDeleted);
        const deletedUsers = users.filter(user => user.isDeleted);

        // Calculate daily signups
        const dailySignups: { [date: string]: number } = {};
        const monthlySignups: { [month: string]: number } = {};

        users.forEach(user => {
          const date = new Date(user.createdAt);
          const dateKey = date.toISOString().split('T')[0];
          const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

          dailySignups[dateKey] = (dailySignups[dateKey] || 0) + 1;
          monthlySignups[monthKey] = (monthlySignups[monthKey] || 0) + 1;
        });

        return {
          totalUsers: users.length,
          activeUsers: activeUsers.length,
          deletedUsers: deletedUsers.length,
          dailySignups,
          monthlySignups
        };
      },

      getRecipeStats: () => {
        const { recipes, favoriteRecipes } = get();

        // Calculate favorite counts for each recipe
        const favoriteCounts: { [recipeId: string]: number } = {};
        favoriteRecipes.forEach(fav => {
          favoriteCounts[fav.recipeId] = (favoriteCounts[fav.recipeId] || 0) + 1;
        });

        const favoriteStats = recipes
          .map(recipe => ({
            recipeId: recipe.id,
            title: recipe.title,
            favoriteCount: favoriteCounts[recipe.id] || 0
          }))
          .sort((a, b) => b.favoriteCount - a.favoriteCount);

        return {
          totalRecipes: recipes.length,
          favoriteStats
        };
      },

      getIngredientStats: () => {
        const { ingredients } = get();
        const disposedIngredients = ingredients.filter(ing => ing.state === 'DISPOSED');

        // Calculate category statistics
        const categoryStats: { [category: string]: number } = {};
        ingredients.forEach(ingredient => {
          categoryStats[ingredient.category] = (categoryStats[ingredient.category] || 0) + 1;
        });

        return {
          totalIngredients: ingredients.length,
          disposedCount: disposedIngredients.length,
          disposalRate: ingredients.length > 0 ? (disposedIngredients.length / ingredients.length) * 100 : 0,
          categoryStats
        };
      }
    }),
    {
      name: 'user_state',
      partialize: (state) => ({
        users: state.users,
        recipes: state.recipes,
        ingredients: state.ingredients,
        favoriteRecipes: state.favoriteRecipes
      })
    }
  )
);