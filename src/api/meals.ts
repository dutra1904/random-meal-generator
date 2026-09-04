import { pickRandom, shuffle } from "../lib/random";
import type {
  AreaListResponse,
  CategoryListResponse,
  Meal,
  MealApiResponse,
  MealFilters,
  MealSummary,
  MealSummaryResponse,
} from "../types/meal";

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const MATCH_BATCH_SIZE = 8;

async function requestJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export async function fetchRandomMeal(signal?: AbortSignal): Promise<Meal> {
  const data = await requestJson<MealApiResponse>("/random.php", signal);
  const meal = data.meals?.[0];

  if (!meal) {
    throw new Error("Nenhuma refeição retornada pela API");
  }

  return meal;
}

export async function fetchMealById(id: string, signal?: AbortSignal): Promise<Meal> {
  const data = await requestJson<MealApiResponse>(`/lookup.php?i=${encodeURIComponent(id)}`, signal);
  const meal = data.meals?.[0];

  if (!meal) {
    throw new Error("Receita não encontrada");
  }

  return meal;
}

export async function fetchCategories(signal?: AbortSignal): Promise<string[]> {
  const data = await requestJson<CategoryListResponse>("/list.php?c=list", signal);
  return (data.meals ?? []).map((item) => item.strCategory).filter(Boolean);
}

export async function fetchAreas(signal?: AbortSignal): Promise<string[]> {
  const data = await requestJson<AreaListResponse>("/list.php?a=list", signal);
  return (data.meals ?? []).map((item) => item.strArea).filter(Boolean);
}

export async function fetchFilteredMeals(
  filters: MealFilters,
  signal?: AbortSignal,
): Promise<MealSummary[]> {
  const params = new URLSearchParams();

  if (filters.category) params.set("c", filters.category);
  if (filters.area && !filters.category) params.set("a", filters.area);

  const data = await requestJson<MealSummaryResponse>(`/filter.php?${params.toString()}`, signal);
  return data.meals ?? [];
}

export async function fetchMealByFilters(
  filters: MealFilters,
  options: { excludeId?: string; signal?: AbortSignal } = {},
): Promise<Meal> {
  const { excludeId, signal } = options;

  if (!filters.category && !filters.area) {
    return fetchUniqueRandomMeal(excludeId, signal);
  }

  if (filters.category && filters.area) {
    return fetchMatchingCategoryAndArea(filters.category, filters.area, excludeId, signal);
  }

  const summaries = await fetchFilteredMeals(filters, signal);

  if (summaries.length === 0) {
    throw new Error("Nenhuma receita para esses filtros");
  }

  const pool = excludeId ? summaries.filter((item) => item.idMeal !== excludeId) : summaries;
  const chosen = pickRandom(pool.length > 0 ? pool : summaries);
  return fetchMealById(chosen.idMeal, signal);
}

async function fetchUniqueRandomMeal(excludeId?: string, signal?: AbortSignal): Promise<Meal> {
  let meal = await fetchRandomMeal(signal);

  for (let attempt = 0; attempt < 4 && excludeId && meal.idMeal === excludeId; attempt += 1) {
    meal = await fetchRandomMeal(signal);
  }

  return meal;
}

async function fetchMatchingCategoryAndArea(
  category: string,
  area: string,
  excludeId?: string,
  signal?: AbortSignal,
): Promise<Meal> {
  const summaries = await fetchFilteredMeals({ category, area: "" }, signal);

  if (summaries.length === 0) {
    throw new Error("Nenhuma receita para esses filtros");
  }

  const matched = summaries.filter((item) => item.strArea === area);

  if (matched.length > 0) {
    const pool = excludeId ? matched.filter((item) => item.idMeal !== excludeId) : matched;
    return fetchMealById(pickRandom(pool.length > 0 ? pool : matched).idMeal, signal);
  }

  const areasKnown = summaries.every((item) => item.strArea != null);

  if (areasKnown) {
    throw new Error("Nenhuma receita nessa combinação de categoria e culinária");
  }

  const shuffled = shuffle(summaries);

  for (let index = 0; index < shuffled.length; index += MATCH_BATCH_SIZE) {
    const batch = shuffled.slice(index, index + MATCH_BATCH_SIZE);
    const meals = await Promise.all(batch.map((item) => fetchMealById(item.idMeal, signal)));
    const match = meals.find((meal) => meal.strArea === area);

    if (match) return match;
  }

  throw new Error("Nenhuma receita nessa combinação de categoria e culinária");
}
