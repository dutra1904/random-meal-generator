import type { Ingredient, Meal } from "../types/meal";

const INGREDIENTS_LIMIT = 20;

export function parseIngredients(meal: Meal): Ingredient[] {
  return Array.from({ length: INGREDIENTS_LIMIT }, (_, index) => index + 1)
    .map((index) => ({
      name: meal[`strIngredient${index}`]?.trim() ?? "",
      measure: meal[`strMeasure${index}`]?.trim() ?? "",
    }))
    .filter(({ name }) => Boolean(name))
    .map(({ name, measure }) => ({
      name,
      measure,
      display: measure ? `${name} – ${measure}` : name,
    }));
}
